/* eslint-disable */
// https://github.com/karma-runner/karma/issues/1597
'use strict';

const path = require('path');
const webpackConfig = require('../webpack/base.webpack.conf');
webpackConfig.devtool = 'inline-source-map';
webpackConfig.module.preLoaders.push({
  test: /\.js$/,
  include: path.resolve(__dirname, '../src'),
  loader: 'babel-istanbul-loader',
});

module.exports = {
  frameworks: ['mocha'],
  files: [
    'node_modules/babel-polyfill/dist/polyfill.js',
    'test/index.spec.js',
    { pattern: 'test/resources/**/*', included: false },
  ],

  preprocessors: {
    'test/index.spec.js': ['webpack', 'sourcemap'],
  },

  proxies: {
    '/resources/': '/base/test/resources/'
  },

  basePath: '../',

  reporters: ['spec', 'coverage'],

  coverageReporter: {
    type: 'html',
    dir: '../coverage/',
  },

  webpack: webpackConfig,

  webpackMiddleware: {
    // webpack-dev-middleware configuration
    noInfo: true,
  },

  client: {
    mocha: {
      // change Karma's debug.html to the mocha web reporter
      reporter: 'html',

      // require specific files after Mocha is initialized
      require: [require.resolve('bdd-lazy-var/bdd_lazy_var_global')],

      // custom ui, defined in required file above
      ui: 'bdd-lazy-var/global',
    },
  },

  plugins: [
    require('karma-webpack'),
    require('istanbul-instrumenter-loader'),
    require('karma-mocha'),
    require('karma-coverage'),
    require('karma-spec-reporter'),
    require('karma-sourcemap-loader'),
  ],
};
