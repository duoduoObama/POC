/**
 * 编辑页接口服务
 * create by duoduo
 * date 2021/12/7
 */
(function () {
  /**
   * 保存页面数据
   * @param {*} params
   * @returns
   */
  async function saveInfo(params) {
    const { data = {} } = await httpService.post(origin + "/ui-builder/system-save", params);
    return data;
  }

  /**
   * 更新保存数据
   * @param {*} params
   * @returns
   */
  async function updateSaveInfo(params) {
    const { data = {} } = await httpService.post(origin + "/ui-builder/system-update", params);
    return data;
  }

  /**
   * 发布
   * @param {*} params
   * @returns
   */
  async function systemRelease(params) {
    const { data = {} } = await httpService.post(origin + "/ui-builder/system-release", params);
    return data;
  }

  /**
   * 页面数据查询
   * @param {*} params
   * @returns
   */
  async function systemFind(params) {
    const { data = {} } = await httpService.get(origin + "/ui-builder/system-find", params);
    return data;
  }

  /**
   * 菜单数据查询
   * @param {*} params
   * @returns
   */
  async function systemMenu(params) {
    const { data = {} } = await httpService.get(origin + "/ui-builder/system-menu", params);
    return data;
  }

  /**
   * uib配置数据查询
   * @param {*} params
   * @returns
   */
  async function systemConfig(params) {
    const { data = {} } = await httpService.get(origin + "/ui-builder/system-config", params);
    return data;
  }

  /**
   * uib配置数据存储与DI查询
   * @param {*} params
   * @returns
   */
  async function queryConfig(params) {
    const { data = {} } = await httpService.get(origin + "/ui-builder/query-config", params);
    return data;
  }

  /**
   * uib配置数据存储
   * @param {*} params
   * @returns
   */
  async function saveConfig(params) {
    const { data = {} } = await httpService.post(origin + "/ui-builder/save-config", params);
    return data;
  }

  /**
   * 组件更新
   * @param {*} params
   * @returns
   */
  async function updateComponent(params) {
    const { data = {} } = await httpService.post(origin + "/ui-builder/update-component", params);
    return data;
  }

  /**
   * 文件上传
   * @param {*} params
   * @returns
   */
  async function fileUpload(params) {
    const { data = {} } = await httpService.post(origin + "/ui-builder/file-upload", params);
    return data;
  }

  /**
   * 保存公共页面
   * @param {*} params
   * @returns
   */
  async function savePublicPage(params) {
    const { data = {} } = await httpService.post(origin + "/ui-builder/public-page", params);
    return data;
  }

  /**
   * 保存公共页面
   * @param {*} params
   * @returns
   */
  async function getPublicPage(params) {
    const { id } = params;
    const { data = {} } = await httpService.get(origin + `/ui-builder/public-page/${id}`, params);
    return data;
  }

  /**
   * 保存公共页面
   * @param {*} params
   * @returns
   */
  async function deletePublicPage(params) {
    const { data = {} } = await httpService.del(origin + `/ui-builder/public-page/`, params);
    return data;
  }

  /**
   * 保存组合组件
   * @param {*} params
   * @returns
   */
  async function saveCombinationComs(params) {
    const { data = {} } = await httpService.post(origin + `/ui-builder/combination-coms/`, params);
    return data;
  }

  /**
   * 删除组合组件
   * @param {*} params
   * @returns
   */
  async function delCombinationComs(params) {
    const { data = {} } = await httpService.del(origin + `/ui-builder/combination-coms/`, params);
    return data;
  }

  window.editService = {
    saveInfo,
    updateSaveInfo,
    systemRelease,
    systemFind,
    systemMenu,
    systemConfig,
    queryConfig,
    saveConfig,
    updateComponent,
    fileUpload,
    savePublicPage,
    getPublicPage,
    deletePublicPage,
    saveCombinationComs,
    delCombinationComs,
  };
})();
