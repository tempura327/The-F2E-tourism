import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () => import('../views/Home.vue');
// const App = () => import('../App.vue');

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/home/',
      component: Home,
      children: [

      ]
    }
  ],
  props:{
    default: true,
  },
  scrollBehavior(){
    return {
      x:0,
      y:0,
      behavior: 'smooth'
    }

  }
});            

export default router;