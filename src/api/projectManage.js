/*
 * @Author: your name
 * @Date: 2021-01-06 16:38:28
 * @LastEditTime: 2022-06-05 11:01:12
 * @LastEditors: Mic
 * @Description: In User Settings Edit
 * @FilePath: \oneclick-web\src\api\project.js
 */
import request from '@/utils/request'

export function projectList (params, data) {
  return request({
    url: '/projectManage/listAll',
    method: 'post',
    // post拼接路由参数
    params: params,
    data: data
  })
}


// 添加项目
export function projectSave(params, data) {
  return request({
    url: '/projectManage/saveProject',
    method: 'post',
    data: params
  })
}


// clone 记录
export function cloneProject(data) {
  return request({
    url: '/projectManage/clone',
    method: 'post',
    data: data
  })
}


// 删除项目
export function delProject (id) {
  return request({
    url: '/projectManage/deleteProject/' + id,
    method: 'delete'
  })
}


// 修改项目
export function projectUpdate (params) {
  return request({
    url: '/projectManage/updateProject',
    method: 'put',
    data: params
  })
}

// 获取详情
export function projectInfo(params) {
  return request({
    url: '/projectManage/info/' + params.id,
    method: 'get'
  })
}






