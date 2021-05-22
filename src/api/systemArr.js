import request from '@/utils/request'

export function sysCustomField(params) {
  return request({
    url: '/sysCustomField/getSysCustomField',
    method: 'get',
    // post拼接路由参数
    params: params,
  })
}