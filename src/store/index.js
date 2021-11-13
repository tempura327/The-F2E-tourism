import Vue from 'vue'
import Vuex from 'vuex'
// import Vuex, { Store } from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    attraction:[],
    activiry:[],
  },
  mutations: {
    setAttractionData(state, data){
      state.attraction = data;
    },
    setActivityData(state, data){
      state.activiry = data;
    },
  },
  actions: {
  },
  modules: {
  }
})

export default store