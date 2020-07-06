import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';
// import * as dynamicModels from '../models';

const ReadSubRoutes = () => import('../layouts/ReadSubRoutes.js');
let routerDataCache;

const modelNotExisted = (app, model) =>
  //  eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        console.log('model====>', model);
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return (props) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
    // throw new Error('不支持同步方式引入');
  }
  // () => import('module')
  return dynamic({
    app,
    models: () =>
      models
        .filter((model) => modelNotExisted(app, model))
        .map((m) => {
          // return dynamicModels[m]();
          return import(`../models/${m}.js`);
        }),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return (props) =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
  });
};

function getFlatMenuData(menus) {
  // console.warn(menus)
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user'], () => import('../layouts/BasicLayout')),
    },
    // 外呼报表
    '/AI/report': {
      component: dynamicWrapper(app, ['user','report'], () => import('../routes/Report')),
    },
    // 实时数据
    '/AI/outgoing': {
      component: dynamicWrapper(app, ['namelist'], ReadSubRoutes),
    },
    // 实时数据
    '/AI/outgoing/list': {
      component: dynamicWrapper(app, ['namelist'], () => import('../routes/Process/OutgoingTask')),
    },
    // 招聘任务-均可删除列表
    '/AI/outgoing/deleteAll': {
      component: dynamicWrapper(app, ['namelist'], () => import('../routes/Process/OutgoingTask')),
    },
    // 招聘任务-已删除列表
    '/AI/outgoing/delete': {
      component: dynamicWrapper(app, ['namelist'], () => import('../routes/Process/OutgoingTask')),
    },
    // 外呼配置
    '/AI/outgoing/config': {
      component: dynamicWrapper(app, ['namelist'], () => import('../routes/Process/Config')),
    },
    // 外呼名单
    '/AI/outgoing/namelist': {
      component: dynamicWrapper(app, ['namelist'], () => import('../routes/Process/NameList')),
    },
    // 场景配置
    '/AI/scene': {
      component: dynamicWrapper(app, ['scene'], ReadSubRoutes),
    },
    // 场景配置列表
    '/AI/scene/list': {
      component: dynamicWrapper(app, ['scene'], () => import('../routes/Scene/Index')),
    },
    // 场景配置添加
    '/AI/scene/add': {
      component: dynamicWrapper(app, ['scene', 'namelist'], () => import('../routes/Scene/Add')),
    },
    // 话术配置
    '/AI/scene/words': {
      component: dynamicWrapper(app, ['scene', 'namelist'], () => import('../routes/Scene/Words')),
    },
    // 话术配置
    '/AI/scene/config': {
      component: dynamicWrapper(app, ['scene', 'namelist'], () =>
        import('../routes/Scene/Words/Config')
      ),
    },
    // 全局配置
    '/AI/scene/process': {
      component: dynamicWrapper(app, ['scene', 'namelist'], () =>
        import('../routes/Scene/Process')
      ),
    },
    // 意图配置
    '/AI/intention': {
      component: dynamicWrapper(app, ['intent', 'namelist'], ReadSubRoutes),
    },
    '/AI/intention/list': {
      component: dynamicWrapper(app, ['intent', 'namelist'], () =>
        import('../routes/Intention/Index')
      ),
    },
    '/AI/intention/config': {
      component: dynamicWrapper(app, ['intent', 'namelist'], () =>
        import('../routes/Intention/Config')
      ),
    },
    // 意图中的语料配置
    '/AI/intention/corpus': {
      component: dynamicWrapper(app, ['intent', 'namelist'], () =>
        import('../routes/Intention/Corpus/Index')
      ),
    },
    // 规则配置
    '/AI/rule': {
      component: dynamicWrapper(app, ['rule', 'namelist'], ReadSubRoutes),
    },
    // 规则配置列表
    '/AI/rule/list': {
      component: dynamicWrapper(app, ['rule', 'namelist'], () =>
        import('../routes/Rule/Index')
      ),
    },
    // 规则配置
    '/AI/rule/config': {
      component: dynamicWrapper(app, ['rule', 'namelist'], () =>
        import('../routes/Rule/Config')
      ),
    },
    // 规则详情配置
    '/AI/rule/detail': {
      component: dynamicWrapper(app, ['rule', 'namelist'], () =>
        import('../routes/Rule/Detail')
      ),
    },
    // 规则编辑
    '/AI/rule/detail/config': {
      component: dynamicWrapper(app, ['rule', 'namelist'], () =>
        import('../routes/Rule/Detail/Config')
      ),
    },
    // 词槽配置
    '/AI/slot': {
      component: dynamicWrapper(app, ['slot', 'namelist'], ReadSubRoutes),
    },
    '/AI/slot/list': {
      component: dynamicWrapper(app, ['slot', 'namelist'], () =>
        import('../routes/Slot/Index')
      ),
    },
    // 词槽配置
    '/AI/slot/config': {
      component: dynamicWrapper(app, ['slot', 'namelist'], () =>
        import('../routes/Slot/Config')
      ),
    },
    // 词汇配置
    '/AI/slot/vocalbulary': {
      component: dynamicWrapper(app, ['slot', 'namelist'], () =>
        import('../routes/Slot/Vocalbulary')
      ),
    },
    // 简历解析
    '/AI/resume': {
      component: dynamicWrapper(app, [], () => import('../routes/Resume/Index')),
    },
    '/AI/authority': {
      component: dynamicWrapper(app, ['auth'], () => import('../routes/Authority/Index')),
    },
    '/AI/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    // 用于强制重新挂载页面组件
    '/reload': {
      component: () => null,
    },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach((path) => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find((key) => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      // hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  return routerData;
};
