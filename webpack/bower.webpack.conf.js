const path = require('path');

module.exports = Object.assign(require('./base.webpack.conf'), {
  entry: path.resolve(__dirname, '../index_bower.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'stylesheetObserver.js',
  },
});
