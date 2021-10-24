import request from '@/utils/request'

/**
 * 查询平台用户列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getQueryPlatformUser(params) {
  return request({
    url: '/platformUser/queryPlatformUser',
    method: 'post',
    data: params
  })
}

/**
 * 创建平台用户
 * @param params
 * @returns {AxiosPromise}
 */
export function createPlatformUser(params) {
  return request({
    url: '/platformUser/createPlatformUser',
    method: 'post',
    data: params
  })
}

/**
 * 编辑平台用户
 * @param params
 * @returns {AxiosPromise}
 */
export function updatePlatformUser(params) {
  return request({
    url: '/platformUser/updatePlatformUser',
    method: 'post',
    data: params
  })
}

/**
 * 删除平台用户
 * @param params
 * @returns {AxiosPromise}
 */
export function deletePlatformUser(id) {
  return request({
    url: '/platformUser/deletePlatformUser/' + id,
    method: 'delete'
  })
}
