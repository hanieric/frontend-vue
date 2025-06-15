<script setup>
import { VueFinalModal } from "vue-final-modal";
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: Boolean,
  value: Date,
});

const emit = defineEmits(["update:modelValue", "selectMonth"]);

const year = ref(new Date().getFullYear());
const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const today = new Date();

// selectedDate now stores both year and month
const selectedDate = ref(
  props.value
    ? { year: props.value.getFullYear(), month: props.value.getMonth() }
    : { year: today.getFullYear(), month: today.getMonth() }
);

const isSelectedMonth = (month) => {
  return (
    month === selectedDate.value.month && year.value === selectedDate.value.year
  );
};

const isToday = (month) => {
  return month === today.getMonth() && year.value === today.getFullYear();
};

const showMonthPicker = ref(false);

showMonthPicker.value = props.modelValue;
watch(
  () => props.modelValue,
  (newValue) => {
    showMonthPicker.value = newValue;
    if (newValue) {
      year.value = today.getFullYear();
      selectedDate.value = props.value
        ? { year: props.value.getFullYear(), month: props.value.getMonth() }
        : { year: today.getFullYear(), month: today.getMonth() };
    }
  }
);

watch(
  () => showMonthPicker.value,
  (newValue) => {
    if (!newValue) {
      emit("update:modelValue", false);
    }
  }
);

watch(
  () => props.value,
  (newValue) => {
    if (newValue) {
      year.value = newValue.getFullYear();
      selectedDate.value = {
        year: newValue.getFullYear(),
        month: newValue.getMonth(),
      };
    }
  }
);

const selectMonth = (month) => {
  selectedDate.value = { year: year.value, month };
  const selected = new Date(year.value, month, 1);
  emit("selectMonth", selected);
  emit("update:modelValue", false);
};

const prevYear = () => {
  year.value--;
};

const nextYear = () => {
  year.value++;
};

document.addEventListener("keydown", (event) => {
  if (!showMonthPicker.value) return;
  if (event.key === "ArrowLeft") {
    prevYear();
  } else if (event.key === "ArrowRight") {
    nextYear();
  }
});
</script>

<template>
  <VueFinalModal
    v-model="showMonthPicker"
    class="fixed inset-0 flex items-center justify-center z-50 bg-black/40"
  >
    <div class="p-6 bg-white rounded-lg shadow-lg w-96">
      <div class="flex items-center justify-between mb-8">
        <button
          @click="prevYear"
          class="px-3 py-1 rounded hover:bg-gray-100 transition"
        >
          &lt;
        </button>
        <input
          v-model="year"
          type="number"
          class="text-xl font-semibold w-24 text-center py-1 focus:outline-none focus:border-b focus:border-blue-500"
          min="1900"
          max="2100"
        />
        <button
          @click="nextYear"
          class="px-3 py-1 rounded hover:bg-gray-100 transition"
        >
          &gt;
        </button>
      </div>
      <div class="grid grid-cols-3 gap-4">
        <button
          v-for="(name, idx) in monthNames"
          :key="idx"
          class="py-2 rounded transition font-medium"
          :class="{
            'bg-blue-400 text-white': isSelectedMonth(idx),
            'bg-blue-100 text-blue-900': isToday(idx),
            'hover:bg-blue-100': !isSelectedMonth(idx),
          }"
          @click="selectMonth(idx)"
        >
          {{ name }}
        </button>
      </div>
    </div>
  </VueFinalModal>
</template>
