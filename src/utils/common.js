
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

export {
  formData,
  message,
  formatChangedPara,
  returntomenu
}
