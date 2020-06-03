const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// const mockUrlObj = require('./devServer.mock');
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const merge = require('webpack-merge');

const bodyParser = require('body-parser');
const commonConf = require('./webpack.common');
const manifest = require('../public/dll/manifest.json');
const devServer = require('./devServer.js');
const { CheckerPlugin } = require('awesome-typescript-loader');

// console.log('主题变量\r\n', theme);

const devConf = {
  entry: path.resolve(__dirname, '../src', 'index.js'),
  devServer,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    chunkFilename: '[name].async.js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        use: [
          {
            loader: 'ts-loader',
          },
          {
            loader: 'awesome-typescript-loader',
          },
        ],
        exclude: [path.resolve(__dirname, '../node_modules')],
      },
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader?cacheDirectory',
          options: {
            cacheDirectory: true,
          },
        },
        include: [path.resolve(__dirname, '../src')],
        exclude: [path.resolve(__dirname, '../node_modules')],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            },
          },
        ],
        exclude: [path.resolve(__dirname, '../node_modules/')],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            },
          },
        ],
        include: [path.resolve(__dirname, '../node_modules/')],
      },
      // {
      //   test: /\.(css|less)$/,
      //   use: [
      //     {
      //       loader: 'style-loader',
      //     },
      //     {
      //       loader: 'css-loader',
      //       options: {
      //           sourceMap: true,
      //       },
      //     },
      //     {
      //       loader: 'less-loader',
      //       options: {
      //           sourceMap: true,
      //           javascriptEnabled: true,
      //       },
      //     },
      //   ],
      // },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
  externals: {
    jquery: 'jQuery',
  },
  node: {
    fs: 'empty',
    module: 'empty',
  },
  devtool: 'cheap-module-eval-source-map',
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(css|less)/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      ignoreOrder: true,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src', 'index.ejs'), // 模板
      filename: 'index.html',
      hash: true, // 防止缓存
      flowPath: '/',
    }),
    new CleanWebpackPlugin(),
    // new CopyWebpackPlugin([{
    //   from: path.resolve(__dirname, '../dist'),
    // }]),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../public'),
      },
    ]),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest,
    }),
    new webpack.HotModuleReplacementPlugin(), // 调用webpack的热更新插件
    // new BundleAnalyzerPlugin(),
    // new HardSourceWebpackPlugin(),
    new CheckerPlugin(),
  ],
};

module.exports = merge(commonConf, devConf);
