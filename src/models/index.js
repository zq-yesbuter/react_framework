// Use require.context to require reducers automatically
// Ref: https://webpack.js.org/guides/dependency-management/#require-context
const context = require.context('./', false, /\.js$/);
export default context
  .keys()
  .filter(item => item !== './index.js')
  .map(key => context(key));

// // models支持dynamic import

// // export const login = () => import(/* webpackChunkName: "login" */ './login');
// export const user = () => import(/* webpackChunkName: "user" */ './user');
// // Dashboard
// export const channel = () => import(/* webpackChunkName: "channel" */ './Dashboard/channel');
// export const channelHour = () =>
//   import(/* webpackChunkName: "channel" */ './Dashboard/channelHour');
// export const terminalDay = () =>
//   import(/* webpackChunkName: "channel" */ './Dashboard/terminalDay');
// export const answerDay = () => import(/* webpackChunkName: "channel" */ './Dashboard/answerDay');
// export const logDetail = () => import(/* webpackChunkName: "channel" */ './Dashboard/logDetail');
// export const manualChannel = () =>
//   import(/* webpackChunkName: "channel" */ './Dashboard/manualChannel');
// export const manualTerminal = () => import(/* webpackChunkName: "channel" */ './Dashboard/manualTerminal');
// export const selfhelp = () => import(/* webpackChunkName: "channel" */ './Dashboard/selfhelp');

// export const space = () => import(/* webpackChunkName: "model" */ './space');
// export const mapping = () => import(/* webpackChunkName: "mapping" */ './mapping');
// export const file = () => import(/* webpackChunkName: "model" */ './file');

// // statistics
// export const resolve = () => import(/* webpackChunkName: "resolve" */ './statistics/resolve');
// export const manual = () => import(/* webpackChunkName: "manual" */ './statistics/manual');
// export const hot = () => import(/* webpackChunkName: "hot" */ './statistics/hot');
// export const dashboard = () => import(/* webpackChunkName: "dashboard" */ './statistics/dashboard');
// export const terminal = () => import(/* webpackChunkName: "terminal" */ './statistics/terminal');
// export const insight = () => import(/* webpackChunkName: "terminal" */ './statistics/insight');

// // 运营配置
// export const robot = () => import(/* webpackChunkName: "robot" */ './robot');

// // 应答配置
// export const site = () => import(/* webpackChunkName: "site" */ './answer/site');
// export const welcome = () => import(/* webpackChunkName: "welcome" */ './answer/welcome');
// export const rule = () => import(/* webpackChunkName: "rule" */ './answer/rule');
// export const ruleFaq = () => import(/* webpackChunkName: "rule" */ './answer/ruleFaq');
// export const sync = () => import(/* webpackChunkName: "sync" */ './answer/sync');
// // 实验分层
// export const testLayer = () => import(/* webpackChunkName: "rule" */ './testLayer');
// export const testManage = () => import(/* webpackChunkName: "rule" */ './testManage');

// // 模型标注
// export const modelTask = () => import(/* webpackChunkName: "terminal" */ './model/task');
// export const assign = () => import(/* webpackChunkName: "terminal" */ './model/assign');
// export const assignLabel = () => import(/* webpackChunkName: "terminal" */ './model/assignLabel');

// // 模型数据
// export const dataset = () => import(/* webpackChunkName: "terminal" */ './model/dataset');
