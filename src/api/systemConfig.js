import request from '@/utils/request'

export const systemConfigAPI = {
  // 服务计划
  getServicePlanUi () {
    return request({
      url: '/systemConfig/getAllUi',
      method: 'get'
    })
  },
  // 服务计划-订单折扣模块
  calculateOrderPrice (data) {
    return request({
      url: '/userOrderdisCount/calculateOrderPrice',
      method: 'post',
      data: data
    })
  },
  // 服务计划-新增订单
  insertOrder (data) {
    return request({
      url: '/userOrder/insertOrder',
      method: 'post',
      data: data
    })
  }
}
