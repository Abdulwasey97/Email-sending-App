import { createRouter, createWebHistory } from "vue-router";
import SendEmail from "../views/SendEmail.vue";
import VerifyEmail from "../views/VerifyEmail.vue";

const routes = [
  {
    path: "/",
    redirect: "/send",
  },
  {
    path: "/send",
    name: "SendEmail",
    component: SendEmail,
  },
  {
    path: "/verify",
    name: "VerifyEmail",
    component: VerifyEmail,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
