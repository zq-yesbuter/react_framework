const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HappyPack = require('happypack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const merge = require('webpack-merge');
const os = require('os');
// 构造出共享进程池
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const commonConf = require('./webpack.common');
const manifest = require('../public/dll/manifest.json');
const { CheckerPlugin } = require('awesome-typescript-loader');

const buildEnv = process.env.BUILD_ENV;

let publicPath = '//static-cdjr.jd.com/human_resources_platform/';
if (process.env.BUILD_ENV === 'development') {
  publicPath = '//dev-static-cdjr.jd.com/human_resources_platform/';
} else if (process.env.BUILD_ENV === 'beta' || process.env.BUILD_ENV === 'betahuangcun') {
  publicPath = '//test-static-cdjr.jd.com/human_resources_platform/';
}

const prodConf = {
  entry: path.resolve(__dirname, '../src', 'index.js'),
  output: {
    filename: '[name].[chunkhash:8].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: buildEnv ? publicPath : '/',
    chunkFilename: '[name].[chunkhash:8].async.js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        include: [path.resolve(__dirname, '../src')],
        exclude: [path.resolve(__dirname, '../node_modules')],
        // 把对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实例
        use: ['happypack/loader?id=babel'],
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
  stats: {
    children: false,
  },
  externals: {
    jquery: 'jQuery',
  },
  node: {
    fs: 'empty',
    module: 'empty',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(css|less)/,
          chunks: 'all',
          enforce: true,
        },
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2,
        },
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
      },
    },
    runtimeChunk: true,
  },
  plugins: [
    /*
    new UglifyJsPlugin({
      parallel: os.cpus().length,
    }),
    */
    new MiniCssExtractPlugin({
      filename: '[name].css',
      ignoreOrder: true,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src', 'index.ejs'), // 模板
      filename: 'index.html',
      hash: true, // 防止缓存
      flowPath: buildEnv ? publicPath : '/',
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../public'),
      },
    ]),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest,
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true,
    }),
    new HappyPack({
      id: 'babel',
      // 如何处理 .js 文件，用法和 Loader 配置中一样
      loaders: ['babel-loader?cacheDirectory'],
      // loaders: [
      //   {
      //     loader: 'babel-loader',
      //     options: {
      //       cacheDirectory: true,
      //       presets: ['@babel/preset-env', '@babel/preset-react'],
      //       plugins: [
      //         ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
      //       ],
      //     },
      //   },
      // ],
      // 使用共享进程池中的子进程去处理任务
      threadPool: happyThreadPool,
    }),
    new webpack.HashedModuleIdsPlugin(),
    new CheckerPlugin(),
  ],
};

module.exports = merge(commonConf, prodConf);
