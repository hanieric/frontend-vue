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
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand font-bold" href="/">HANIERICK</a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div v-if="!authenticatedRoutes.includes(currentRoute)">
      <div class="" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <a class="nav-link" href="#">
              <RouterLink to="/login">LOGIN</RouterLink>
              <span class="sr-only">(current)</span></a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              <RouterLink to="/register">REGISTER</RouterLink>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div v-else-if="authenticatedRoutes.includes(currentRoute)">
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <a class="nav-link" href="#">
              <RouterLink to="/dashboard/save">ADD TRANSACTION</RouterLink>
              <span class="sr-only">(current)</span></a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              <RouterLink to="/dashboard/erase">DELETE</RouterLink>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              <RouterLink to="/dashboard/show">HISTORY</RouterLink>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              <RouterLink to="/dashboard/chat">CONSOLE CHAT</RouterLink>
            </a>
          </li>
          <li class="nav-item" id="kanan">
            <a class="nav-link" href="#">
              <RouterLink to="/dashboard/logout">LOGOUT</RouterLink>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
