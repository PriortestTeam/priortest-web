/*
 * @Author: your name
 * @Date: 2021-01-06 16:38:28
 * @LastEditTime: 2021-01-28 15:01:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \oneclick-web\src\api\project.js
 */
import request from '@/utils/request'

export function testCycleList(params, data) {
  return request({
    url: '/testCycle/queryList',
    method: 'post',
    // post拼接路由参数
    params: params,
    data: data
  })
}
// 添加项目
export function addTestCycle(data) {
  return request({
    url: '/testCycle/insert',
    method: 'post',
    data
  })
}
// 获取详情
export function detailTestCycle(id) {
  return request({
    url: '/testCycle/queryById/' + id,
    method: 'get',
  })
}
// 删除项目
export function delTestCycle(id) {
  return request({
    url: '/testCycle/delete/' + id,
    method: 'delete'
  })
}

// 修改项目
export function editTestCycle(data) {
  return request({
    url: '/testCycle/update',
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