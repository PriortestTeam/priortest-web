/*
 * @Author: your name
 * @Date: 2021-01-06 16:38:28
 * @LastEditTime: 2021-01-28 15:01:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \oneclick-web\src\api\project.js
 */
import request from '@/utils/request'

export function issueList (params, data) {
  return request({
    url: '/issue/list',
    method: 'post',
    // post拼接路由参数
    params: params,
    data: data
  })
}

export function issueListByClick(params) {
  return request({
    url: `bean/search/${params.scope}/${params.viewId}`,
    method: 'get',
    // post拼接路由参数
    // params
    // data: data
  })
}
// 删除 记录
export function delIssue (id) {
  return request({
    url: '/issue/delete/' + id,
    method: 'delete'
  })
}


// clone 记录
export function cloneIssue(data) {
  return request({
    url: '/issue/clone',
    method: 'post',
    data: data
  })
}

// new issue save / update, get method api
// 添加记录
export function issueSave(params, data) {
  return request({
    url: '/issue/save',
    method: 'post',
    data: params
  })
}

// 修改记录
export function issueUpdate(params) {
  return request({
    url: '/issue/update',
    method: 'put',
    data: params
  })
}

// 获取某条记录的详请
export function issueInfo(params) {
  return request({
    url: '/issue/info/' + params.id,
    method: 'get'
  })
}

