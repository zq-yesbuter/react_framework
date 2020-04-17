

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
            path: '/AI/outging',
            name: '外呼管理',
            icon: 'appstore',
            routes: [
              {
                name: '外呼任务',
                path: '/AI/outging',
                component: '../pages/Process/OutgoingTask',
                icon: "align-left",
              },
              {
                name: '外呼配置',
                hideInMenu: true,
                path: '/AI/outging/config',
                component: '../pages/Process/Config',
                // icon: 'smile',
              },
              {
                name: '外呼名单',
                hideInMenu: true,
                path: '/AI/outging/namelist',
                component: '../pages/Process/NameList',
                // icon: 'smile',
              },
              {
                name: '沟通记录',
                hideInMenu: true,
                path: '/AI/outging/record',
                component: '../pages/Process/Record',
                // icon: 'smile',
              },
              {
                component: '../pages/404.jsx',
              },
            ],
          },
          // {
          //   path: '/AI/recruit',
          //   name: '微信招聘',
          //   icon: 'barcode',
          //   // redirect: '/AI/recruit/post',
          //   routes: [
          //     {
          //       name: '岗位维护',
          //       path: '/AI/recruit/post',
          //       component: '../pages/Recruit/Post',
          //       icon: "profile",
          //     },
          //     {
          //       name: '添加岗位',
          //       hideInMenu: true,
          //       path: '/AI/recruit/post/add',
          //       component: '../pages/Recruit/Post/Add',
          //       // icon: "profile",
          //     },
          //     {
          //       name: '投递记录',
          //       path: '/AI/recruit/record',
          //       component: '../pages/Recruit/Record',
          //       icon: "file-text",
          //     },
          //     {
          //       name: '面试管理',
          //       path: '/AI/recruit/interview',
          //       component: '../pages/Recruit/Interview',
          //       icon: "read",
          //     },
          //     {
          //       name: '内推记录',
          //       path: '/AI/recruit/manPush',
          //       component: '../pages/Recruit/ManPush',
          //       icon: "book",
          //     },
          //     {
          //       name: '岗位推荐',
          //       hideInMenu: true,
          //       path: '/AI/recruit/manPush/post',
          //       component: '../pages/Recruit/ManPush',
          //       icon: "book",
          //     },
          //     {
          //       name: '简历推荐',
          //       hideInMenu: true,
          //       path: '/AI/recruit/manPush/man',
          //       component: '../pages/Recruit/ManPush',
          //       icon: "book",
          //     },
              
          //     {
          //       component: '../pages/404.jsx',
          //     },
          //   ],
          // },
          {
            component: '../pages/404.jsx',
          },
        ],
      },
      // {
      //   component: './403',
      // },
      // {
      //   component: './500',
      // },
      {
        component: '../pages/404.jsx',
      },
    ],
  },
  {
    component: '../pages/404.jsx',
  },
];
