import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import {BootstrapVue} from 'bootstrap-vue'

Vue.use(BootstrapVue);
Vue.use(VueRouter);
Vue.use(Vuex);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
