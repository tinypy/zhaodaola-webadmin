export default [
  {
    path: '/user-list',
    name: 'UserList',
    component: resolve => require(['../views/user/user-list'], resolve),
    meta: { title: '用户列表', icon: 'icon-command' }
  },
  {
    path: '/user-import',
    name: 'UserImport',
    component: resolve => require(['../views/user/user-import'], resolve),
    meta: { title: '用户导入', icon: 'icon-command' }
  },
  {
    path: '/category-list',
    name: 'CategoryManager',
    component: resolve => require(['../views/lostfound/category'], resolve),
    meta: { title: '物品分类', icon: 'icon-command' }
  },
  {
    path: '/site-list',
    name: 'SiteManager',
    component: resolve => require(['../views/lostfound/site'], resolve),
    meta: { title: '认领站点', icon: 'icon-command' }
  },
  {
    path: '/publish',
    name: 'LostPublish',
    component: resolve => require(['../views/lostfound/register'], resolve),
    meta: { title: '失物招领登记', icon: 'icon-command' },
    children: [
      {
        path: 'lost-publish',
        name: 'LostPublish',
        component: resolve => require(['../views/lostfound/register/lost-publish'], resolve),
        meta: { title: '寻物启事登记', icon: 'icon-command' }
      },
      {
        path: 'found-publish',
        name: 'FoundPublish',
        component: resolve => require(['../views/lostfound/register/found-publish'], resolve),
        meta: { title: '招领启事登记', icon: 'icon-command' }
      }
    ]
  },
  {
    path: '/lost-list',
    name: 'LostManager',
    component: resolve => require(['../views/lostfound/lost-list.vue'], resolve),
    meta: { title: '寻物启事管理', icon: 'icon-command' }
  },
  {
    path: '/lost-editor',
    name: 'LostEditor',
    component: resolve => require(['../views/lostfound/lost-editor'], resolve),
    meta: { title: '寻物信息修改', icon: 'icon-command' }
  },
  {
    path: '/found-list',
    name: 'FoundManager',
    component: resolve => require(['../views/lostfound/found-list.vue'], resolve),
    meta: { title: '认领启事管理', icon: 'icon-command' }
  },
  {
    path: '/found-editor',
    name: 'FoundEditor',
    component: resolve => require(['../views/lostfound/found-editor'], resolve),
    meta: { title: '认领信息修改', icon: 'icon-command' }
  },
  {
    path: '/news-list',
    name: 'NewsList',
    component: resolve => require(['../views/news/news-list'], resolve),
    meta: { title: '校园资讯列表', icon: 'icon-command' }
  },
  {
    path: '/news-type',
    name: 'NewsType',
    component: resolve => require(['../views/news/news-type'], resolve),
    meta: { title: '校园资讯分类', icon: 'icon-command' }
  },
  {
    path: '/news-publish',
    name: 'NewsPublish',
    component: resolve => require(['../views/news/news-publish'], resolve),
    meta: { title: '校园资讯发布', icon: 'icon-command' }
  },
  {
    path: '/news-editor',
    name: 'NewsEditor',
    component: resolve => require(['../views/news/news-editor'], resolve),
    meta: { title: '校园资讯编辑', icon: 'icon-command' }
  },
  {
    path: '/news-view',
    name: 'NewsView',
    component: resolve => require(['../views/news/news-view'], resolve),
    meta: { title: '校园资讯详情', icon: 'icon-command' }
  },
  {
    path: '/announce',
    name: 'Announce',
    component: resolve => require(['../views/websetting/announce'], resolve),
    meta: { title: '网站公告', icon: 'icon-command' }
  },
  {
    path: '/banner',
    name: 'Banner',
    component: resolve => require(['../views/websetting/banner'], resolve),
    meta: { title: '网站轮播图', icon: 'icon-command' }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: resolve => require(['../views/websetting/contact'], resolve),
    meta: { title: '联系我们', icon: 'icon-command' }
  },
  {
    path: '/announce-create',
    name: 'AnnounceCreate',
    component: resolve => require(['../views/websetting/announce-create'], resolve),
    meta: { title: '网站公告发布', icon: 'icon-command' }
  },
  {
    path: '/announce-editor',
    name: 'AnnounceEditor',
    component: resolve => require(['../views/websetting/announce-editor'], resolve),
    meta: { title: '网站公告修改', icon: 'icon-command' }
  },
  {
    path: '/role-list',
    name: 'RoleManager',
    component: resolve => require(['../views/system/role'], resolve),
    meta: { title: '角色管理', icon: 'icon-command' }
  },
  {
    path: '/menu-list',
    name: 'MenuManager',
    component: resolve => require(['../views/system/menu'], resolve),
    meta: { title: '菜单管理', icon: 'icon-command' }
  },
  {
    path: '/operation-list',
    name: 'OperationLog',
    component: resolve => require(['../views/logging/operation'], resolve),
    meta: { title: '操作日志', icon: 'icon-command' }
  },
  {
    path: '/exception-list',
    name: 'ExceptionLog',
    component: resolve => require(['../views/logging/exception'], resolve),
    meta: { title: '异常日志', icon: 'icon-command' }
  },
  {
    path: '/coomnet-list',
    name: 'CommentManager',
    component: resolve => require(['../views/message/comment'], resolve),
    meta: { title: '评论管理', icon: 'icon-command' }
  },
  {
    path: '/thanks-list',
    name: 'ThanksManager',
    component: resolve => require(['../views/message/thanks'], resolve),
    meta: { title: '感谢留言', icon: 'icon-command' }
  },
  {
    path: '/feedback-list',
    name: 'FeedBackManager',
    component: resolve => require(['../views/message/feedback'], resolve),
    meta: { title: '用户反馈', icon: 'icon-command' }
  },
  {
    path: '/user-center',
    name: 'UserCenter',
    component: resolve => require(['../views/user/user-center'], resolve),
    meta: { title: '个人中心', icon: 'icon-command' }
  }
];
