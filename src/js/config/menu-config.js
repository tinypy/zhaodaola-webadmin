const fullMenus = [
  {
    title: 'Dashboard',
    key: 'Home',
    icon: 'icon-monitor'
  },
  {
    title: '用户管理',
    key: 'User',
    icon: 'icon-grid-2',
    children: [
      {
        title: '用户列表',
        key: 'UserList'
      },
      {
        title: '用户导入',
        key: 'UserImport'
      }
    ]
  },
  {
    title: '失物招领管理',
    key: 'LostFound',
    icon: 'icon-folder',
    children: [
      {
        title: '物品分类',
        key: 'CategoryManager'
      },
      {
        title: '认领站点',
        key: 'SiteManager'
      },
      {
        title: '寻物管理',
        key: 'LostManager'
      },
      {
        title: '认领管理',
        key: 'FoundManager'
      },
      {
        title: '失物招领登记',
        key: 'LostPublish'
      }
    ]
  },
  {
    title: '校园资讯管理',
    key: 'NewsManager',
    icon: 'icon-bar-graph-2',
    children: [
      {
        title: '校园资讯列表',
        key: 'NewsList'
      },
      {
        title: '校园资讯分类',
        key: 'NewsType'
      },
      {
        title: '校园资讯发布',
        key: 'NewsPublish'
      }
    ]
  },
  {
    title: '网站设置',
    key: 'WebSetting',
    icon: 'icon-cog',
    children: [
      {
        title: '网站公告',
        key: 'Announce'
      },
      {
        title: '网站轮播图',
        key: 'Banner'
      },
      {
        title: '联系我们',
        key: 'Contact'
      }
    ]
  },
  {
    title: '系统管理',
    key: 'SystemManager',
    icon: 'icon-help',
    children: [
      {
        title: '角色管理',
        key: 'RoleManager'
      },
      {
        title: '菜单管理',
        key: 'MenuManager'
      }
    ]
  },
  {
    title: '日志管理',
    key: 'LogManager',
    icon: 'icon-archive',
    children: [
      {
        title: '操作日志',
        key: 'OperationLog'
      },
      {
        title: '异常日志',
        key: 'ExceptionLog'
      }
    ]
  },
  {
    title: '消息管理',
    key: 'MsgManager',
    icon: 'icon-volume',
    children: [
      {
        title: '评论管理',
        key: 'CommentManager'
      },
      {
        title: '感谢留言',
        key: 'ThanksManager'
      },
      {
        title: '用户反馈',
        key: 'FeedBackManager'
      }
    ]
  }
];

const getMenus = function(menuIdList = []) {
  return getAuthMenu(fullMenus, menuIdList);
};

let getAuthMenu = (menus, menuIdList) => {
  let configMenu = [];
  for (let menu of menus) {
    let m = Utils.copy(menu);
    if (menuIdList.indexOf(m.key) > -1) {
      configMenu.push(m);
    }
    if (menu.children && menu.children.length) {
      m.children = getAuthMenu(menu.children, menuIdList);
    }
  }
  return configMenu;
};

const getKeys = function(menus) {
  let keys = [];
  for (let menu of menus) {
    keys.push(menu.key);
    if (menu.children && menu.children.length) {
      keys.push(...getKeys(menu.children));
    }
  }
  return keys;
};

let fullMenuKeys = getKeys(fullMenus);

const isAuthPage = function(name) {
  let menus = G.get('SYS_MENUS') || [];
  if (fullMenuKeys.indexOf(name) > -1 && menus.indexOf(name) == -1) {
    return false;
  }
  return true;
};

export { getMenus, fullMenus, fullMenuKeys, isAuthPage };
