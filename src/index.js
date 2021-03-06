import '@babel/polyfill';
import 'url-polyfill';
import dva from 'dva';
import { message } from 'antd';
// import createHistory from 'history/createHashHistory';
// user BrowserHistory
import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';

import './index.less';
// 1. Initialize
const app = dva({
  onError: (e, dispatch) => {
    message.error(e.message);
  },
  history: createHistory({
    basename: '/',
  }),
});

// 2. Plugins
app.use(createLoading());

// 3. Register global model
app.model(require('./models/global').default);
// app.model(require('./models/enum').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

export default app._store; // eslint-disable-line
