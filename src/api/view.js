/*
 * @Date: 2022-06-04 19:17:46
 * @Author: Mic
 * @LastEditors: Mic
 * @LastEditTime: 2022-06-04 19:18:54
 */
import request from '@/utils/request'

export function getQueryViewParents (params) {
  return request({
    url: '/view/queryViewParents',
    method: 'get',
    params
  })
}
