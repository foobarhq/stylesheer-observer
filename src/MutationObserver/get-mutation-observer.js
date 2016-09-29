
export default function getMutationObserver() {
  if (typeof MutationObserver === 'function') {
    return MutationObserver;
  }

  if (typeof WebkitMutationObserver === 'function') {
    return WebkitMutationObserver; // eslint-disable-line no-undef
  }

  throw new Error('Missing window.MutationObserver, you will need to polyfill it.');
}
