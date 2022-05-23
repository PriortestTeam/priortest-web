import request from '@/utils/request'
// 获取用户功能权限
export function findRoleFunction (params) {
  return request({
    url: '/function/findRoleFunction',
    method: 'get',
    params
  })
}

// 新增或修改用户权限
export function saveRoleFunction (data) {
  return request({
    url: '/function/saveRoleFunction',
    method: 'post',
    data
  })
}
