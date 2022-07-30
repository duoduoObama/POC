/**
 * httpservice拦截器与基本请求封装
 * create by duoduo
 * date 2021/12/7
 */
(function () {
  /**
   * 创建axios的实例
   */
  let httpService = axios.create({
    baseUrl: "./",
    timeout: 30000,
  });
  /**
   * axios的拦截--request
   */
  httpService.interceptors.request.use(
    (config) => {
      // 请求成功处理
      if (localStorage.getItem("token")) {
        //判断浏览器中的cookie中是否存在项目的token
        config.headers.token = localStorage.getItem("token");
      }
      return config;
    },
    (err) => {
      Promise.reject(err); // 请求错误处理
    }
  );

  /**
   * axios的拦截--response
   */
  httpService.interceptors.response.use(
    (response) => {
      // TODO:具体的code对应的处理可继续添加修改
      if (response.data.code === 200) {
        console.log("请求成功");
      }
      if (response.data.code === 300) {
        console.log(response.data.msg);
      }
      return response;
    },
    (err) => {
      // TODO:具体的code对应的处理可继续添加修改
      if (err.response.code === 301) {
        console.log("登录过期");
        setTimeout(() => {
          this.$router.replace({
            path: "/login",
            query: {
              redirect: this.$router.currentRoute.fullPath,
            },
          });
        }, 1000);
        localStorage.setItem("token", ""); //清除token
      }
      if (err.response.code === 500) {
        console.log("请联系管理员");
      }
      return Promise.reject(err);
    }
  );

  /**
   * get请求
   * @param {*} url
   * @param {*} params
   * @returns Promise
   */
  function get(url, params = {}) {
    return new Promise((resolve, reject) => {
      httpService({
        url: url,
        method: "get",
        params: params,
      })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * post请求  默认json格式:'Content-Type':'application/json',如果是文件上传，可以修改headers为 headers: { 'Content-Type': 'multipart/form-data' }
   * @param {*} url
   * @param {*} params
   * @param {*} headers
   * @returns Promise
   */
  function post(url, params = {}, headers = { "Content-Type": "application/json" }) {
    return new Promise((resolve, reject) => {
      httpService({
        url: url,
        method: "post",
        data: params,
        headers: headers,
      })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * delete请求
   * @param {*} url
   * @param {*} params
   * @param {*} headers
   * @returns Promise
   */
  function del(url, params = {}, headers = { "Content-Type": "application/json" }) {
    return new Promise((resolve, reject) => {
      httpService({
        url: url,
        method: "delete",
        data: params,
        headers: headers,
      })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  window.httpService = {
    get,
    post,
    del,
  };
})();
