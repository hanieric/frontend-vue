<template>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
    integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
    crossorigin="anonymous"
  />

  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">HANIERICK</a>
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

    <div
      v-if="
        currentRoute === 'http://localhost:5173/' ||
        currentRoute === 'http://localhost:5173/login' ||
        currentRoute === 'http://localhost:5173/register'
      "
    >
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
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

    <div
      v-else-if="
        currentRoute === 'http://localhost:5173/dashboard' ||
        currentRoute === 'http://localhost:5173/dashboard/save' ||
        currentRoute === 'http://localhost:5173/dashboard/show' ||
        currentRoute === 'http://localhost:5173/dashboard/erase' ||
        currentRoute === 'http://localhost:5173/dashboard/chat' ||
        currentRoute === 'http://localhost:5173/dashboard/logout'
      "
    >
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <a class="nav-link" href="#">
              <RouterLink to="/dashboard/save">SAVE</RouterLink>
              <span class="sr-only">(current)</span></a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              <RouterLink to="/dashboard/show">SHOW</RouterLink>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              <RouterLink to="/dashboard/erase">ERASE</RouterLink>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              <RouterLink to="/dashboard/chat">LIVE CHAT CONSULE</RouterLink>
            </a>
          </li>
          <li class="nav-item" id="kanan">
            <a class="nav-link" href="#">
              <RouterLink to="/dashboard/logout">lOGOUT</RouterLink>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <div>
    <RouterView></RouterView>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const currentRoute = ref(window.location.href);

watch(() => {
  currentRoute.value = window.location.href;
});
</script>

<style scoped>
#kanan {
  position: fixed;
  padding-top: 8px;
  padding-right: 5px;
  top: 0;
  right: 0;
}
</style>
