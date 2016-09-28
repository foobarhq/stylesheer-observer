import type { StyleSheetObserverCallback, DocumentLike } from '../types';

export default class StyleSheetObserver {

  /** @protected */
  callback: StyleSheetObserverCallback;

  constructor(callback: StyleSheetObserverCallback) {
    if (typeof callback !== 'function') {
      throw new TypeError('expected callback to be a function');
    }

    this.callback = callback;
  }

  observe(target: DocumentLike): void {
    if (!isDocumentOrDocumentFragment(target)) {
      throw new TypeError('Invalid target type, Expected Document or DocumentFragment');
    }

    if (this.isObserved(target)) {
      throw new Error('target is already being observed.');
    }
  }

  isObserved() {
    return false;
  }

  disconnect(): void {}

  /** @protected */
  send(target, added, removed) {
    if (removed.length > 0 || added.length > 0) {
      this.callback({
        target,
        removedStyleSheets: removed,
        addedStyleSheets: added,
      });
    }
  }
}

function isDocumentOrDocumentFragment(item) {
  if (item == null) {
    return false;
  }

  if (item instanceof Document) {
    return true;
  }

  if (typeof DocumentFragment === 'function' && item instanceof DocumentFragment) {
    return true;
  }

  return false;
}
