/*
 * @Author: your name
 * @Date: 2021-01-04 13:57:22
 * @LastEditTime: 2021-02-02 16:43:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \telecom-industry-portal-gw2.0d:\project\oneclick-web\src\utils\common.js
 */

import { Message } from 'element-ui'
// data转换
function formData(obj) {
  const formData = new FormData()
  Object.keys(obj).forEach((key) => {
    formData.append(key, obj[key])
  })
  return formData
}
// 提示消息
function message(type, msg) {
  return Message({
    showClose: true,
    message: msg,
    type: type,
    duration: 2 * 1000
  })
}
// 返回上级路由
function returntomenu(that, time) {
  return setTimeout(() => {
    // console.log(this, '路由')
    that.$store.dispatch('tagsView/delView', that.$route)
    that.$router.go(-1)
  }, time)
}
// 检验字段是否修改
function formatChangedPara(originObj, newObj) {
  const tempObj = {}
  Object.keys(originObj).forEach(item => {
    if (originObj[item] !== newObj[item]) {
      tempObj[item] = newObj[item]
    }
  })
  tempObj.id = newObj.id
  return tempObj
}
// 处理自定义radio字段数据
function customradioData(data) {
  const radio = data
  for (const key in radio) {
    if (key === 'scope' || key === 'defaultValue' || key === 'mandatory') {
      radio[key] = radio[key].split(',')
      for (let i = 0; i < radio[key].length; i++) {
        if (radio[key][i] === '0') {
          radio[key][i] = false
        } else {
          radio[key][i] = true
        }
      }
    }
  }
  return radio
}

function customtextData(data) {
  const radio = data
  for (const key in radio) {
    if (key === 'scope' || key === 'mandatory') {
      radio[key] = radio[key].split(',')
      for (let i = 0; i < radio[key].length; i++) {
        if (radio[key][i] === '0') {
          radio[key][i] = false
        } else {
          radio[key][i] = true
        }
      }
    }
  }
  return radio
}
function parseTime(time, pattern) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    } else if (typeof time === 'string') {
      time = time.replace(new RegExp(/-/gm), '/');
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}
export {
  formData,
  message,
  formatChangedPara,
  returntomenu,
  customradioData,
  customtextData,
  parseTime
}
