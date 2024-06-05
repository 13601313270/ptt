import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/home.vue';
import Login from '../views/login.vue';
import EssenceArticle from '../views/essenceArticle.vue';// 精华文章
import Class from '../views/class.vue';// 分组讨论取
import List from '../views/list.vue';// 文章列表


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
  },
  {
    path: '/essenceArticle',
    name: 'essenceArticle',
    component: EssenceArticle,
  },
  {
    path: '/class',
    name: 'class',
    component: Class,
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
