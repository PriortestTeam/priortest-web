/*
 * @Author: your name
 * @Date: 2021-01-06 16:38:28
 * @LastEditTime: 2021-01-29 10:03:20
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \idm-project-uid:\project\oneclick-web\src\api\admincenter.js
 */
import request from '@/utils/request'

// 个人中心获取角色
export function queryRoles () {
  return request({
    url: '/subUser/queryRoles',
    method: 'get'
  })
}
// 个人中心获取项目
export function queryForProjectTitles () {
  return request({
    url: '/subUser/queryForProjects',
    method: 'get'
  })
}

// 个人中心账户列表
export function querySubUsers (query) {
  return request({
    url: '/subUser/querySubUsers',
    method: 'post',
    params: query,
    data: {}
  })
}
// 个人中心新建账户
export function createSubUser (query) {
  return request({
    url: '/subUser/createSubUser',
    method: 'post',
    data: query
  })
}
// 个人中心更新账户
export function updateSubUser (query) {
  return request({
    url: '/subUser/updateSubUser',
    method: 'post',
    data: query
  })
}
// 删除账户
export function deleteSubUser (data) {
  return request({
    url: '/subUser/deleteSubUser/' + data,
    method: 'delete'
  })
}

// 权限
export function getProjects (data) {
  return request({
    url: '/settingPermission/getProjects',
    method: 'get',
    params: data
  })
}
export function getPermissions (data) {
  return request({
    url: '/settingPermission/getPermissions',
    method: 'get',
    params: data
  })
}

export function updatePermissions (query) {
  return request({
    url: '/settingPermission/updatePermissions',
    method: 'post',
    data: query
  })
}

/** *系统字段 */
export function querySysCustomFields () {
  return request({
    url: '/sysCustomField/querySysCustomFields',
    method: 'get'
  })
}
export function updateSysCustomFields (query) {
  return request({
    url: '/sysCustomField/updateSysCustomFields',
    method: 'post',
    data: query
  })
}
export function getSysCustomField (data) {
  return request({
    url: '/sysCustomField/getSysCustomField',
    method: 'get',
    params: data
  })
}
// 项目获取角色
export function getUserRoles () {
  return request({
    url: '/role/allList',
    method: 'get'
  })
}
