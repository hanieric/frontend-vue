<template>
  <div
    class="bg-white rounded-xl shadow-lg p-8 border-l-4 hover:shadow-xl transition-shadow duration-300 hover:scale-105 transform animate-fade-in"
    :class="colorClasses.border"
  >
    <div class="flex items-center mb-4">
      <div class="p-3 rounded-full mr-4" :class="colorClasses.bg">
        <component
          v-if="icon"
          :is="icon"
          :class="['w-5 h-5', colorClasses.text]"
        />
      </div>
      <h3 class="text-xl font-bold text-gray-800">{{ title }}</h3>
    </div>
    <p class="text-gray-600 leading-relaxed">
      {{ description }}
    </p>
  </div>
</template>

<script>
const COLOR_MAP = {
  blue: { border: "border-blue-500", bg: "bg-blue-100", text: "text-blue-600" },
  red: { border: "border-red-500", bg: "bg-red-100", text: "text-red-600" },
  green: {
    border: "border-green-500",
    bg: "bg-green-100",
    text: "text-green-600",
  },
  yellow: {
    border: "border-yellow-500",
    bg: "bg-yellow-100",
    text: "text-yellow-600",
  },
  purple: {
    border: "border-purple-500",
    bg: "bg-purple-100",
    text: "text-purple-600",
  },
  pink: { border: "border-pink-500", bg: "bg-pink-100", text: "text-pink-600" },
  indigo: {
    border: "border-indigo-500",
    bg: "bg-indigo-100",
    text: "text-indigo-600",
  },
  gray: { border: "border-gray-500", bg: "bg-gray-100", text: "text-gray-600" },
  teal: { border: "border-teal-500", bg: "bg-teal-100", text: "text-teal-600" },
  orange: {
    border: "border-orange-500",
    bg: "bg-orange-100",
    text: "text-orange-600",
  },
};

export default {
  name: "FeatureDetail",
  props: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: [Object, Function] },
    color: { type: String, default: "blue" },
  },
  computed: {
    colorClasses() {
      return COLOR_MAP[this.color] || COLOR_MAP.blue;
    },
  },
};
</script>
