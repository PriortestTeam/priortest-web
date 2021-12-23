import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import common from './modules/common'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import header from './header/header'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    header,
    common
  },
  getters
})

export default store
