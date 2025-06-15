import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Dashboard from "../views/Dashboard.vue";
import HistoryPage from "../views/HistoryPage.vue";
import ConsolePage from "../views/ConsolePage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: Home },
    { path: "/register", name: "signin", component: Register },
    { path: "/login", name: "login", component: Login },
    { path: "/dashboard", name: "dashboard", component: Dashboard },
    { path: "/dashboard/history", name: "history", component: HistoryPage },
    { path: "/dashboard/console", name: "console", component: ConsolePage },
  ],
});

export default router;
