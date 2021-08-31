import Vue from 'vue'

/**
 * 自定义指令，只允许输入大写英文以及数字
 */
Vue.directive('Alphabet', {
  inserted: function(el) {
    const input = el.querySelector('input')
    input.onkeyup = function(e) {
      input.value = input.value.replace(/[^A-Z]/g, '')
    }
    input.onblur = function(e) {
      input.value = input.value.replace(/[^A-Z]/g, '')
    }
  }
})
