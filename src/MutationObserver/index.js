import type { StyleSheetObserverCallback, DocumentLike } from '../../types';
import BaseStyleSheetObserver from '../BaseStyleSheetObserver';
import TargetManager from './TargetManager';
import getMutationObserver from './get-mutation-observer';

const CONFIG = { attributes: false, childList: true, characterData: false };

/**
 * Watches for stylesheet changes by watching dom mutations.
 */
export default class DomMutStyleSheetObserver extends BaseStyleSheetObserver {

  observer: MutationObserver;

  targetManagers: WeakMap<DocumentLike, TargetManager> = new WeakMap();

  /**
   * @param callback - The function to call when a stylesheet changed.
   */
  constructor(callback: StyleSheetObserverCallback) {
    super(callback);

    const MutationObserver = getMutationObserver();

    this.observer = new MutationObserver(mutations => {
      for (const mutation: MutationRecord of mutations) {
        const target: Node = getRootNode(mutation.target);

        // detached nodes do not produce nor contain any stylesheets
        if (isDetachedNode(target)) {
          continue;
        }

        const manager = this.targetManagers.get(target);

        if (isStyleNode(mutation.target)) {
          manager.handleNodeEdit(mutation.target);
          continue;
        }

        const addedStyleNodes = Array.prototype.filter.call(mutation.addedNodes, node => isStyleNode(node));
        const removedStyleNodes = Array.prototype.filter.call(mutation.removedNodes, node => isStyleNode(node));
        manager.handleNodeListChange(addedStyleNodes, removedStyleNodes);
      }
    });
  }

  /**
   * @param target - The Document or DocumentFrament to watch.
   * @param [watchChildren] - Watch descendants of watched nodes as well.
   */
  observe(target: DocumentLike, { watchChildren = false } = {}): void {
    super.observe(target);

    this.targetManagers.set(target, new TargetManager(target, this));

    const styleElementContainer = watchChildren ? target : getStylesRoot(target);
    const config = watchChildren ? CONFIG : Object.create(CONFIG, {
      subtree: { value: true },
    });

    this.observer.observe(styleElementContainer, config);
  }

  isObserved(target: DocumentLike) {
    return this.targetManagers.has(target);
  }

  disconnect(): void {
    this.observer.disconnect();
    this.targetManagers = new WeakMap();
  }
}

function isStyleNode(node: Node) {
  // TODO replace rel by relList
  return node.nodeName === 'STYLE' || (node.nodeName === 'LINK' && node.rel === 'stylesheet');
}

function getStylesRoot(documentLike: DocumentLike) {
  if (documentLike instanceof Document) {
    return documentLike.head;
  }

  return documentLike;
}

function getRootNode(node) {
  if (node.parentNode) {
    return getRootNode(node.parentNode);
  }

  return node;
}

function isDetachedNode(node: Node) {
  // cannot use instanceof here because classes recreated for each window, which means each iframe
  if (node.nodeName === '#document') {
    // no default view, detached document (eg from old iframe).
    if (!node.defaultView) {
      return true;
    }

    // top frame document. Never detached.
    if (node.defaultView.parent === node.defaultView) {
      return false;
    }

    // sub-frame, check parent document.
    return isDetachedNode(node.defaultView.parent.document);
  }

  // Shadow root
  if (node.host) {
    return isDetachedNode(node.host);
  }

  if (!node.parentNode) {
    return true;
  }

  // non-document nodes have an ownerDocument property
  return isDetachedNode(getRootNode(node));
}
