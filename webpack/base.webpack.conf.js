module.exports = {
  module: {
    preLoaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
    }],
  },

  devtool: 'cheap-module-source-map',
};
