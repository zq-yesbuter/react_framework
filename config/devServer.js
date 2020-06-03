const path = require('path');
const proxy = require('./proxy.js');

const port = process.env.PORT || '8088';
const host = process.env.HOST || 'dev.ai.jd.com';

const devServer = {
  contentBase: [path.resolve(__dirname, '../src')],
  host, // 主机地址
  port, // 端口号
  publicPath: '/',
  historyApiFallback: true,
  // color: true,
  // compress: true,
  // progress: true,
  open: true,
  hot: true,
  overlay: {
    errors: true,
  },
  stats: {
    children: false,
    chunks: false,
    assets: false,
    modules: false,
  },
  proxy,
  // before(app) {
  //   app.post('/', function(_:undefined, res:any) {
  //     res.redirect('/AI');
  //   });
  // },
};

module.exports = devServer;
