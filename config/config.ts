import 'babel-polyfill';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/
import slash from 'slash2';
import webpackPlugin from './plugin.config';
import routes from './router';
import proxy from './proxy';

const { pwa, primaryColor } = defaultSettings;

let publicPath = '//static-cdjr.jd.com/human_resources_platform/';
if (process.env.BUILD_ENV === 'development') {
  publicPath = '//dev-static-cdjr.jd.com/human_resources_platform/';
} else if (process.env.BUILD_ENV === 'beta' || process.env.BUILD_ENV === 'betahuangcun') {
  publicPath = '//test-static-cdjr.jd.com/human_resources_platform/';
}

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
];

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
  devtool: 'source-map',
  // resolve: {
  //   // Add '.ts' and '.tsx' as resolvable extensions.
  //   extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
  // },
  // umi routes: https://umijs.org/zh/guide/router.html
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  // 主题颜色
  theme: {
    'primary-color': primaryColor,
  },
  // define: {
  //   ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
  //     ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  // },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    // getLocalIdent: (context, _, localName) => {
    //   if (
    //     context.resourcePath.includes('node_modules') ||
    //     context.resourcePath.includes('ant.design.pro.less') ||
    //     context.resourcePath.includes('global.less')
    //   ) {
    //     return localName;
    //   }

    //   const match = context.resourcePath.match(/src(.*)/);

    //   if (match && match[1]) {
    //     const antdProPath = match[1].replace('.less', '');
    //     const arr = slash(antdProPath)
    //       .split('/')
    //       .map(a => a.replace(/([A-Z])/g, '-$1'))
    //       .map(a => a.toLowerCase());
    //     return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
    //   }

    //   return localName;
    // },
    localIdentName:'[local]',
  },
  publicPath,
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,
  proxy,
};
