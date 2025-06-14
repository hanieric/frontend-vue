<script setup>
import { RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
</script>

<template>
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
