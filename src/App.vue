<script setup>
import { RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
</script>

<template>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
    integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
    crossorigin="anonymous"
  />

  <Navbar />

  <div>
    <RouterView></RouterView>
  </div>
</template>

<style scoped>
#kanan {
  position: fixed;
  padding-top: 8px;
  padding-right: 5px;
  top: 0;
  right: 0;
}
</style>
