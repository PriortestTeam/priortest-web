/*
 * @Author: your name
 * @Date: 2021-01-06 16:38:28
 * @LastEditTime: 2021-01-28 15:01:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \oneclick-web\src\api\project.js
 */
import request from '@/utils/request'

export function queryForProjects(params, data) {
  return request({
    url: '/project/queryForProjects',
    method: 'post',
    // post拼接路由参数
    params: params,
    data: data
  })
}
// 添加项目
export function addProjects(data) {
  return request({
    url: '/project/addProject',
    method: 'post',
    data
  })
}
// 删除项目
export function delProjects(data) {
  return request({
    url: '/project/deleteProject/' + data,
    method: 'delete'
  })
}

// 修改项目
export function editProjects(data) {
  return request({
    url: '/project/updateProject',
    method: 'post',
    data
  })
}
// 切换项目
export function checkProject(id) {
  return request({
    url: '/project/checkProject/' + id,
    method: 'get'
  })
}
//  *************************   项目view   *********************//
export function queryViews(data, page) {
  return request({
    url: '/view/queryViews',
    method: 'post',
    params: page,
    data: data
  })
}
// 查看view
export function lookView(data) {
  return request({
    url: '/view/queryById/' + data,
    method: 'get'
  })
}
// 添加view
export function addView(data) {
  return request({
    url: '/view/addView',
    method: 'post',
    data
  })
}
// 更新view
export function updateView(data) {
  return request({
    url: '/view/updateView',
    method: 'post',
    data
  })
}
// 删除view

export function deleteView(data) {
  return request({
    url: '/view/deleteView/' + data,
    method: 'delete'
  })
}

// 获取负责人
export function queryByNameSubUsers(data) {
  return request({
    url: '/user/queryByNameSubUsers',
    method: 'post',
    params: data
  })
}
// 获取详情
export function getFeature(id) {
  return request({
    url: '/project/queryById/' + id,
    method: 'get'
  })
}
// 关闭
export function getCloseProject(data) {
  return request({
    url: '/project/getCloseProject',
    method: 'get',
    params: data
  })
}

// 获取view 创建是的下拉框
export function getViewScopeChildParams(scope) {
  return request({
    url: '/view/getViewScopeChildParams',
    method: 'get',
    params: scope
  })
}

// 查询父view
export function queryViewParents(params) {
  return request({
    url: '/view/queryViewParents',
    method: 'get',
    params: params
  })
}

// 查询view 树状结构
export function queryViewTrees(params) {
  return request({
    url: '/view/queryViewTrees',
    method: 'get',
    params: params
  })
}
// 查询view 树状结构
export function getAllSysCustomField() {
  return request({
    url: '/project/getAllSysCustomField',
    method: 'get'
  })
}

// 查询字段
export function getAllCustomField(params) {
  return request({
    url: '/project/getAllCustomField',
    method: 'post',
    data: params
  })
}
