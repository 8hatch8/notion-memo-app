import { createRouter, createWebHistory } from "vue-router";
import Main from "@/components/MainPage.vue";

const routes = [
  {
    path: "/",
    name: "Main",
    component: Main,
  },
];

// Vue-Routerの設定
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
