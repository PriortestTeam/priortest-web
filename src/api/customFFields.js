import request from '@/utils/request'

// 类型
export function fieldTypeAPI() {
  return request({
    url: '/sysConfig/listByGroup/type',
    method: 'get'
  })
}
// 范围 必填 初始值
export function RangeS() {
  return request({
    url: '/sysConfig/listByGroup/scope',
    method: 'get'
  })
}
// 获取字段列表
export function fieldList(data) {
  return request({
    url: '/customFields/queryCustomList',
    method: 'get',
    params: data
  })
}
// 获取项目id
export function getInfo() {
  return request({
    url: '/user/queryUserInfo',
    method: 'get'
  })
}
// 新建自定义字段
export function add(data) {
  return request({
    url: '/customFields/add',
    method: 'post',
    data: data
  })
}
// 删除自定义字段
export function deleteApi(data) {
  return request({
    url: '/customFields/delete',
    method: 'delete',
    data: data
  })
}
// 系统列表下拉框
export function systemListAPI(data) {
  return request({
    url: '/customFields/getDropDownBox',
    method: 'get',
    params: data
  })
}
// 下拉菜单
export function downMenuAPI(data) {
  return request({
    url: '/user/listUserByProjectId/' + data,
    method: 'get',
  })
}
// 修改
export function unDataApi(data) {
  return request({
    url: '/customFields/update',
    method: 'put',
    headers:{
      "Access-Control-Allow-Methods":"GET, POST, PATCH, PUT, DELETE, OPTIONS"
    },
    data:data
  })
}


