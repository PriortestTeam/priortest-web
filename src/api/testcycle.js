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
// 没有分页的
export function testCycleListAll(data) {
  return request({
    url: '/leftJoin/queryFestCycleTitles',
    method: 'get',
    params: data
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
    method: 'get'
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
/** *弹框 新增步骤
 *
 */
export function testCycleCase(params, data) {
  return request({
    url: '/testCycle/queryBindCaseList',
    method: 'post',
    // post拼接路由参数
    params: params,
    data: data
  })
}
// 添加
export function addtestCycle(data) {
  return request({
    url: '/testCycle/bindCaseInsert',
    method: 'post',
    data
  })
}
// 删除
export function bindCaseDelete(id) {
  return request({
    url: '/testCycle/bindCaseDelete/' + id,
    method: 'delete'
  })
}
// 执行测试力
export function executeTestCase(data) {
  return request({
    url: '/testCycle/executeTestCase',
    method: 'post',
    data
  })
}

