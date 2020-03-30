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
            redirect: '/AI',
          },
          {
            path: '/AI',
            name: '流程管理',
            icon: 'smile',
            component: './AI',
            children: [
              {
                name: '面试邀约',
                path: '/AI',
                // component: './AI',
              },
            ],
          },
          // {
          //   path: '/403',
          //   name: '403',
          //   icon: 'smile',
          //   component: './403',
          // },
          // {
          //   path: '/500',
          //   name: '500',
          //   icon: 'smile',
          //   component: './500',
          // },
          // {
          //   path: '/404',
          //   name: '404',
          //   icon: 'smile',
          //   component: './404',
          // },
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
];
