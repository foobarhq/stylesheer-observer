/* eslint-disable */
// https://github.com/karma-runner/karma/issues/1597
'use strict';

const conf = require('./base.karma.conf');

conf.plugins.push(
  require('karma-phantomjs-launcher'),
  require('karma-chrome-launcher'),
  require('karma-firefox-launcher')
);

conf.browsers = ['PhantomJS', 'Chrome', 'ChromeCanary', 'Firefox'];

module.exports = function configureKarma(config) {
  config.set(conf);
};
