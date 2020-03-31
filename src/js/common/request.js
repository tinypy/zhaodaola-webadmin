import Ajax from './ajax';
import ajax from './ajax';

const Request = {
  Code: {
    code() {
      return Ajax.post('/auth/code');
    }
  },
  Thanks: {
    deleteThanks(param) {
      return Ajax.postJson('/thanks/delete', param);
    },
    createThanks(param) {
      return Ajax.postJson('/thanks/create', param);
    },
    getThanks(param) {
      return Ajax.post('/thanks/getlist', param);
    }
  },
  Comment: {
    getCommentList(param) {
      return Ajax.post('/comment/list', param);
    },
    download(param) {
      return Ajax.post('/comment/download', param, {}, 'blob');
    },
    delete(param) {
      return Ajax.postJson('/comment/delete', param);
    }
  },
  Log: {
    getLogList(param, type) {
      return Ajax.post('/log/list/' + type, param);
    },
    download(param, type) {
      return Ajax.post('/log/download/' + type, param, {}, 'blob');
    }
  },
  Menu: {
    menus() {
      return Ajax.post('/menu/names');
    },
    treeMenu() {
      return Ajax.post('/menu/tree');
    },
    getAllMenu() {
      return Ajax.post('/menu/getAll');
    },
    getMenuIds(param) {
      return Ajax.post('/menu/getMenuIds/' + param);
    },
    saveMenu(param) {
      return Ajax.post('/menu/saveMenu', param);
    }
  },
  Role: {
    getAll() {
      return Ajax.post('/roles/all');
    },
    getRoleList(param) {
      return Ajax.post('/roles/list', param);
    },
    delete(param) {
      return Ajax.postJson('/roles/delete', param);
    },
    createRole(param) {
      return Ajax.postJson('/roles/create', param);
    },
    updateRole(param) {
      return Ajax.postJson('/roles/update', param);
    }
  },
  Contact: {
    getType(param) {
      return Ajax.post('/contact/' + param);
    },
    saveContact(param) {
      return Ajax.postJson('/contact/update', param);
    }
  },
  Banner: {
    getBannerList(param) {
      return Ajax.post('/banner/list', param);
    },
    create(param) {
      return Ajax.postJson('/banner/create', param);
    },
    delete(param) {
      return Ajax.postJson('/banner/delete', param);
    },
    getOne(param) {
      return Ajax.post('/banner/getOne/' + param);
    },
    editorBanner(param) {
      return Ajax.postJson('/banner/update', param);
    }
  },
  Announce: {
    getAnnounceList(param) {
      return Ajax.post('/announce/list', param);
    },
    delete(param) {
      return Ajax.postJson('/announce/delete', param);
    },
    publish(param) {
      return Ajax.postJson('/announce/create', param);
    },
    editorAnnounce(param) {
      return Ajax.postJson('/announce/update', param);
    },
    getOne(param) {
      return Ajax.post('/announce/getOne/' + param);
    }
  },
  News: {
    publish(param) {
      return Ajax.postJson('/news/publish', param);
    },
    getNewsList(param) {
      return Ajax.post('/news/list', param);
    },
    getOne(param) {
      return Ajax.post('/news/getOne/' + param);
    },
    delete(param) {
      return Ajax.postJson('/news/delete', param);
    },
    getEdtior(param) {
      return Ajax.postJson('/news/edtior/' + param);
    },
    editorNews(param) {
      return Ajax.postJson('/news/update', param);
    }
  },
  NewsType: {
    getList(param) {
      return Ajax.post('/newsType/list', param);
    },
    delete(param) {
      return Ajax.postJson('/newsType/delete', param);
    },
    create(param) {
      return Ajax.postJson('/newsType/create', param);
    },
    update(param) {
      return Ajax.postJson('/newsType/update', param);
    },
    getAll() {
      return Ajax.post('/newsType/getAll');
    }
  },
  Lost: {
    publishLost(param) {
      return Ajax.postJson('/losts/publish', param);
    },
    getLostList(param) {
      return Ajax.post('/losts/list', param);
    },
    download(param) {
      return Ajax.post('/losts/download', param, {}, 'blob');
    },
    deleteLost(param) {
      return Ajax.postJson('/losts/delete', param);
    },
    getOne(param) {
      return Ajax.post('/losts/getOne/' + param);
    },
    updateLost(param) {
      return Ajax.postJson('/losts/update', param);
    }
  },
  Found: {
    publishFound(param) {
      return Ajax.postJson('/founds/publish', param);
    },
    getFoundList(param) {
      return Ajax.post('/founds/list', param);
    },
    download(param) {
      return Ajax.post('/founds/download', param, {}, 'blob');
    },
    deleteFound(param) {
      return Ajax.postJson('/founds/delete', param);
    },
    getOne(param) {
      return Ajax.post('/founds/getOne/' + param);
    },
    updateFound(param) {
      return Ajax.postJson('/founds/update', param);
    }
  },
  Site: {
    getList(param) {
      return Ajax.post('/site/list', param);
    },
    download(param) {
      return Ajax.post('/site/download', param, {}, 'blob');
    },
    delete(param) {
      return Ajax.postJson('/site/delete', param);
    },
    create(param) {
      return Ajax.postJson('/site/create', param);
    },
    update(param) {
      return Ajax.postJson('/site/update', param);
    },
    getAll() {
      return Ajax.post('/site/getAll');
    }
  },
  Category: {
    getList(param) {
      return Ajax.post('/category/list', param);
    },
    download(param) {
      return Ajax.post('/category/download', param, {}, 'blob');
    },
    delete(param) {
      return Ajax.postJson('/category/delete', param);
    },
    create(param) {
      return Ajax.postJson('/category/create', param);
    },
    update(param) {
      return Ajax.postJson('/category/update', param);
    },
    getAll() {
      return Ajax.post('/category/getall');
    }
  },
  User: {
    login(param) {
      return Ajax.postJson('/auth/login', param);
    },
    getUserInfo() {
      return Ajax.post('/auth/info');
    },
    getUserList(param) {
      return Ajax.post('/users/list', param);
    },
    download(param) {
      return Ajax.post('/users/download', param, {}, 'blob');
    },
    resetPassword(param) {
      return Ajax.postJson('/users/resetPassword', param);
    },
    deleteUser(param) {
      return Ajax.postJson('/users/delete', param);
    },
    updateUser(param) {
      return Ajax.postJson('/users/update', param);
    },
    createUser(param) {
      return Ajax.postJson('/users/create', param);
    },
    updateInfo(param) {
      return Ajax.postJson('/users/updateInfo', param);
    },
    updatePass(param) {
      return Ajax.postJson('/users/updatePass', param);
    }
  }
};

export default Request;
