const webpack = require('webpack');
const path = require('path');

const commonConf = {
  entry: path.resolve(__dirname, '../src', 'index.js'),
  resolve: {
    alias: {
      components: path.resolve(__dirname, '../src/components/'),
      services: path.resolve(__dirname, '../src/services/'),
      models: path.resolve(__dirname, '../src/models/'),
      layouts: path.resolve(__dirname, '../src/layouts/'),
      '@babel/runtime': '@babel/runtime-corejs2',
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.less'],
  },
};
module.exports = commonConf;
