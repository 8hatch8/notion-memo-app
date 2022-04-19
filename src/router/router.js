import { createRouter, createWebHistory } from "vue-router";

const routes = [];

// Vue-Routerの設定
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
