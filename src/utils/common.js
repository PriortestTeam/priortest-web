
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
//检验字段是否修改
function formatChangedPara(originObj, newObj) {
  const tempObj = {};
  Object.keys(originObj).forEach(item => {
    if (originObj[item] !== newObj[item]) {
      tempObj[item] = newObj[item];
    }
  });
  tempObj.id = newObj.id;
  return tempObj;
}

export {
  formData,
  message,
  formatChangedPara
}
