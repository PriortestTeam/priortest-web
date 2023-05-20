/*
 * @Author: your name
 * @Date: 2021-01-06 16:38:28
 * @LastEditTime: 2021-01-28 15:01:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \oneclick-web\src\api\project.js
 */
import request from '@/utils/request'

export function sprintList (params, data) {
  return request({
    url: '/sprint/list',
    method: 'post',
    // post拼接路由参数
    params: params,
    data: data
  })
}

// clone 记录
export function cloneSprint(data) {
  return request({
    url: '/sprint/clone',
    method: 'post',
    data: data
  })
}

// 添加项目
export function sprintSave(params, data) {
  return request({
    url: '/sprint/save',
    method: 'post',
    data:params
  })
}
// 获取详情
export function sprintInfo(params) {
  return request({
    url: '/sprint/info/' + params.id,
    method: 'get'
  })
}
// 删除项目
export function delSprint(id) {
  return request({
    url: '/sprint/delete/' + id,
    method: 'delete'
  })
}

// 修改项目
export function sprintUpdate(params) {
  return request({
    url: '/sprint/update',
    method: 'put',
    data:params
  })
}
