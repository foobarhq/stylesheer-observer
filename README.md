# StyleSheet Observer

Detect changes made to StyleSheetLists.

This class calls the callback once a [`StyleSheet`](https://developer.mozilla.org/en-US/docs/Web/API/StyleSheet) 
instance has been either added or removed from a document or document fragment.

## Usage

```javascript
import StyleSheetObserver from 'stylesheet-observer';

const observer = new StyleSheetObserver(changes => {
  // changes.target;
  // changes.removedStyleSheets;
  // changes.addedStyleSheets;
});

// Observe stylesheets added to or removed from the document.
observer.observe(document);

// also works on shadow roots
observer.observe(aShadowRoot);
```

As this observer watches the DOM for style nodes; For performance reasons, the observer makes the assumption 
that all stylesheets are either placed as direct children of document heads or as direct children of Shadow Roots. 
If that isn't the case, you can enable the `watchChildren` option when observing.

```javascript
// Watch the whole light DOM tree
observer.observe(document, { watchChildren: true });

// Watch a whole shadow DOM tree
observer.observe(aShadowRoot, { watchChildren: true });
```

## Dependencies

This project uses `WeakMap`, `MutationObserver` and `Symbol` internally, if your targeted browsers do not support 
either, you will need to install a polyfill in order to use the `StyleSheetObserver`.

## Interfaces

Interfaces based on native APIs `ResizeObserver` and `MutationObserver`.

```javascript
interface StyleSheetObserver {
    constructor(callback: (entries: StyleSheetObserverEntry) => void);

    observe(target: DocumentLike, options: StyleSheetObserverOptions): void;
    disconnect(): void;
}

type DocumentLike = Document | DocumentFragment;

type StyleSheetObserverEntry = {
    target: DocumentLike,
    removedStyleSheets: StyleSheet[],
    addedStyleSheets: StyleSheet[],
};

type StyleSheetObserverOptions = {
    // defaults to false
    watchChildren: boolean,
};
```
