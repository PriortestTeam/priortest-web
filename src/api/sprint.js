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
    url: '/sprint/queryList',
    method: 'post',
    // post拼接路由参数
    params: params,
    data: data
  })
}
// 没有分页的
export function sprintListAll (data) {
  return request({
    url: '/leftJoin/querySprintTitles',
    method: 'get',
    params: data
  })
}
// 添加项目
export function addSprint (data) {
  return request({
    url: '/sprint/insert',
    method: 'post',
    data
  })
}
// 获取详情
export function detailSprint (id) {
  return request({
    url: '/sprint/queryById/' + id,
    method: 'get'
  })
}
// 删除项目
export function delSprint (id) {
  return request({
    url: '/sprint/delete/' + id,
    method: 'delete'
  })
}

// 修改项目
export function editSprint (data) {
  return request({
    url: '/sprint/update',
    method: 'post',
    data
  })
}
