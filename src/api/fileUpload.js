/*
 * @Author: your name
 * @Date: 2021-02-16 13:51:31
 * @LastEditTime: 2021-02-17 16:02:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \oneclick-web\src\api\fileUpload.js
 */
import request from '@/utils/request'

export function addAttachment (params, data) {
  return request({
    url: '/attachment/addAttachment',
    method: 'post',
    // post拼接路由参数
    params: params,
    data: data
  })
}
// 获取文件
export function fileList (params) {
  return request({
    url: '/attachment/list',
    method: 'get',
    params: params
  })
}
// 删除文件
export function deleteAttachment (id) {
  return request({
    url: '/attachment/deleteAttachment/' + id,
    method: 'delete'
  })
}

// 修改文件
export function updateAttachment (id, data) {
  return request({
    url: '/attachment/updateAttachment/' + id,
    method: 'post',
    data: data
  })
}
