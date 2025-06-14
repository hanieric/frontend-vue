<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

console.log("Navbar component loaded");

const currentRoute = ref("");
const route = useRoute();

console.log("Current route:", route.fullPath);
currentRoute.value = route.fullPath;

watch(
  () => route.fullPath,
  (newPath) => {
    currentRoute.value = newPath;
    console.log("Current route changed to:", newPath);
  }
);

const authenticatedRoutes = [
  "/dashboard",
  "/dashboard/save",
  "/dashboard/show",
  "/dashboard/erase",
  "/dashboard/chat",
  "/dashboard/logout",
];

const showMenu = ref(false);

const classNames = {
  active: "text-blue-600 font-bold border-b-2 border-blue-600",
  inactive: "text-gray-700 hover:text-blue-600",
};

function isActive(route) {
  return currentRoute.value === route ? classNames.active : classNames.inactive;
}

function isAuthenticated() {
  return authenticatedRoutes.includes(currentRoute.value);
}
</script>

<template>
  <div class="bg-white border-b border-gray-200 shadow-md">
    <nav
      class="flex flex-wrap items-center justify-between px-2 py-2 md:px-6 md:py-4 mx-auto max-w-7xl w-full"
    >
      <div class="flex items-center space-x-4">
        <a class="text-2xl font-bold text-blue-600 tracking-wide" href="/"
          >HANIERICK</a
        >
      </div>
      <div class="relative md:hidden">
        <button
          class="md:hidden text-gray-700 focus:outline-none hover:bg-blue-50 hover:text-blue-700 p-2 rounded-md"
          type="button"
          aria-label="Toggle navigation"
          @click="showMenu = !showMenu"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div
          v-if="showMenu"
          class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-2"
        >
          <ul class="py-1">
            <template v-if="!isAuthenticated()">
              <li>
                <RouterLink
                  to="/login"
                  :class="`block px-4 py-2 ${isActive('/login')}`"
                  @click="showMenu = false"
                  >LOGIN</RouterLink
                >
              </li>
              <li>
                <RouterLink
                  to="/register"
                  :class="`block px-4 py-2 ${isActive('/register')}`"
                  @click="showMenu = false"
                  >REGISTER</RouterLink
                >
              </li>
            </template>
            <template v-else>
              <li>
                <RouterLink
                  to="/dashboard/save"
                  :class="`block px-4 py-2 ${isActive('/dashboard/save')}`"
                  @click="showMenu = false"
                  >ADD TRANSACTION</RouterLink
                >
              </li>
              <li>
                <RouterLink
                  to="/dashboard/erase"
                  :class="`block px-4 py-2 ${isActive('/dashboard/erase')}`"
                  @click="showMenu = false"
                  >DELETE</RouterLink
                >
              </li>
              <li>
                <RouterLink
                  to="/dashboard/show"
                  :class="`block px-4 py-2 ${isActive('/dashboard/show')}`"
                  @click="showMenu = false"
                  >HISTORY</RouterLink
                >
              </li>
              <li>
                <RouterLink
                  to="/dashboard/chat"
                  :class="`block px-4 py-2 ${isActive('/dashboard/chat')}`"
                  @click="showMenu = false"
                  >CONSOLE CHAT</RouterLink
                >
              </li>
              <li>
                <RouterLink
                  to="/dashboard/logout"
                  :class="`block px-4 py-2 text-red-600 hover:bg-red-100 hover:text-red-700 ${isActive(
                    '/dashboard/logout'
                  )}`"
                  @click="showMenu = false"
                  >LOGOUT</RouterLink
                >
              </li>
            </template>
          </ul>
        </div>
      </div>
      <div
        class="mt-3 md:mt-0 w-full md:flex md:items-center md:w-auto hidden"
        id="navbarSupportedContent"
      >
        <ul
          class="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0"
        >
          <template v-if="!isAuthenticated()">
            <li>
              <RouterLink
                to="/login"
                :class="`block px-3 py-2 rounded-md font-medium transition ${isActive(
                  '/login'
                )}`"
                >LOGIN</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/register"
                :class="`block px-3 py-2 rounded-md font-medium transition ${isActive(
                  '/register'
                )}`"
                >REGISTER</RouterLink
              >
            </li>
          </template>
          <template v-else>
            <li>
              <RouterLink
                to="/dashboard/save"
                :class="`block px-3 py-2 rounded-md font-medium transition ${isActive(
                  '/dashboard/save'
                )}`"
                >ADD TRANSACTION</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/dashboard/erase"
                :class="`block px-3 py-2 rounded-md font-medium transition ${isActive(
                  '/dashboard/erase'
                )}`"
                >DELETE</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/dashboard/show"
                :class="`block px-3 py-2 rounded-md font-medium transition ${isActive(
                  '/dashboard/show'
                )}`"
                >HISTORY</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/dashboard/chat"
                :class="`block px-3 py-2 rounded-md font-medium transition ${isActive(
                  '/dashboard/chat'
                )}`"
                >CONSOLE CHAT</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/dashboard/logout"
                :class="`block px-3 py-2 rounded-md font-medium transition text-red-600 hover:bg-red-100 hover:text-red-700 ${isActive(
                  '/dashboard/logout'
                )}`"
                >LOGOUT</RouterLink
              >
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </div>
</template>
