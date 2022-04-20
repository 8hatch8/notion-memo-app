import { createRouter, createWebHistory } from "vue-router";
import Main from "@/components/MainPage.vue";
import Binding from "@/components/study/BindingPage.vue";
import Directive from "@/components/study/DirectivePage.vue";
import Event from "@/components/study/EventPage.vue";

const routes = [
  {
    path: "/main",
    name: "Main",
    component: Main,
  },
  {
    path: "/study/binding",
    name: "binding",
    component: Binding,
  },
  {
    path: "/study/directive",
    name: "directive",
    component: Directive,
  },
  {
    path: "/study/event",
    name: "event",
    component: Event,
  },
];

// Vue-Routerの設定
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
