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
    url: '/login',
    method: 'post',
    data
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

