<script setup>
import { RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
    <div class="flex-1 flex justify-center bg-gray-100 w-full">
      <RouterView></RouterView>
    </div>
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
