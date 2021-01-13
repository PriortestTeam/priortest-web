import request from '@/utils/request'


//个人中心获取角色
export function queryRoles() {
  return request({
    url: '/subUser/queryRoles',
    method: 'get'
  })
}
//个人中心获取项目
export function queryForProjectTitles() {
  return request({
    url: '/subUser/queryForProjects',
    method: 'get',
  })
}

//个人中心账户列表
export function querySubUsers(query) {
  return request({
    url: '/subUser/querySubUsers',
    method: 'post',
    params: query,
    data: {}
  })
}
//个人中心新建账户
export function createSubUser(query) {
  return request({
    url: '/subUser/createSubUser',
    method: 'post',
    data: query
  })
}
//个人中心更新账户
export function updateSubUser(query) {
  return request({
    url: '/subUser/updateSubUser',
    method: 'post',
    data: query
  })
}
//删除账户
export function deleteSubUser(data) {
  return request({
    url: '/subUser/deleteSubUser/' + data,
    method: 'delete'
  })
}
//权限
export function getSysOperationAuthority() {
  return request({
    url: '/settingPermission/getSysOperationAuthority',
    method: 'get',
  })
}
//权限
export function getPermissions(data) {
  return request({
    url: '/settingPermission/getPermissions/' + data,
    method: 'get'
  })
}