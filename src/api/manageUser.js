import request from '@/utils/request'

/**
 * 查询平台用户列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getQueryPlatformUser(params) {
  return request({
    url: '/platformUser/createPlatformUser',
    method: 'post',
    data: params
  })
}
