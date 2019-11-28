const { join } = require('path');

module.exports = {
  mode: 'development',

  entry: join(__dirname, 'src', 'index.tsx'),
  output: {
    path: join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.scss', '.sass'],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        loader: 'ts-loader',
      },
    ],
  },

};
