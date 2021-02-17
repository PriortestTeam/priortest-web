/*
 * @Author: your name
 * @Date: 2021-01-06 16:38:28
 * @LastEditTime: 2021-01-28 15:01:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \oneclick-web\src\api\project.js
 */
import request from '@/utils/request'

export function testCaseList(params, data) {
  return request({
    url: '/testCase/queryList',
    method: 'post',
    // post拼接路由参数
    params: params,
    data: data
  })
}
// 添加项目
export function addTestCase(data) {
  return request({
    url: '/testCase/insert',
    method: 'post',
    data
  })
}
// 获取详情
export function detailTestCase(id) {
  return request({
    url: '/testCase/queryById/' + id,
    method: 'get',
  })
}
// 删除项目
export function delTestCase(id) {
  return request({
    url: '/testCase/delete/' + id,
    method: 'delete'
  })
}

// 修改项目
export function editTestCase(data) {
  return request({
    url: '/testCase/update',
    method: 'post',
    data
  })
}
/***弹框 新增步骤
 * 
 */
export function testCaseStep(params, data) {
  return request({
    url: '/testCaseStep/queryList',
    method: 'post',
    // post拼接路由参数
    params: params,
    data: data
  })
}
// 添加
export function addTestCaseStep(data) {
  return request({
    url: '/testCaseStep/insert',
    method: 'post',
    data
  })
}
// 删除
export function delTestCaseStep(id) {
  return request({
    url: '/testCaseStep/delete/' + id,
    method: 'delete'
  })
}
export function editTestCaseStep(data) {
  return request({
    url: '/testCaseStep/update',
    method: 'post',
    data
  })
}