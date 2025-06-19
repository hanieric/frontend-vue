<script setup>
import { RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
</script>

<template>
  <div
    class="flex flex-col w-screen max-h-screen min-h-screen"
    style="background: linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)"
  >
    <Navbar />
    <div
      class="flex-1 w-screen mx-auto flex justify-center h-full overflow-y-auto"
    >
      <RouterView></RouterView>
    </div>
  </div>
</template>
