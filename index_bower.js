// There is no official bower support, nor will there be. Don't set globals, use modules!
// This entry point exists solely to manually test this lib in browsers.
// In case anyone decides to use the StyleSheetObserver like this,
// please do not define window.StyleSheetObserver as it is a name that could one day be used for an actual
// native stylesheet observer.
window.$foorbarHq = window.$foorbarHQ || {};
window.$foorbarHq.StyleSheetObserver = require('./index');
