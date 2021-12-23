const state = {
  nvaName: ''
}

const mutations = {
  setNavName(state, payload) {
    state.nvaName = payload
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
