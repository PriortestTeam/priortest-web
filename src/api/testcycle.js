/*
 * @Author: your name
 * @Date: 2021-01-06 16:38:28
 * @LastEditTime: 2021-01-28 15:01:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \oneclick-web\src\api\project.js
 */
import request from "@/utils/request";

export function testCycleList(params, data) {
  return request({
    url: "/testCycle/list",
    method: "post",
    // post拼接路由参数
    params: params,
    data: data,
  });
}

export function testCycleListByClick(p, params) {
  return request({
    url: `bean/search/${p.scope}/${p.viewId}`,
    method: "get",
    // post拼接路由参数
    params,
    // data: data
  });
}

// 添加测试周期
export function testCycleSave(params, data) {
  return request({
    url: "/testCycle/saveTestCycle",
    method: "post",
    data: params,
  });
}
// 测试周期更改
export function testCycleUpdate(params) {
  return request({
    url: "/testCycle/updateTestCycle",
    method: "put",
    data: params,
  });
}

// clone 记录
export function clonetestCycle(data) {
  return request({
    url: "/testCycle/clone",
    method: "post",
    data: data,
  });
}

// 获取详情
export function testCycleInfo(params) {
  return request({
    url: "/testCycle/info/" + params.id,
    method: "get",
  });
}

// 删除项目
export function deltestCycle(id) {
  return request({
    url: "/testCycle/deleteTestCycle/" + id,
    method: "delete",
  });
}

/** *弹框 新增步骤
 *
 */
export function testCycleCase(params, data) {
  return request({
    url: "/testCycle/queryBindCaseList",
    method: "post",
    // post拼接路由参数
    params: params,
    data: data,
  });
}
// 添加
export function addtestCycle(data) {
  return request({
    url: "/testCycle/bindCaseInsert",
    method: "post",
    data,
  });
}
// 删除
export function bindCaseDelete(id) {
  return request({
    url: "/testCycle/bindCaseDelete/" + id,
    method: "delete",
  });
}
// 执行测试力
export function executeTestCase(data) {
  return request({
    url: "/testCycle/executeTestCase",
    method: "post",
    data,
  });
}

//添加运行计划
//export function addSchedule(data) {
//return request({
//url: '/testCycle/addSchedule',
//method: 'post',
//data
//})
//}

export function addSchedule(data) {
  return request({
    url: "/testCycle/plan/save",
    method: "post",
    data,
  });
}

//获得测试用例
export function getListBytestCycle(data) {
  return request({
    url: "/testCycle/instance/listByTestCycle",
    method: "post",
    data,
  });
}

//添加运行计划
export function saveInstance(data) {
  return request({
    url: "/testCycle/instance/saveInstance",
    method: "post",
    data,
  });
}

//删除运行计划
export function deleteInstance(data) {
  return request({
    url: "/testCycle/instance/deleteInstance",
    method: "delete",
    data,
  });
}
