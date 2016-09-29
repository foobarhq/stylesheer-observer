/* eslint-disable */
// https://github.com/karma-runner/karma/issues/1597
'use strict';

const path = require('path');

module.exports = {
  frameworks: ['mocha'],
  files: [
    'node_modules/babel-polyfill/dist/polyfill.js',
    'test/index.spec.js',
    { pattern: 'test/resources/**/*', included: false },
  ],

  preprocessors: {
    'test/index.spec.js': ['webpack'],
  },

  proxies: {
    '/resources/': '/base/test/resources/'
  },

  basePath: '../',

  reporters: ['spec', 'coverage'],

  coverageReporter: {
    type: 'html',
    dir: 'coverage/',
  },

  webpack: {
    // webpack configuration
    module: {
      preLoaders: [{
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
      }, {
        test: /\.js$/,
        include: path.resolve(__dirname, '../src'),
        loader: 'babel-istanbul-loader',
      }],
    },

    devtool: 'cheap-module-source-map',
    // devtool: 'inline-source-map',
  },

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
  ],
};