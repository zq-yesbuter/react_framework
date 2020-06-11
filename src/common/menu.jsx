import { isUrl } from '../utils/utils';
import { baseUrl } from '../config';

const menuData = [
  {
    name: '招聘外呼',
    icon: 'appstore',
    path: 'outgoing',
    children: [
      {
        name: '服务报表',
        path: '/report',
        icon: 'pie-chart',
      },
      {
        name: '外呼任务',
        path: '/outgoing',
        icon: 'align-left',
      },
      {
        name: '简历解析',
        hideInMenu: true,
        path: '/resume',
        icon: 'solution',
      },
    ],
  },
];

// 菜单级别的权限控制
let authorityMenu = [];

export const getMenuData = () => menuData;

export function setAuthorityMenu(list) {
  authorityMenu = list;
}
