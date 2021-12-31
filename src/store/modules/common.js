const state = {
  nvaName: '',
  servicePlan: null
}

const mutations = {
  setNavName(state, payload) {
    state.nvaName = payload
  },
  setServicePlan(state, payload) {
    state.servicePlan = payload
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
