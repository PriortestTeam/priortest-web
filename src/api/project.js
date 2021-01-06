import request from '@/utils/request'

export function queryForProjects(data) {
  return request({
    url: '/project/queryForProjects',
    method: 'post',
    data
  })
}
