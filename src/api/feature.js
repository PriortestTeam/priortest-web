/*
 * @Author: your name
 * @Date: 2021-01-06 16:38:28
 * @LastEditTime: 2021-01-28 15:01:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \oneclick-web\src\api\project.js
 */
import request from '@/utils/request'

export function featureList(params, data) {
  return request({
    url: '/feature/queryList',
    method: 'post',
    // post拼接路由参数
    params: params,
    data: data
  })
}
// 添加项目
export function addFeature(data) {
  return request({
    url: '/feature/insert',
    method: 'post',
    data
  })
}
// 获取详情
export function detailFeature(id) {
  return request({
    url: '/feature/queryById/' + id,
    method: 'get',
  })
}
// 删除项目
export function delFeature(id) {
  return request({
    url: '/feature/delete/' + id,
    method: 'delete'
  })
}

// 修改项目
export function editFeature(data) {
  return request({
    url: '/feature/update',
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

