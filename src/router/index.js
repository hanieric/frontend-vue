import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/HomePage.vue";
import Login from "../views/LoginPage.vue";
import Register from "../views/RegisterPage.vue";
import Dashboard from "../views/DashboardPage.vue";
import HistoryPage from "../views/HistoryPage.vue";
import ConsolePage from "../views/ConsolePage.vue";
import { useAuthStore } from "@/store/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Unauthenticated routes
    { path: "/", name: "home", component: Home, meta: { title: "Home" } },
    {
      path: "/register",
      name: "register",
      component: Register,
      meta: { title: "Register" },
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: { title: "Login" },
    },

    // Authenticated routes
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
      meta: { title: "Dashboard" },
    },
    {
      path: "/dashboard/history",
      name: "history",
      component: HistoryPage,
      meta: { title: "History" },
    },
    {
      path: "/dashboard/console",
      name: "console",
      component: ConsolePage,
      meta: { title: "Console" },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authstore = useAuthStore();
  // Check if the user is authenticated
  const isAuthenticated = authstore.isAuthenticated;

  const publicPages = ["/", "/register", "/login"];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && !isAuthenticated) {
    // Redirect to login if trying to access a protected route
    next({ name: "login" });
  }

  if (!authRequired && isAuthenticated) {
    // Redirect to dashboard if already authenticated and trying to access public pages
    next({ name: "dashboard" });
  }

  next();
});

router.afterEach((to) => {
  document.title = `HANIERICK | ${to.meta.title || "Home"}`;
});

export default router;
