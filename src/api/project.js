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

