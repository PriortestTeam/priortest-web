/*
 * @Author: your name
 * @Date: 2020-12-12 19:56:48
 * @LastEditTime: 2021-02-19 15:05:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \oneclick-web\src\api\user.js
 */
import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'login',
    method: 'post',
    data: data
  })
}

export function getInfo() {
  return request({
    url: '/user/queryUserInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}
// 发送邮箱验证
export function sendEmailRegisterCode(email) {
  return request({
    url: '/user/sendEmailRegisterCode?email=' + email,
    method: 'get'
  })
}
// 注册
export function userRegiste(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}
// 激活账户
export function activateAccount(data) {
  return request({
    url: '/user/activateAccount',
    method: 'post',
    data
  })
}
// 忘记密码填写邮箱
export function sendForgetEmail(params) {
  return request({
    url: '/user/forgetThePassword',
    method: 'post',
    params
  })
}
// 忘记密码重置密码
export function resetPwd(data) {
  return request({
    url: '/user/forgetThePasswordIn',
    method: 'post',
    data
  })
}
// 申请延期填写邮箱
export function senddeferredEmail(params) {
  return request({
    url: '/user/applyForAnExtension',
    method: 'post',
    params
  })
}
// 申请延期填写密码
export function deferredPwd(data) {
  return request({
    url: '/user/applyForAnExtensionIn',
    method: 'post',
    data
  })
}
// 验证链接字符串
export function verifyLinkString(params) {
  return request({
    url: '/user/verifyLinkString',
    method: 'post',
    params
  })
}
// 生成token
export function makeToken(data) {
  return request({
    url: '/user/makeToken',
    method: 'post',
    data
  })
}
export function listTokens(params, data) {
  return request({
    url: '/user/listTokens',
    method: 'post',
    // post拼接路由参数
    params: params,
    data: data
  })
}
// 删除token
export function deleteToken(data) {
  return request({
    url: '/user/deleteToken',
    // method: 'delete'
    method: 'post',
    params: data
  })
}
// 返回用户的激活次数
export function getUserActivNumber(data) {
  return request({
    url: '/user/getUserActivNumber',
    method: 'post',
    params: data
  })
}
