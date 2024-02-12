import request from '@/utils/request'

// queryForProjects
export function getProjectListByUser(){
 return request({
    url: '/signOff/getProjectListByUser',
    method: 'get'
   })
}

// 获取测试环境
export function getProjectEnv (params) {
  return request({
    url: '/signOff/getProjectEnv',
    method: 'get',
    params
  })
}

// 获取缺陷
export function getIssueList () {
  return request({
    url: '/signOff/getIssue',
    method: 'get'

  })
}


// 获取发布版本
export function getProjectVersion (params) {
  return request({
    url: '/signOff/getProjectVersion',
    method: 'get',
    params
  })
}

// 获取测试周期
export function getTestCycleTitle (params) {
  return request({
    url: '/signOff/getTestCycleDetail',
    method: 'get',
    params
  })
}

// 生成验收文档
export function createGenerate (data) {
  return request({
    url: '/signOff/generate',
    method: 'post',
    data
  })
}

// 上传签名
export function uploadSignature (data) {
  return request({
    url: '/signOff/upload',
    method: 'post',
    data
  })
}

// 获取签名文件路径
export function getSignaturePath () {
  return request({
    url: '/signOff/getUserAttachmentSign',
    method: 'get'
  })
}


// 获取签收记录
export function getRecord () {
  return request({
    url: '/signOff/getPdf',
    method: 'get'
  })
}

// 删除签名
export function deleteSign (params) {
  return request({
    url: '/signOff/delete',
    method: 'get',
    params
  })
}
