import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token'),
    auth: '',
    userId:0,
    branchId:0,
    companyId:0
  },
  mutations: {
    getToken (state, user) {
      state.token = localStorage.getItem('token')
      
    },
    delToken (state) {
      localStorage.removeItem('token')      
      state.token = null
      
    }
  },
  actions: {

  }
})