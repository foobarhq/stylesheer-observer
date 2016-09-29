import type { DocumentLike } from '../../types';
import StyleSheetObserverDomMutation from './index';

type NodeCache = {
  styleSheet: StyleSheet,
  proxy: ?HTMLLinkElement,
};

const isProxyNode = Symbol('isProxyNode');

/*
 * <style> and <link> elements can be placed... basically anywhere
 */

export default class StyleSheetHolder {

  cacheSymbol = Symbol('NodeMetadata');

  target: DocumentLike;
  observer: StyleSheetObserverDomMutation;

  constructor(target: DocumentLike, styleSheetObserver: StyleSheetObserverDomMutation) {
    this.target = target;
    this.observer = styleSheetObserver;
  }

  handleNodeListChange(addedNodes: Node[], removedNodes: Node[]) {
    const addedStyleSheets = [];
    for (const addedNode of addedNodes) {
      if (isProxy(addedNode)) {
        // ignore proxy nodes to avoid infinite loops.
        continue;
      }

      if (typeof addedNode[this.cacheSymbol] !== 'object') {
        addedNode[this.cacheSymbol] = {};
      }

      if (isLoading(addedNode) || isLoadingFirefox(addedNode)) {
        this.waitForStyleSheet(addedNode);
      } else {
        const sheet = addedNode.sheet;
        addedNode[this.cacheSymbol].styleSheet = sheet;
        addedStyleSheets.push(sheet);
      }

      if (addedNode.nodeName === 'STYLE') {
        // The styleSheet will be replaced if the node's textContent is changed.
        // As the textContent is just a text node, watch the node's children.
        this.observer.observer.observe(addedNode, { childList: true });
      } else if (addedNode.nodeName === 'LINK') {
        // The `load` event does not fire twice, so we need to watch the node's href attribute.
        this.observer.observer.observe(addedNode, { attributes: true, attributeFilter: ['href'] });
      }
    }

    const removedStyleSheets = [];
    for (const removedNode of removedNodes) {
      if (isProxy(removedNode)) {
        // ignore proxy nodes to avoid infinite loops.
        continue;
      }

      const cache: NodeCache = removedNode[this.cacheSymbol] || {};
      deleteProxy(cache);

      if (cache.styleSheet) {
        removedStyleSheets.push(cache.styleSheet);
        cache.styleSheet = null;
      }
    }

    if (addedStyleSheets.length > 0 || removedStyleSheets.length > 0) {
      this.send(addedStyleSheets, removedStyleSheets);
    }
  }

  handleNodeEdit(node: HTMLStyleElement | HTMLLinkElement) {
    if (isProxy(node)) {
      // ignore proxy nodes to avoid infinite loops.
      return;
    }

    if (isLoading(node) || isLoadingFirefox(node)) {
      return this.waitForStyleSheet(node);
    }

    this.handleAsynclyLoadedNode(node);
  }

  handleAsynclyLoadedNode(node) {
    const cache: NodeCache = node[this.cacheSymbol];
    const cachedStyleSheet = cache.styleSheet;
    cache.styleSheet = node.sheet;

    this.send([node.sheet], cachedStyleSheet ? [cachedStyleSheet] : []);
  }

  waitForStyleSheet(node: HTMLLinkElement) {
    // Node onload is never fired twice, so we need a proxy. -_-
    const proxy = node[this.cacheSymbol].proxy = node.cloneNode();
    proxy[isProxyNode] = true;

    const cache = node[this.cacheSymbol];

    proxy.addEventListener('load', () => {
      deleteProxy(cache);

      this.handleAsynclyLoadedNode(node);
    });

    proxy.addEventListener('error', () => {
      deleteProxy(cache);

      const cachedStyleSheet = cache.styleSheet;
      cache.styleSheet = null;

      // url was changed and now it's broken, mark previous sheet as deleted.
      if (cachedStyleSheet) {
        this.send([], [cachedStyleSheet]);
      }
    });

    node.parentNode.insertBefore(proxy, node);
  }

  send(added, removed) {
    this.observer.send(this.target, added, removed);
  }
}

function isProxy(node) {
  return Boolean(node[isProxyNode]);
}

function isLoading(node) {
  return node.nodeName === 'LINK' && !node.sheet;
}

/**
 * Workaround firefox's system.
 * Firefox adds the sheet even if it hasn't loaded yet and throws if you try to access the cssRules property.
 *
 * @param node - A node implementing LinkStyle.
 * @returns {boolean} The styleSheet has loaded.
 */
function isLoadingFirefox(node: LinkStyle): boolean {

  const sheet = node.sheet;

  try {
    // noinspection BadExpressionStatementJS
    sheet.cssRules || sheet.rules; // eslint-disable-line

    // we accessed them, which means that the sheet is both loaded (or not on firefox) and non-scrambled.
    return false;
  } catch (e) {
    // Could be SecurityError but that one means that the contents are scrambled (cross-origin).
    // So if it is not InvalidAccessError, the sheet is loaded.
    return e.name === 'InvalidAccessError';
  }
}

function deleteProxy(cache: NodeCache) {
  const proxy = cache.proxy;
  if (!proxy) {
    return;
  }

  cache.proxy = null;
  if (!proxy.parentNode) {
    return;
  }

  proxy.parentNode.removeChild(proxy);
}
