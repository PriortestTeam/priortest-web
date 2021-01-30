/*
 * @Author: your name
 * @Date: 2021-01-06 16:38:28
 * @LastEditTime: 2021-01-30 19:03:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \idm-project-uid:\project\oneclick-web\src\api\admincenter.js
 */
import request from '@/utils/request'

// 查询自定义字段
export function queryCustomList(data, page) {
  return request({
    url: '/customField/queryCustomList',
    method: 'post',
    params: page,
    data: data
  })
}

// 查看view
export function queryFieldRadioById(data) {
  return request({
    url: '/customField/queryFieldRadioById/' + data,
    method: 'get'
  })
}
// 新增radio字段
export function addCustomRadio(data) {
  return request({
    url: '/customField/addCustomRadio',
    method: 'post',
    data
  })
}
// 修改radio字段
export function updateCustomRadio(data) {
  return request({
    url: '/customField/updateCustomRadio',
    method: 'post',
    data
  })
}

