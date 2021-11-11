import Vue from 'vue';
import VueRouter from 'vue-router';

const Home = () => import('../views/Home.vue');
const Attraction = () => import('../views/Attraction.vue');

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path:'/attraction',
    name:'Attraction',
    component:Attraction
  }
];

const router = new VueRouter({
  mode: 'history',
  routes,
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
})

export default router
