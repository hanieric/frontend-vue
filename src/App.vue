<script setup>
import { RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
</script>

<template>
  <div
    class="flex flex-col min-h-screen h-full"
    style="background: linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)"
  >
    <Navbar />
    <div class="flex-1 mx-auto w-screen flex justify-center">
      <RouterView></RouterView>
    </div>
  </div>
</template>
