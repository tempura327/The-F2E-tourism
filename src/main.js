import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Vuex from 'vuex';
import {BootstrapVue,LayoutPlugin} from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap-reboot.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue);
Vue.use(LayoutPlugin);
Vue.use(router);
Vue.use(Vuex);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')