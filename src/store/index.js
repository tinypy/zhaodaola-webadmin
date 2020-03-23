import Vue from 'vue';
import Vuex from 'vuex';

import { getToken, removeToken } from 'js/common/auth.js';

Vue.use(Vuex);

const baseApi = 'http://192.168.1.3:8001';

export default new Vuex.Store({
  state: {
    User: {},
    roles: [],
    token: getToken(),
    siderCollapsed: false,
    baseApi: baseApi
  },
  mutations: {
    updateAccount(state, data) {
      state.User = data;
    },
    updateRoles(state, data) {
      state.roles = data;
    },
    updateSiderCollapse(state, isShow) {
      setTimeout(() => {
        G.trigger('page_resize');
      }, 600);
      state.siderCollapsed = isShow;
    }
  },
  actions: {
    updateAccount(context, data) {
      context.commit('updateAccount', data);
    },
    updateRoles(context, data) {
      context.commit('updateRoles', data);
    },
    updateSiderCollapse(context, data) {
      context.commit('updateSiderCollapse', data);
    },
    userLogout({ commit }) {
      new Promise((resolve, reject) => {
        removeToken();
        resolve();
      });
    }
  },
  getters: {
    account: state => {
      return state.User;
    },
    roels: state => {
      return state.roles;
    },
    siderCollapsed: state => {
      return state.siderCollapsed;
    },
    baseApi: state => {
      return state.baseApi;
    }
  }
});
