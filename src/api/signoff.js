import request from '@/utils/request'

// 获取测试环境
export function getProjectEnv(params) {
  return request({
    url: '/signOff/getProjectEnv',
    method: 'get',
    params
  })
}

// 获取发布版本
export function getProjectVersion(params) {
  return request({
    url: '/signOff/getProjectVersion',
    method: 'get',
    params
  })
}

//获取测试周期
export function getTestCycleVersion(params) {
  return request({
    url: '/signOff/getTestCycleVersion',
    method: 'get',
    params
  })
}

// 生成验收文档
export function createGenerate(data) {
  return request({
    url: '/signOff/generate',
    method: 'post',
    data
  })
}

// 上传签名
export function uploadSignature(data) {
  return request({
    url: '/signOff/upload',
    method: 'post',
    data
  })
}



