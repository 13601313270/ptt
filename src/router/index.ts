import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/home.vue';
import List from '../views/list.vue';// 文章列表


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/list',
    name: 'list',
    component: List,
  },
  
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
