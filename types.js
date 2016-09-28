export type StyleSheetObserverEntry = {
  target: Document | DocumentFragment,
  removedStyleSheets: StyleSheet[],
  addedStyleSheets: StyleSheet[],
};

export type StyleSheetObserverCallback = (entries: StyleSheetObserverEntry) => void;

export type DocumentLike = Document | DocumentFragment;
