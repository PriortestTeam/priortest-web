/*
 * @Date: 2022-06-04 19:17:46
 * @Author: Mic
 * @LastEditors: Mic
 * @LastEditTime: 2022-06-04 19:18:54
 */
import request from '@/utils/request'

export function getQueryViewParents (params) {
  return request({
    url: '/view/queryViewParents',
    method: 'get',
    params
  })
}

// 获取view 创建是的下拉框
export function getViewScopeChildParams(scope) {
  return request({
    url: "/view/getViewScopeChildParams",
    method: "get",
    params: scope,
  });
}

export function queryViews(data, page) {
  return request({
    url: "/view/queryViews",
    method: "post",
    params: page,
    data: data,
  });
}
// 查看view
export function lookView(data) {
  return request({
    url: "/view/queryById/" + data,
    method: "get",
  });
}

export function getViewAllScopeParams(scope, projectId) {
  return request({
    url: `/customFields/getAllCustomList?projectId=${projectId}`,
    method: "get",
    params: scope,
  });
}


// 添加view
export function addView(data) {
  return request({
    url: "/view/addView",
    method: "post",
    data,
  });
}
export function addViewRE(data) {
  return request({
    url: "/view/addViewRE",
    method: "post",
    data,
  });
}
// 更新view
export function updateView(data) {
  return request({
    url: "/view/updateView",
    method: "post",
    data,
  });
}
// 删除view
export function deleteView(data) {
  return request({
    url: "/view/deleteView/" + data,
    method: "delete",
  });
}

// view-查询条件
export function getViewFilter() {
  return request({
    url: "/view/getViewFilter",
    method: "post",
  });
}



// 查询父view
export function queryViewParents(params) {
  return request({
    url: "/view/queryViewParents",
    method: "get",
    params: params,
  });
}

// 查询view 树状结构 - 用于每个模块的左边
export function queryViewTrees(params) {
  return request({
    url: "/view/queryViewTrees",
    method: "get",
    params: params,
  });
}
