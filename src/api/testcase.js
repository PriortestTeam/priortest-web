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
    url: '/testCase/list',
    method: 'post',
    // post拼接路由参数
    params: params,
    data: data
  })
}

// 没有分页的
export function testCaseListAll(data) {
  return request({
    url: '/leftJoin/queryFestCaseTitles',
    method: 'get',
    params: data
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
    method: 'get'
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

/** *弹框 新增步骤
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

export function getFeatureLikeArgs(id) {
  const reqBody = {
    featureId: id
  }
  return request({
    url: '/testCase/queryTestNeedByFeatureId',
    method: 'get',
    params: reqBody
  })
}

/**
 * 获取当前登录人模板和默认模板
 * @returns {AxiosPromise}
 */
export function queryListByUserId() {
  return request({
    url: '/testCaseTemplate/queryListByUserId',
    method: 'get'
  })
}

/**
 * 插入测试用例模板
 * @param data
 * @returns {AxiosPromise}
 */
export function addTestCaseTemplate(data) {
  return request({
    url: '/testCaseTemplate/insert',
    method: 'post',
    data
  })
}

/**
 * 删除模板
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteTemp(id) {
  return request({
    url: '/testCaseTemplate/delete/' + id,
    method: 'delete'
  })
}

/**
 * 更新测试用例模板
 * @param data
 * @returns {AxiosPromise}
 */
export function updateTestCaseTemplate(data) {
  return request({
    url: '/testCaseTemplate/update',
    method: 'post',
    data
  })
}

/**
 * 导入测试用例
 * @param data
 * @returns {AxiosPromise}
 */
export function importTestCase(data) {
  return request({
    url: '/testCaseTemplate/importTestCase',
    method: 'post',
    data
  })
}


export function testCaseSave(params, data) {
  return request({
    url: '/testCase/save',
    method: 'post',
    data: params
  })
}

export function testCaseUpdate(params) {
  return request({
    url: '/testCase/update',
    method: 'post',
    data: params
  })
}

export function testCaseInfo(params) {
  return request({
    url: '/testCase/info/' + params.id,
    method: 'get'
  })
}

