import axios from 'axios';
import qs from 'qs';
import Utils from './utils';

import { getToken } from 'js/common/auth.js';

const DefaultParam = { repeatable: false };

let ajax = {
  PREFIX: '/api',
  requestingApi: new Set(),
  extractUrl: function(url) {
    return url ? url.split('?')[0] : '';
  },
  isRequesting: function(url) {
    let api = this.extractUrl(url);
    return this.requestingApi.has(api);
  },
  addRequest: function(url) {
    let api = this.extractUrl(url);
    this.requestingApi.add(api);
  },
  deleteRequest: function(url) {
    let api = this.extractUrl(url);
    this.requestingApi.delete(api);
  },
  get: function(url, param, extendParam) {
    let params = {
      url,
      method: 'GET'
    };
    if (param) {
      params.params = param;
    }
    return this.ajax(params, extendParam);
  },
  post: function(url, param, extendParam, dataType = 'json') {
    var params = {
      url,
      method: 'POST'
    };
    if (param) params.data = qs.stringify(param);
    return this.ajax(params, extendParam, dataType);
  },
  postJson: function(url, paramJson, extendParam) {
    return this.ajax(
      {
        url,
        method: 'POST',
        data: paramJson
      },
      extendParam
    );
  },
  patchJson: function(url, paramJson, dataType, extendParam) {
    return this.ajax(
      {
        url,
        method: 'PATCH',
        data: paramJson
      },
      extendParam
    );
  },
  delete: function(url, extendParam) {
    return this.ajax(
      {
        url: url,
        method: 'DELETE'
      },
      extendParam
    );
  },
  ajax: function(param, extendParam, dataType = 'json') {
    // 参数合并对象
    let params = Utils.extend({}, DefaultParam, param, extendParam || {});
    // http请求
    params.crossDomain = params.url.indexOf('http') === 0;
    let url = params.url;
    if (!params.crossDomain) {
      url = params.url = this.PREFIX + params.url;
    }
    if (params.method != 'GET') {
      if (this.isRequesting(url)) {
        return new Promise((resolve, reject) => {
          resolve({ ok: false, msg: '重复请求' });
        });
      }
      if (params.repeatable === false) {
        this.addRequest(url);
      }
    }
    // 请求头
    let header = {
      Authorization: getToken(),
      ContentType: 'application/json'
    };
    let defaultParam = {
      timeout: 10000,
      headers: header,
      responseType: dataType,
      validateStatus: function(status) {
        return true;
      },
      paramsSerializer: params => {
        return qs.stringify(params, { allowDots: true });
      }
    };
    if (params.crossDomain) {
      defaultParam.headers = {};
    }
    let that = this;
    params = Utils.extend({}, defaultParam, params);

    // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
    return new Promise(resolve => {
      return axios
        .request(params)
        .then(response => {
          that.deleteRequest(params.url);

          console.log(response);

          let code = response.status;
          let data = response.data;
          if (code && code != 200) {
            if (code == 401) {
              window.top.location = '/login';
              return;
            }
            if (code == 500) {
              HeyUI.$Notice({
                type: 'error',
                title: 'Tips',
                content: `接口请求失败`
              });
            } else if (code == 404) {
              HeyUI.$Notice({
                type: 'error',
                title: 'Tips',
                content: `请求地址不存在`
              });
            } else {
              const errorMsg = data.message;
              if (errorMsg !== undefined) {
                HeyUI.$Notice({
                  type: 'error',
                  title: 'Tips',
                  content: errorMsg
                });
              }
            }
          }

          let result = {};
          result.body = data;
          result.ok = code == 200;

          console.log(result);

          resolve(result);
        })
        .catch(() => {
          that.deleteRequest(params.url);
          resolve({
            ok: false
          });
        });
    });
  }
};
export default ajax;
