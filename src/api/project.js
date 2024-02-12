/*
 * @Author: your name
 * @Date: 2021-01-06 16:38:28
 * @LastEditTime: 2022-06-05 11:01:12
 * @LastEditors: Mic
 * @Description: In User Settings Edit
 * @FilePath: \oneclick-web\src\api\project.js
 */
import request from "@/utils/request";

//export function queryForProjects (params, data) {
//return request({
// url: '/project/queryForProjects',
//method: 'post',
// post拼接路由参数
//params: params,
//data: data
//})
//}

export function queryForProjects(params, data) {
  return request({
    url: "/subUser/queryForProjectsbyUser",
    method: "get",
    // post拼接路由参数
    params: params,
    data: data,
  });
}

// 添加项目
export function addProjects(data) {
  return request({
    url: "/project/addProject",
    method: "post",
    data,
  });
}
// 删除项目
export function delProjects(data) {
  return request({
    url: "/project/deleteProject/" + data,
    method: "delete",
  });
}

// 修改项目
export function editProjects(data) {
  return request({
    url: "/project/updateProject",
    method: "post",
    data,
  });
}
// 切换项目
export function checkProject(id) {
  return request({
    url: "/project/checkProject/" + id,
    method: "get",
  });
}

// 获取负责人
export function queryByNameSubUsers(data) {
  return request({
    url: "/user/queryByNameSubUsers",
    method: "post",
    params: data,
  });
}

// 获取负责人
export function queryNameUsersByRoomId(data) {
  return request({
    url: "/user/queryNameUsersByRoomId",
    method: "post",
    params: data,
  });
}

// 获取详情
export function getFeature(id) {
  return request({
    url: "/project/queryById/" + id,
    method: "get",
  });
}
// 关闭
export function getCloseProject(data) {
  return request({
    url: "/project/getCloseProject",
    method: "get",
    params: data,
  });
}

// 获取自定义字段
export function getAllCustomField(params) {
  return request({
    url: "/customFields/getAllCustomList",
    method: "get",
    params,
  });
}

// 获取系统字段
export function getAllSysCustomFields(params) {
  return request({
    url: "/CustomFieldData/getAllSysCustomField",
    method: "get",
    params,
  });
}
