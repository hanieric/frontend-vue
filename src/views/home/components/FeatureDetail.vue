<template>
  <div
    class="bg-white rounded-xl shadow-lg p-8 border-l-4 hover:shadow-xl transition-shadow duration-300 hover:scale-105 transform animate-fade-in"
    :class="`border-${color}-500`"
  >
    <div class="flex items-center mb-4">
      <div class="p-3 rounded-full mr-4" :class="`bg-${color}-100`">
        <component
          v-if="icon"
          :is="icon"
          :class="`text-${color}-600`"
          class="w-5 h-5"
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
export default {
  name: "FeatureDetail",
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: [Object, Function],
    },
    color: {
      type: String,
      default: "blue",
    },
  },
};
</script>
