import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
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
