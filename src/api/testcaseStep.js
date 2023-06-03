/*
 * @Author: xiaohai
 * @Date: 2023年4月23日
 * @LastEditTime: 2023年4月23日
 * @LastEditors: 测试用例步骤 APIS
 * @Description: 测试用例步骤 APIS
 * @FilePath: \oneclick-web\src\api\testcaseStep.js
 */

import request from '@/utils/request'

// 测试用例步骤列表
export function testCaseStepListApi(params, data) {
  return request({
    url: '/testCase/step/list',
    method: 'post',
    // post拆分跟参数
    params: params,
    data: data
  })
}

// 添加测试用例步骤
export function addTestCaseStepApi(data) {
  return request({
    url: '/testCase/step/save',
    method: 'post',
    data
  })
}

// 修改测试用例步骤
export function editTestCaseStepApi(data) {
  return request({
    url: '/testCase/step/update',
    method: 'put',
    data
  })
}

// 删除测试用例步骤
export function delTestCaseStepApi(id) {
  return request({
    url: '/testCase/step/delete/' + id,
    method: 'delete'
  })
}

// 查询测试用例关联的所有测试用例步骤
export function queryTestCaseStepApi(id) {
  return request({
    url: '/testCase/step/of/testCase/' + id,
    method: 'get'
  })
}
