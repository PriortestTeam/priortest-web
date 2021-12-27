import request from '@/utils/request'

export const systemConfigAPI = {
// 服务计划
  getServicePlanUi() {
    return request({
      url: '/systemConfig/getAllUi',
      method: 'get'
    })
  }
}
