
export default function getMutationObserver() {
  if (typeof MutationObserver !== 'undefined') {
    return MutationObserver;
  }

  if (typeof WebkitMutationObserver !== 'undefined') {
    return WebkitMutationObserver; // eslint-disable-line no-undef
  }

  throw new Error('Missing window.MutationObserver, you will need to polyfill it.');
}
