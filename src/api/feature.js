/*
 * @Author: your name
 * @Date: 2021-01-06 16:38:28
 * @LastEditTime: 2021-01-28 15:01:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \oneclick-web\src\api\project.js
 */
import request from '@/utils/request'

export function featureList (params, data) {
  return request({
    url: '/feature/list',
    method: 'post',
    // post拼接路由参数
    params: params,
    data: data
  })
}


// 删除 记录
export function delFeature (id) {
  return request({
    url: '/feature/delete/' + id,
    method: 'delete'
  })
}


// clone 记录
export function cloneFeature(data) {
  return request({
    url: '/feature/clone',
    method: 'post',
    data: data
  })
}

// new feature save / update, get method api
// 添加记录
export function featureSave(params, data) {
  return request({
    url: '/feature/save',
    method: 'post',
    data: params
  })
}

// 修改记录
export function featureUpdate(params) {
  return request({
    url: '/feature/update',
    method: 'put',
    data: params
  })
}

// 获取某条记录的详请
export function featureInfo(params) {
  return request({
    url: '/feature/info/' + params.id,
    method: 'get'
  })
}

