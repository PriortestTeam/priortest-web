export default {
  state: {
    lang: '中文'
  },
  mutations: {
    // 刷新页面之后存进来的值
    changeLang(state, val) {
      if (val === 'zh-CN') state.lang = '中文'
      if (val === 'en-US') state.lang = 'EngLish'
    }
  },
  actions: {
    // 刷新页面之后存进来的值
    changeLang(state, val) {
      if (val === 'zh-CN') state.lang = '中文'
      if (val === 'en-US') state.lang = 'EngLish'
    }
  }
}

