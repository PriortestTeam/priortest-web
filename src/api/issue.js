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
    url: '/issue/queryList',
    method: 'post',
    // post拼接路由参数
    params: params,
    data: data
  })
}
// 添加项目
export function addIssue (data) {
  return request({
    url: '/issue/insert',
    method: 'post',
    data
  })
}
// 获取详情
export function detailIssue (id) {
  return request({
    url: '/issue/queryById/' + id,
    method: 'get'
  })
}
// 删除项目
export function delIssue (id) {
  return request({
    url: '/issue/delete/' + id,
    method: 'delete'
  })
}

// 修改项目
export function editIssue (data) {
  return request({
    url: '/issue/update',
    method: 'post',
    data
  })
}
/** *弹框 新增步骤
 *
 */
