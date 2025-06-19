<template>
  <div
    :class="[
      'flex flex-col items-center bg-white rounded-xl shadow-lg p-8 h-full min-h-[160px] transform hover:scale-105 transition duration-300 animate-fade-in-up',
      `border-t-4`,
      borderColor,
    ]"
  >
    <component :is="icon" :class="['h-10 w-10 mb-4', iconColor]" />
    <h2 class="text-2xl font-semibold mb-2">{{ title }}</h2>
    <p class="text-gray-600 text-center">
      {{ description }}
    </p>
  </div>
</template>

<style scoped>
@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}
</style>

<script setup>
defineProps({
  icon: {
    type: [Object, Function],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  iconColor: {
    type: String,
    default: "text-yellow-400", // Default color for the icon
  },
  borderColor: {
    type: String,
    default: "border-blue-400", // Default color for the border
  },
});
</script>
