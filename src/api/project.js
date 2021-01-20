/*
 * @Author: your name
 * @Date: 2021-01-06 16:38:28
 * @LastEditTime: 2021-01-14 13:34:42
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \oneclick-web\src\api\project.js
 */
import request from '@/utils/request'

export function queryForProjects(data) {
  return request({
    url: '/project/queryForProjects',
    method: 'post',
    // post拼接路由参数
    params: data,
    data: {}
  })
}
// 添加项目
export function addProjects(data) {
  return request({
    url: '/project/addProject',
    method: 'post',
    data
  })
}
// 删除项目
export function delProjects(data) {
  return request({
    url: '/project/deleteProject/' + data,
    method: 'delete'
  })
}

// 修改项目
export function editProjects(data) {
  return request({
    url: '/project/updateProject',
    method: 'post',
    data
  })
}
// 项目view
