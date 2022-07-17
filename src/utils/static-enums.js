import Vue from 'vue'

export function getBoolean() {
  return[
    {value:0,label:'否'},
    {value:1,label:'是'},
  ]
}

// Vue.prototype.$staticEnums={
//   getBoolean:getBoolean()
// }
