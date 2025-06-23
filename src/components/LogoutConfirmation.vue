<template>
  <VueFinalModal
    v-model="show"
    :click-to-close="true"
    :esc-to-close="true"
    class="fixed inset-0 flex items-center justify-center z-50 bg-black/40"
    overlay-transition="vfm-fade"
  >
    <div
      id="logout-confirmation-modal"
      class="text-center bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative"
    >
      <h2 class="text-2xl font-semibold mb-6">Confirm Logout</h2>
      <p class="mb-12 text-gray-600">Are you sure you want to log out?</p>
      <div class="flex justify-center gap-6">
        <button
          class="px-6 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 cursor-pointer"
          @click="cancel"
        >
          Cancel
        </button>
        <button
          class="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
          @click="confirm"
        >
          Logout
        </button>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup>
  import { ref, watch } from "vue";
  import { VueFinalModal } from "vue-final-modal";

  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
  });

  const emit = defineEmits(["update:modelValue", "confirm"]);

  const show = ref(props.modelValue);

  watch(
    () => props.modelValue,
    (val) => {
      show.value = val;
    }
  );

  watch(show, (val) => {
    emit("update:modelValue", val);
  });

  function cancel() {
    show.value = false;
  }

  function confirm() {
    emit("confirm");
    show.value = false;
  }
</script>
