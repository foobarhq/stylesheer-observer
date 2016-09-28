// import type { DocumentLike } from '../../types';
// import StyleSheetObserver from '../StyleSheetObserver';
// import runnableLoop from './runnable-loop';
//
// type StyleSheetStorage = { styleSheets: StyleSheet[], owners: Node[] };
//
// /**
//  * Checks
//  */
// export default class StyleSheetObserverInterval extends StyleSheetObserver {
//
//   /** @private */
//   styleSheetCaches: WeakMap<DocumentLike, StyleSheetStorage> = new WeakMap();
//
//   /** @private */
//   documents: Set<DocumentLike> = new Set();
//
//   /**
//    * Use this to set the time to wait between each stylesheet list check.
//    *
//    * @param interval
//    */
//   static set interval(interval: number) {
//     runnableLoop.interval = interval;
//   }
//
//   observe(target: DocumentLike): void {
//     super.observe(target);
//
//     this.resetCache(target);
//     this.documents.add(target);
//
//     runnableLoop.start(this);
//   }
//
//   isObserved(target: DocumentLike) {
//     return this.styleSheetCaches.has(target);
//   }
//
//   disconnect(): void {
//     runnableLoop.stop(this);
//
//     this.styleSheetCaches = new WeakMap();
//     this.documents.clear();
//   }
//
//   /** @private */
//   run() {
//     for (const document of this.documents.values()) {
//       if (isDetachedNode(document)) {
//         this.documents.delete(document);
//       } else {
//         const cache = this.styleSheetCaches.get(document);
//         this.compareStyleSheetLists(document, cache);
//       }
//     }
//   }
//
//   /**
//    * Detect changes in StyleSheetLists - O(n)
//    *
//    * A few precondition:
//    * - (1) Stylesheets are appended at the end of StyleSheetLists.
//    * - (2) Removed stylesheets are never re-added
//    *   (when a style/link node is removed, the sheet is removed and discarded.
//    *    A new one is re-created if the node is re-added).
//    * - (3) Editions to the contents of a style node cause the stylesheet of that node to
//    *   be replaced with a new one (index stays the same).
//    *
//    *  @private
//    */
//   compareStyleSheetLists(document: DocumentLike, storage: StyleSheetStorage) {
//     const removed = [];
//     const added = [];
//
//     const docStyleSheets = document.styleSheets;
//     const cachedStyleSheets = storage.styleSheets;
//
//     // replaced styleSheets:
//     let cacheIndex = 0;
//     let docOffset = 0;
//     for (; cacheIndex < cachedStyleSheets.length; cacheIndex++) {
//       const docSheet = docStyleSheets[cacheIndex + docOffset];
//
//       // already out of stylesheet, everything left is to be removed.
//       if (docSheet == null) {
//         break;
//       }
//
//       const cachedSheet = cachedStyleSheets[cacheIndex];
//
//       // No change! Yay!
//       if (docSheet === cachedSheet) {
//         continue;
//       }
//
//       if (!isDetachedStyleSheet(cachedSheet)) {
//         // the old sheet hasn't been removed but there is a new sheet at its place. This should not happen because
//         // of precondition 1.
//         throw new Error('[StyleSheetObserver] Strange behavior, please report with a sample of code');
//       }
//
//       // same ownerNode, the new StyleSheet replaced the older one (precondition 3)
//       if (docSheet.ownerNode === storage.owners[cacheIndex]) {
//         removed.push(cachedSheet);
//         added.push(docSheet);
//         continue;
//       }
//
//       // case where a sheet was removed anywhere in the array and its place has been filled with another
//       //  (which previously was the next in the stack).
//       // we need to reduce the index of the doc sheet list to continue comparing them
//       // with the right cached sheet list
//       removed.push(cachedSheet);
//       docOffset--;
//     }
//
//     // added styleSheets
//     // Here, (cacheIndex + offset - 1) is index of docStyleSheets with the last untouched styleSheet.
//     for (let i = cacheIndex + docOffset; i < docStyleSheets.length; i++) {
//       added.push(docStyleSheets[i]);
//     }
//
//     // removed styleSheets that haven't been replaced
//     // because it was the end of the stack and no new styleSheet has been added.
//     for (let i = cacheIndex; i < cachedStyleSheets.length; i++) {
//       removed.push(cachedStyleSheets[i]);
//     }
//
//     this.send(document, added, removed);
//
//     if (removed.length > 0 || added.length > 0) {
//       this.resetCache(document);
//     }
//   }
//
//   /** @private */
//   resetCache(document: DocumentLike) {
//     let storage = this.styleSheetCaches.get(document);
//     if (!storage) {
//       storage = {};
//       this.styleSheetCaches.set(document, storage);
//     }
//
//     storage.styleSheets = Array.prototype.slice.call(document.styleSheets);
//     storage.owners = storage.styleSheets.map(styleSheet => styleSheet.ownerNode);
//   }
// }
//
// function isDetachedStyleSheet(styleSheet: StyleSheet) {
//   return styleSheet.ownerNode == null;
// }
//

