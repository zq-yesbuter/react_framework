export default [
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
        component: '../layouts/BasicLayout',
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/AI/outging',
          },
          {
            path: '/AI',
            redirect: '/AI/outging',
          },
          {
            path: '/AI',
            name: '外呼管理',
            icon: 'smile',
            // component: '../pages/Process',
            routes: [
              {
                name: '外呼任务',
                path: '/AI/outging',
                component: '../pages/Process/OutgoingTask/index.js',
                icon: 'smile',
              },
              {
                // name: '外呼配置',
                path: '/AI/config',
                component: '../pages/Process/Config/index.js',
                // icon: 'smile',
              },
              {
                // name: '',
                path: '/AI/namelist',
                component: '../pages/Process/NameList/index.js',
                // icon: 'smile',
              },
              {
                // name: '',
                path: '/AI/record',
                component: '../pages/Process/Record/index.js',
                // icon: 'smile',
              },
            ],
          },
          {
            component: '../pages/404.jsx',
          },
        ],
      },
      {
        component: './403',
      },
      {
        component: './500',
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
