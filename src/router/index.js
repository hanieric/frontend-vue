import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Dashboard from "../views/Dashboard.vue";
import Save from "../views/Save.vue";
import Show from "../views/Show.vue";
import Erase from "../views/Erase.vue";
import Logout from "../views/Logout.vue";
import Chat from "../views/Chat.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: Home },
    { path: "/register", name: "signin", component: Register },
    { path: "/login", name: "login", component: Login },
    { path: "/dashboard", name: "dashboard", component: Dashboard },
    { path: "/dashboard/save", name: "save", component: Save },
    { path: "/dashboard/show", name: "show", component: Show },
    { path: "/dashboard/erase", name: "erase", component: Erase },
    { path: "/dashboard/logout", name: "logout", component: Logout },
    { path: "/dashboard/chat", name: "chat", component: Chat },
  ],
});

export default router;
