import Vue from 'vue'
import App from './App.vue'
// import router from './router/index';
import Vuex from 'vuex'
import {BootstrapVue} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap-reboot.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// import {BootstrapVue,LayoutPlugin} from 'bootstrap-vue'

Vue.use(BootstrapVue);
// Vue.use(router);
Vue.use(Vuex);

Vue.config.productionTip = false;

new Vue({
  // router,
  render: h => h(App),
}).$mount('#app')