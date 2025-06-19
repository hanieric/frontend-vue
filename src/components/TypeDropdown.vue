<template>
  <div class="flex items-center relative">
    <label
      for="inputTipe"
      class="block text-gray-700 font-semibold mr-4 flex-1"
    >
      Tipe
    </label>
    <div class="flex-2 relative w-full" id="inputTipe">
      <button
        type="button"
        @click="showTipeMenu = !showTipeMenu"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-400 transition flex items-center justify-between"
      >
        <span>
          {{ modelValue === "pemasukan" ? "Pemasukan" : "Pengeluaran" }}
        </span>
        <ChevronDownIcon
          class="h-5 w-5 text-gray-500 ml-2 animate-transform transition-transform duration-200"
          :class="{ 'rotate-180': showTipeMenu }"
        />
      </button>
      <div
        v-if="showTipeMenu"
        class="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10"
      >
        <div
          tabindex="0"
          id="pengeluaran"
          @click="selectTipe('pengeluaran')"
          @keydown.enter.prevent="selectTipe('pengeluaran')"
          class="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-t-lg focus:bg-blue-200 outline-none"
          :class="{
            'bg-blue-50 font-semibold': modelValue === 'pengeluaran',
          }"
        >
          Pengeluaran
        </div>
        <div
          tabindex="0"
          id="pemasukan"
          @click="selectTipe('pemasukan')"
          @keydown.enter.prevent="selectTipe('pemasukan')"
          class="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-b-lg focus:bg-blue-200 outline-none"
          :class="{
            'bg-blue-50 font-semibold': modelValue === 'pemasukan',
          }"
        >
          Pemasukan
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";
import { nextTick } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "pemasukan",
  },
});

const emit = defineEmits(["update:modelValue"]);

const showTipeMenu = ref(false);
const selectTipe = (tipe) => {
  emit("update:modelValue", tipe);
  showTipeMenu.value = false;
};

onMounted(() => {
  document.addEventListener("click", (e) => {
    const tipeMenu = document.getElementById("inputTipe");
    if (showTipeMenu.value && tipeMenu && !tipeMenu.contains(e.target)) {
      showTipeMenu.value = false;
    }
  });
});

watch(showTipeMenu, async (val) => {
  if (val) {
    await nextTick();
    // Focus the first menu item when popup opens
    const firstMenuItem = document.getElementById(props.modelValue);

    if (firstMenuItem) {
      firstMenuItem.focus();
    }
  }
});
</script>
