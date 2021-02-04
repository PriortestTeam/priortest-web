/*
 * @Author: your name
 * @Date: 2021-01-06 16:38:28
 * @LastEditTime: 2021-02-04 09:35:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \idm-project-uid:\project\oneclick-web\src\api\admincenter.js
 */
import request from '@/utils/request'

// 查询all自定义字段列表
export function queryCustomList(data, page) {
  return request({
    url: '/customField/queryCustomList',
    method: 'post',
    params: page,
    data: data
  })
}

// 查看radio详情
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
// 删除radio字段

export function deleteCustomRadio(data) {
  return request({
    url: '/customField/deleteCustomRadio/' + data,
    method: 'delete'
  })
}

// 文本

// 查看text详情
export function queryFieldTextById(data) {
  return request({
    url: '/customField/queryFieldTextById/' + data,
    method: 'get'
  })
}
// 新增Text字段
export function addCustomText(data) {
  return request({
    url: '/customField/addCustomText',
    method: 'post',
    data
  })
}

// 修改Text字段
export function updateCustomText(data) {
  return request({
    url: '/customField/updateCustomText',
    method: 'post',
    data
  })
}
// 删除Text字段

export function deleteCustomText(data) {
  return request({
    url: '/customField/deleteCustomText/' + data,
    method: 'delete'
  })
}

// 新增memo字段
export function addCustomRichText(data) {
  return request({
    url: '/customField/addCustomRichText',
    method: 'post',
    data
  })
}
// 修改memo字段
export function updateCustomRichText(data) {
  return request({
    url: '/customField/updateCustomRichText',
    method: 'post',
    data
  })
}
