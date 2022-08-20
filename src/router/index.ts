import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const Home = () => import('../views/Home.vue');
const Attraction = () => import('../views/Attraction.vue');
const Activity = () => import('../views/Activity.vue');

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/attraction',
    name: 'Attraction',
    component: Attraction,
  },
  {
    path: '/activity',
    name: 'Activity',
    component: Activity,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
