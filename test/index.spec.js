import assert from 'assert';
import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import StyleSheetObserver_ from '../src/index';
import type { DocumentLike, StyleSheetObserverEntry } from '../types';
import { multiPassTest } from './TestUtil';

chai.use(dirtyChai);

/**
 * Tests:
 *  - link node href modified
 *  - link node href modified while the node was detached then reattached
 *  - style node content modified
 *  - style node content modified while the node was detached then reattached
 */

/**
 * Spy allowing the reset of observers after each tests.
 */
class StyleSheetObserver extends StyleSheetObserver_ {

  static instances: Set<StyleSheetObserver> = new Set();

  constructor(...args) {
    super(...args);

    StyleSheetObserver.instances.add(this);
  }

  static killAll() {
    const instances = StyleSheetObserver.instances;
    for (const observer of instances) {
      observer.disconnect();
    }

    instances.clear();
  }
}

describe('StyleSheetObserver', () => {

  beforeEach(() => {
    StyleSheetObserver.killAll();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('throws if there is no callback provided', () => {
    expect(() => new StyleSheetObserver()).to.throw();
  });

  it('throws when watching something else than a Document / DocumentFragment', () => {
    const observer = new StyleSheetObserver(() => {
    });

    expect(() => {
      observer.observe(document.createElement('div'));
    }).to.throw();
  });

  it('calls the callback with the list of added stylesheets', done => {

    const observer = new StyleSheetObserver(multiPassTest(function *testObserver() {
      // first call to callback
      testMutation(yield, {
        target: document,
        added: 1,
        removed: 0,
      });

      // second call to callback
      testMutation(yield, {
        target: document,
        added: 1,
        removed: 0,
      });

      done();
    }));

    observer.observe(document);

    // this will trigger the callback a first time
    addStyle(document);

    // this will trigger the callback a second time
    addStyleSheet(document);
  });

  it('calls the callback with the list of removed stylesheets', done => {

    const observer = new StyleSheetObserver(multiPassTest(function *testObserver() {
      // first call to callback
      testMutation(yield, {
        target: document,
        added: 1,
        removed: 0,
      });

      // second call to callback
      testMutation(yield, {
        target: document,
        added: 1,
        removed: 0,
      });

      // this will trigger callback a third time
      document.head.innerHTML = '';

      // third call to callback
      testMutation(yield, {
        target: document,
        added: 0,
        removed: 2,
      });

      done();
    }));

    observer.observe(document);

    // this will trigger the callback a first time
    addStyle(document);

    // this will trigger the callback a second time
    addStyleSheet(document);
  });

  it('calls the callback when a style node is modified', done => {

    // Each call to yield pause the test function until the observer calls the callback.
    const observer = new StyleSheetObserver(multiPassTest(function *testObserver() {
      // first call to callback
      testMutation(yield, {
        target: document,
        added: 1,
        removed: 0,
      });

      // this will cause the stylesheet to regenerate
      style.textContent = '* { background: red; }';

      // second call to callback - content edition
      testMutation(yield, {
        target: document,
        added: 1,
        removed: 1,
      });

      done();
    }));

    observer.observe(document);

    // this will trigger the callback a first time
    const style = addStyle(document);
  });

  it('calls the callback when a link node is modified', done => {

    // Each call to yield pause the test function until the observer calls the callback.
    const observer = new StyleSheetObserver(multiPassTest(function *testObserver() {
      // first call to callback
      testMutation(yield, {
        target: document,
        added: 1,
        removed: 0,
      });

      // this will cause the stylesheet to regenerate
      link.href = '/base/test/resources/stylesheet2.css';

      // second call to callback - content edition
      testMutation(yield, {
        target: document,
        added: 1,
        removed: 1,
      });

      done();
    }));

    observer.observe(document);

    // this will trigger the callback a first time
    const link = addStyleSheet(document);
  });

  it('does not callback with style tag modifications if the owner node is detached', done => {

    // Each call to yield pause the test function until the observer calls the callback.
    const observer = new StyleSheetObserver(multiPassTest(function *testObserver() {
      // first call to callback
      testMutation(yield, {
        target: document,
        added: 1,
        removed: 0,
      });

      // this will trigger the callback a second time
      style.parentNode.removeChild(style);

      // second call to callback - content edition
      testMutation(yield, {
        target: document,
        added: 0,
        removed: 1,
      });

      // this will NOT trigger the callback
      style.textContent = '* { background: red; }';

      setTimeout(() => done(), 1);
    }));

    observer.observe(document);

    // this will trigger the callback a first time
    const style = addStyle(document);
  });

  it('does not callback with link tag modifications if the owner node is detached', done => {

    // Each call to yield pause the test function until the observer calls the callback.
    const observer = new StyleSheetObserver(multiPassTest(function *testObserver() {
      // first call to callback
      testMutation(yield, {
        target: document,
        added: 1,
        removed: 0,
      });

      // this will trigger the callback a second time
      style.parentNode.removeChild(style);

      // second call to callback - content edition
      testMutation(yield, {
        target: document,
        added: 0,
        removed: 1,
      });

      // this will NOT trigger the callback
      style.textContent = '* { background: red; }';

      setTimeout(() => done(), 1);
    }));

    observer.observe(document);

    // this will trigger the callback a first time
    const style = addStyle(document);
  });

  if (typeof Element.prototype.attachShadow === 'function') {
    it('can observe shadow roots', done => {

      const observer = new StyleSheetObserver(multiPassTest(function *testObserver() {
        // first call to callback
        const changes: StyleSheetObserverEntry = yield;
        expect(changes.addedStyleSheets.length).to.equal(1);
        expect(changes.removedStyleSheets.length).to.equal(0);
        expect(changes.addedStyleSheets[0]).to.equal(shadowStyle.sheet);
        expect(changes.target).to.equal(shadowRoot);

        setTimeout(() => done(), 1);
      }));

      const shadowDiv = document.createElement('div');
      const shadowRoot = shadowDiv.attachShadow({ mode: 'closed' });
      document.body.appendChild(shadowDiv);

      observer.observe(shadowRoot, { children: true });

      // this should not trigger anything.
      addStyle(document);

      // this should trigger the observer.
      const shadowStyle = addStyle(shadowRoot);
    });
  }
});

function testMutation(mutation, { target, added = 0, removed = 0 } = {}) {
  expect(mutation.target).to.equal(target, 'Invalid target');
  expect(mutation.addedStyleSheets.length).to.equal(added, `should have been ${added} added stylesheets`);
  expect(mutation.removedStyleSheets.length).to.equal(removed, `should have been ${removed} removed stylesheets`);
}

function addStyleSheet(doc) {
  assert(doc instanceof Document || doc instanceof DocumentFragment, 'doc should be a document(-fragment)');

  const link: HTMLLinkElement = document.createElement('link');
  link.href = '/base/test/resources/stylesheet.css';
  link.rel = 'stylesheet';
  link.type = 'text/css';

  const styleRoot = getStylesRoot(doc);
  styleRoot.appendChild(link);

  return link;
}

function addStyle(doc) {
  assert(doc instanceof Document || doc instanceof DocumentFragment, 'doc should be a document(-fragment)');

  const style: HTMLStyleElement = document.createElement('style');
  style.textContent = 'pre { color: red }';

  const styleRoot = getStylesRoot(doc);
  styleRoot.appendChild(style);

  return style;
}

function getStylesRoot(documentLike: DocumentLike): Node {
  if (documentLike instanceof Document) {
    return documentLike.head;
  }

  return documentLike;
}
