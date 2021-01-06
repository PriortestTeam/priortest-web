import request from '@/utils/request'
import { data } from 'autoprefixer'


//个人中心获取角色
export function queryRoles() {
  return request({
    url: '/subUser/queryRoles',
    method: 'get'
  })
}
//个人中心获取项目
export function queryForProjectTitles(data) {
  return request({
    url: '/subUser/queryForProjectTitles',
    method: 'get',
    params: data
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