import { isUrl } from '../utils/utils';
import { baseUrl } from '../config';

const menuData = [
  {
    name: '招聘外呼',
    icon: 'table',
    path: 'outgoing',
    children: [
      {
        name: '外呼任务',
        path: '',
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
