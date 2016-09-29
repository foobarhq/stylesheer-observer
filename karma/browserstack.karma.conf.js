/* eslint-disable */
// https://github.com/karma-runner/karma/issues/1597
'use strict';

const conf = require('./base.karma.conf');

conf.plugins.push(require('karma-browserstack-launcher'));

if (process.env.BROWSERSTACK_USERNAME && process.env.BROWSERSTACK_ACCESS_KEY) {
  conf.browserStack = {
    username: process.env.BROWSERSTACK_USERNAME,
    accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
  }
} else {
  try {
    conf.browserStack = require('../browserstack-keys.json');
  } catch (e) {
    console.error('No browserstack keys found. Please set env variables BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY or set them in "browserstack-keys.json" at the root of your project.');
    console.error('Alternatively, use `npm run test` to test locally.');
    process.exit(1);
  }
}

conf.customLaunchers = {
  bsMacFirefox14: {
    base: 'BrowserStack',
    browser: 'firefox',
    browser_version: '33.0',
    os: 'OS X',
    os_version: 'El Capitan',
  },
  bsMacChrome38: {
    base: 'BrowserStack',
    browser: 'chrome',
    browser_version: '38.0',
    os: 'OS X',
    os_version: 'El Capitan',
  },
  bsMacSafari6: {
    base: 'BrowserStack',
    browser: 'safari',
    browser_version: '6.2',
    os: 'OS X',
    os_version: 'Mountain Lion',
  },
  bsMacOpera20: {
    base: 'BrowserStack',
    browser: 'opera',
    browser_version: '20.0',
    os: 'OS X',
    os_version: 'El Capitan',
  },
  bsWinEdge13: {
    base: 'BrowserStack',
    browser: 'edge',
    browser_version: '13',
    os: 'WINDOWS',
    os_version: '10',
  },
  bsWinIe11: {
    base: 'BrowserStack',
    browser: 'ie',
    browser_version: '11',
    os: 'WINDOWS',
    os_version: '7',
  },
};

conf.browsers = ['bsMacFirefox14', 'bsMacChrome38', 'bsMacSafari6', 'bsMacOpera20', 'bsWinEdge13', 'bsWinIe11'];
// conf.browsers = ['bsWinIe11'];

module.exports = function configureKarma(config) {
  config.set(conf);
};
