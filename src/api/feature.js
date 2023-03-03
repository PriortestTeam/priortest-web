/*
 * @Author: your name
 * @Date: 2021-01-06 16:38:28
 * @LastEditTime: 2021-02-16 13:51:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \oneclick-web\src\api\project.js
 */
import request from '@/utils/request'

export function featureList (params, data) {
  return request({
    url: '/feature/queryList',
    method: 'post',
    // post拼接路由参数
    params: params,
    data: data
  })
}
// 没有分页的
export function featureListAll (data) {
  return request({
    url: '/leftJoin/queryFeatureTitles',
    method: 'get',
    params: data
  })
}
// 添加项目
export function addFeature (data) {
  return request({
    url: '/feature/insert',
    method: 'post',
    data
  })
}
// 获取详情
export function detailFeature (id) {
  return request({
    url: '/feature/queryById/' + id,
    method: 'get'
  })
}
// 删除项目
export function delFeature (id) {
  return request({
    url: '/feature/delete/' + id,
    method: 'delete'
  })
}

// 修改项目
export function editFeature (data) {
  return request({
    url: '/feature/update',
    method: 'post',
    data
  })
}
// 列表操作切换项目
export function closeUpdate (data) {
  return request({
    url: '/feature/closeUpdate',
    method: 'post',
    params: data
  })
}
// 切换项目
export function checkProject (id) {
  return request({
    url: '/project/checkProject/' + id,
    method: 'get'
  })
}
