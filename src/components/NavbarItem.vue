<template>
  <RouterLink
    :to="to"
    :class="`block px-3 py-2 rounded-md font-medium transition ${isActive(
      to
    )} flex items-center gap-2`"
  >
    <component v-if="icon" :is="icon" class="w-5 h-5 inline-block" />
    <span :class="isMobile ? ' ' : 'hidden lg:inline'">{{ label }}</span>
  </RouterLink>
</template>

<script setup>
import { useRoute } from "vue-router";

const props = defineProps({
  to: {
    type: [String, Object],
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: [Object, Function, String],
    default: null,
  },
  isMobile: {
    type: Boolean,
    default: false,
  },
});

const classNames = {
  active: "text-blue-600 font-bold border-b-2 border-blue-600",
  inactive: "text-gray-700 hover:text-blue-600",
};

const route = useRoute();

function isActive(path) {
  return route.path === (typeof path === "string" ? path : path.path)
    ? classNames.active
    : classNames.inactive;
}
</script>
