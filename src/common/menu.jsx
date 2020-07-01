import { isUrl } from '../utils/utils';
import { baseUrl } from '../config';

const menuData = [
  {
    name: '招聘外呼',
    icon: 'appstore',
    path: 'AI',
    children: [
      {
        name: '服务报表',
        path: 'report',
        icon: 'pie-chart',
      },
      {
        name: '招聘任务',
        path: 'outgoing',
        icon: 'align-left',
      },
      // {
      //   name: '招聘任务',
      //   hideInMenu: true,
      //   path: 'outgoing/list',
      // },
      // {
      //   hideInMenu: true,
      //   name: '招聘任务-均可删除列表',
      //   path: 'outgoing/deleteAll',
      // },
      // {
      //   hideInMenu: true,
      //   name: '招聘任务-已删除列表',
      //   path: 'outgoing/delete',
      //   icon: 'align-left',
      // },
      // {
      //   hideInMenu: true,
      //   name: '外呼配置',
      //   path: 'outgoing/config',
      //   icon: 'align-left',
      // },
      // {
      //   hideInMenu: true,
      //   name: '外呼名单',
      //   path: 'outgoing/namelist',
      //   icon: 'align-left',
      // },
      {
        name: '场景配置',
        path: 'scene',
        icon: "control",
      },
      {
        name: '意图配置',
        path: 'intention',
        icon: "profile",
      },
      {
        name: '规则配置',
        path: 'rule',
        icon: "barcode",
      },
      {
        name: '词槽配置',
        path: 'slot',
        icon: "build",
      },
      {
        name: '简历解析',
        hideInMenu: true,
        path: 'resume',
        icon: 'solution',
      },
      {
        name: '权限设置',
        hideInMenu: true,
        path: 'authority',
        icon: 'solution',
      },
      {
        name: '没有权限',
        hideInMenu: true,
        path: '403',
        icon: 'solution',
      },
    ],
  },
];

// 菜单级别的权限控制
let authorityMenu = [];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);

export function setAuthorityMenu(list) {
  authorityMenu = list;
}
