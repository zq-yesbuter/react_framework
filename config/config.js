import 'babel-polyfill';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/
import slash from 'slash2';
import webpackPlugin from './plugin.config';

const { pwa, primaryColor } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION, API = 'MOCK' } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';

const buildEnv = process.env.BUILD_ENV;

let publicPath = '//static-cdjr.jd.com/human_resources_platform/';
if (process.env.BUILD_ENV === 'development') {
  publicPath = '//dev-static-cdjr.jd.com/human_resources_platform/';
} else if (process.env.BUILD_ENV === 'beta' || process.env.BUILD_ENV === 'betahuangcun') {
  publicPath = '//test-static-cdjr.jd.com/human_resources_platform/';
}

// proxy control
const { proxyUrl = '', proxyPort = '', proxyPath = '', pathRewrite = {} } = {
  MOCK: {
    proxyUrl: 'yapi.cbpmgt.com',
    proxyPort: '80',
    proxyPath: '/mock/276',
    pathRewrite: {
      '/api': '/',
    },
  },
  DEV: {
    proxyUrl: 'jddai.jd.com',
    proxyPort: '8088',
    proxyPath: '',
    Host: 'jddai.jd.com',
    domain: 'jddai.jd.com',
    domainPort: '8088',
  },
}[API];
const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,

      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
]; // 针对 preview.pro.ant.design 的 GA 统计代码

// if (isAntDesignProPreview) {
//   plugins.push([
//     'umi-plugin-ga',
//     {
//       code: 'UA-72788897-6',
//     },
//   ]);
//   plugins.push([
//     'umi-plugin-pro',
//     {
//       serverUrl: 'https://ant-design-pro.netlify.com',
//     },
//   ]);
// }
export default {
  plugins,
  block: {
    // 国内用户可以使用码云
    // defaultGitUrl: 'https://gitee.com/ant-design/pro-blocks',
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  hash: true,
  targets: {
    ie: 11,
  },
  devtool: isAntDesignProPreview ? 'source-map' : false,
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    // {
    //   path: '/user',
    //   component: '../layouts/UserLayout',
    //   routes: [
    //     {
    //       name: 'login',
    //       path: '/user/login',
    //       component: './user/login',
    //     },
    //   ],
    // },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BlankLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/AI',
            },
            {
              path: '/AI',
              name: 'AI',
              icon: 'smile',
              component: './AI',
            },
            {
              path: '/403',
              name: '403',
              icon: 'smile',
              component: './403',
            },
            {
              path: '/500',
              name: '500',
              icon: 'smile',
              component: './500',
            },
            {
              path: '/404',
              name: '404',
              icon: 'smile',
              component: './404',
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  // 主题颜色
  theme: {
    'primary-color': primaryColor,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, _, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  publicPath,
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,
  proxy: {
    // '/ws': {
    //   // secure: false,
    //   ws:true,
    //   target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
    //   changeOrigin: true,
    //   pathRewrite,
    // },
    '/sse': {
      target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
      changeOrigin: true,
      pathRewrite,
    },
    '/offer': {
      target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
      changeOrigin: true,
      pathRewrite,
    },
    '/tenant': {
      target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
      changeOrigin: true,
      pathRewrite,
    },
    '/messages': {
      target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
      changeOrigin: true,
      pathRewrite,
    },
    '/interview': {
      target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
      changeOrigin: true,
      pathRewrite,
    },
    '/resume': {
      target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
      changeOrigin: true,
      pathRewrite,
    },
    '/data': {
      target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
      changeOrigin: true,
      pathRewrite,
    },
    '/authenticate': {
      target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
      changeOrigin: true,
      pathRewrite,
    },
  },
};
