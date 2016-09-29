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
  bs_firefox_mac: {
    base: 'BrowserStack',
      browser: 'firefox',
      browser_version: '21.0',
      os: 'OS X',
      os_version: 'Mountain Lion',
  },
  bs_iphone5: {
    base: 'BrowserStack',
      device: 'iPhone 5',
      os: 'ios',
      os_version: '6.0',
  },
};

conf.browsers = ['bs_firefox_mac', 'bs_iphone5'];

module.exports = function configureKarma(config) {
  config.set(conf);
};
