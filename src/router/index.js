import Vue from 'vue';
import VueRouter from 'vue-router';
import { isAuthPage } from 'js/config/menu-config';

import { getToken, removeToken } from '../js/common/auth.js';
import store from '@/store';

Vue.use(VueRouter);

import componentsRouter from './components-router';

const routerParam = {
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: resolve => require(['../views/login/index'], resolve)
    },
    {
      path: '/403',
      name: '403',
      component: resolve => require(['components/error-pages/403'], resolve),
      meta: { title: '权限错误' }
    },
    {
      path: '/',
      component: resolve => require(['components/app/app-frame'], resolve),
      children: [
        {
          path: '',
          name: 'Home',
          component: resolve => require(['../views/home/index'], resolve),
          meta: { title: '首页', icon: 'icon-monitor' }
        },
        {
          path: 'system-error',
          name: 'SystemError',
          component: resolve => require(['components/error-pages/500'], resolve),
          meta: { title: '系统错误' }
        },
        ...componentsRouter,
        {
          path: '*',
          name: 'NotfoundError',
          component: resolve => require(['components/error-pages/404'], resolve),
          meta: { title: '页面找不到' }
        },
        {
          path: '/permission-error',
          name: 'PermissionError',
          component: resolve => require(['components/error-pages/403'], resolve),
          meta: { title: '权限错误' }
        }
      ]
    }
  ]
};

let router = new VueRouter(routerParam);

// let isFirstRouter = true;

const whiteList = ['/login', '/403']; // no redirect whitelist

router.beforeEach((to, from, next) => {
  HeyUI.$LoadingBar.start();
  if (getToken()) {
    // 已是登陆
    if (to.path == '/login') {
      next('/');
    }

    // 权限验证
    R.Menu.menus().then(res => {
      if (res.ok) {
        console.log(res.body);
        let menus = res.body || [];
        G.set('SYS_MENUS', menus);
        G.trigger('SYS_MENU_UPDATE');
        if (!isAuthPage(to.name)) {
          console.log(to.name);

          removeToken();
          next({ name: '403' });
          return;
        }
      }
    });

    // if (!isFirstRouter && !isAuthPage(to.name)) {
    //   next({ name: 'PermissionError' });
    //   return;
    // }

    // 获取用户信息;
    R.User.getUserInfo()
      .then(res => {
        if (res.ok) {
          store.dispatch('updateAccount', res.body);
          store.dispatch('updateRoles', res.body.roles);
        } else {
          removeToken();
          next('/login');
        }
      })
      .catch(error => {
        removeToken();
        location.reload();
      });

    if (to.meta && to.meta.title) {
      document.title = to.meta.title + ' - 管理应用';
    } else {
      document.title = '管理系统';
    }
    next();
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next(`/login?redirect=${to.path}`); // 否则全部重定向到登录页
    }
  }
});

router.afterEach(() => {
  HeyUI.$LoadingBar.success();
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  let layoutContent = document.querySelector('.h-layout-content');
  if (layoutContent) {
    layoutContent.scrollTop = 0;
  }
});

export default router;
