# StyleSheet Observer

Detect changes made to [`StyleSheetLists`](https://developer.mozilla.org/en-US/docs/Web/API/StyleSheetList).

This library enables you to register a function that will be called every time 
a [`StyleSheet`](https://developer.mozilla.org/en-US/docs/Web/API/StyleSheet) instance has been either added or 
removed from a document or document fragment's styleSheet property.

## Install

`npm install --save stylesheet-observer`

## Usage

```javascript
import StyleSheetObserver from 'stylesheet-observer';

// register the observer along with the callback.
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
these, you will need to install a polyfill in order to use the `StyleSheetObserver`.

## Browser Support

Tested on the following with the babel polyfill:

- Chrome >= 18
- Firefox >= 14
- IE >= 11
- Opera >= 15
- Safari >= 6

It might work on older versions if you polyfill `MutationObserver`.

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
    /** Observed element on which the change occured */
    target: DocumentLike,
    
    /** List of styleSheets that were removed */
    removedStyleSheets: StyleSheet[],
    
    /** List of styleSheets that were added */
    addedStyleSheets: StyleSheet[],
};

type StyleSheetObserverOptions = {
    // defaults to false
    watchChildren: boolean,
};
```
