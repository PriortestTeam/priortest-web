/*
 * @Author: your name
 * @Date: 2021-01-06 16:38:28
 * @LastEditTime: 2021-01-28 15:01:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \oneclick-web\src\api\project.js
 */
import request from "@/utils/request";

export function issueList(params, data) {
  return request({
    url: "/issue/list",
    method: "post",
    // post拼接路由参数
    params: params,
    data: data,
  });
}

export function issueListByClick(params) {
  return request({
    url: `bean/search/${params.scope}/${params.viewId}`,
    method: "get",
    // post拼接路由参数
    // params
    // data: data
  });
}
// 删除 记录
export function delIssue(id) {
  return request({
    url: "/issue/delete/" + id,
    method: "delete",
  });
}

// clone 记录
export function cloneIssue(data) {
  return request({
    url: "/issue/clone",
    method: "post",
    data: data,
  });
}

// new issue save / update, get method api
// 添加记录
export function issueSave(params, data) {
  return request({
    url: "/issue/save",
    method: "post",
    data: params,
  });
}

// 修改记录
export function issueUpdate(params) {
  return request({
    url: "/issue/update",
    method: "put",
    data: params,
  });
}

// 获取某条记录的详请
export function issueInfo(params) {
  return request({
    url: "/issue/info/" + params.id,
    method: "get",
  });
}

// 获取关联记录-链接的列表
export function issueLinkList(data) {
  return request({
    url: "/relation/object/list",
    method: "post",
    data: data,
  });
}

// 保存关联某条记录-链接
export function issueLinkSave(data) {
  return request({
    url: "/relation/save",
    method: "post",
    data: data,
  });
}

// 删除关联某条记录-链接
export function issueLinkDelete(ids) {
  return request({
    url: `/relation/delete/${ids.ids}`,
    method: "delete",
    // data: data,
  });
}

// 获取关联记录-链接的列表
export function issueLinkIdList(data) {
  console.log("issueLinkIdList", data);
  return request({
    url: `testCase/info/${data.id}`,
    method: "get",
  });
}
