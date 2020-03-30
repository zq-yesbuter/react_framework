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
        component: '../layouts/BlankLayout',
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
          //   component: './404',
          // },
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
