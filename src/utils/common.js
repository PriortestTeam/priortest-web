
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
export {
  formData,
  message
}
