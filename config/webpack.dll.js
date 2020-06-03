const webpack = require('webpack');
const path = require('path');

const vendors = ['react', 'react-dom', 'moment', 'redux', 'lodash'];
module.exports = {
  output: {
    path: path.resolve(__dirname, '../public/dll'),
    filename: '[name].dll.js',
    library: '_dll_[name]',
  },
  entry: {
    vendors,
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '../public/dll', 'manifest.json'),
      name: '_dll_[name]',
      context: __dirname,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],
};
