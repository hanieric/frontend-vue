<template>
  <RouterLink
    :to="to"
    :class="`block px-3 py-2 rounded-md font-medium transition`"
  >
    <slot />
  </RouterLink>
</template>

<script setup>
import { RouterLink } from "vue-router";

const props = defineProps({
  to: {
    type: [String, Object],
    required: true,
  },
});
</script>
