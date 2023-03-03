import request from '@/utils/request'
// 获取自定义字段
export function getAllCustomField(params) {
  return request({
    url: '/customFields/getAllCustomList',
    method: 'get',
    params
  })
}

// 获取系统字段
export function getAllSysCustomFields(params) {
  return request({
    url: '/CustomFieldData/getAllSysCustomField',
    method: 'get',
    params
  })
}
