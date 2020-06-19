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
        path: 'outgoing/list',
        icon: 'align-left',
      },
      {
        hideInMenu: true,
        name: '招聘任务-均可删除列表',
        path: 'outgoing/deleteAll',
        icon: 'align-left',
      },
      {
        hideInMenu: true,
        name: '招聘任务-已删除列表',
        path: 'outgoing/delete',
        icon: 'align-left',
      },
      {
        hideInMenu: true,
        name: '外呼配置',
        path: 'outgoing/config',
        icon: 'align-left',
      },
      {
        hideInMenu: true,
        name: '外呼名单',
        path: 'outgoing/namelist',
        icon: 'align-left',
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
        icon: "solution",
      },
      {
        name: '没有权限',
        hideInMenu: true,
        path: '403',
        icon: "solution",
      },
    ],
  },
];

// 菜单级别的权限控制
let authorityMenu = [];
function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path) && !/^\//.test(path)) {
      path = parentPath + item.path;
    }
    let authority;
    if (!(item.children && item.children.length > 0)) {
      authority = () => {
        // 根据请求回来的菜单控制是否展示
        return true;
        // return authorityMenu.includes(path) || authorityMenu.includes(path.replace(baseUrl, ''));
      };
    }

    const result = {
      ...item,
      path,
      authority: authority || parentAuthority,
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
