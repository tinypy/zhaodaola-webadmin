// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
import '@babel/polyfill';
import Vue from 'vue';
import App from './App';

import heyuiConfig from 'js/config/heyui-config';

// import routerConfig from 'js/config/router-config';
import router from './router';

// import store from 'js/vuex/store';
import store from './store';

import 'js/vue/components';
import 'js/vue/filters';

require('./css/app.less');

import animate from 'animate.css';
import '@/css/fonts/iconfont.css';

// HeyUI已经设定为全局变量，无需引用
// 设定全局变量请参考根目录下的hey.conf.js文件

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

heyuiConfig();
Vue.use(HeyUI);

// const router = routerConfig();

export default new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
