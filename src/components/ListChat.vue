<template>
  <div
    class="flex-1 overflow-y-auto mb-4 px-2 pr-6"
    ref="scrollContainer"
    @scroll="onScroll"
  >
    <ul>
      <li v-if="isLoading" class="mx-auto my-2 h-8 w-8 mb-6">
        <LoadingIndicator />
      </li>
      <li
        v-for="(msg, index) in visibleMessages"
        :key="index"
        :class="
          msg.sentByUser ? 'flex justify-end mb-2' : 'flex justify-start mb-2'
        "
      >
        <div
          :class="
            msg.sentByUser
              ? 'bg-blue-500 text-white rounded-lg px-4 py-2 max-w-xs break-words shadow'
              : 'bg-gray-200 text-gray-800 rounded-lg px-4 py-2 max-w-xs break-words shadow'
          "
        >
          <div
            v-if="msg.timestamp || (!msg.sentByUser && msg.username)"
            class="text-xs mb-1 flex items-center gap-2"
          >
            <span
              v-if="!msg.sentByUser && msg.username"
              class="font-semibold text-gray-600"
            >
              {{ msg.username }}
            </span>
            <span
              v-if="msg.timestamp"
              :class="msg.sentByUser ? 'text-gray-300' : 'text-gray-500'"
            >
              {{
                new Date(msg.timestamp).toLocaleTimeString([], {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}
            </span>
          </div>
          {{ msg.text }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
  import { ref, computed, watch } from "vue";
  import LoadingIndicator from "./LoadingIndicator.vue";

  const props = defineProps({
    messages: {
      type: Array,
      required: true,
    },
  });

  const BATCH_SIZE = 30;
  const loadedCount = ref(BATCH_SIZE);
  const isLoading = ref(false);

  const visibleMessages = computed(() =>
    props.messages.slice(-loadedCount.value)
  );

  const scrollContainer = ref(null);

  function onScroll() {
    const el = scrollContainer.value;
    if (!el) return;
    if (
      el.scrollTop === 0 &&
      loadedCount.value < props.messages.length &&
      !isLoading.value
    ) {
      isLoading.value = true;
      // Record current scroll height before loading more
      const prevScrollHeight = el.scrollHeight;

      setTimeout(() => {
        // Load more messages after delay
        loadedCount.value = Math.min(
          loadedCount.value + BATCH_SIZE,
          props.messages.length
        );
        isLoading.value = false;
        // Wait for DOM update, then adjust scrollTop to maintain position
        setTimeout(() => {
          const newScrollHeight = el.scrollHeight;
          el.scrollTop = newScrollHeight - prevScrollHeight;
        }, 0);
      }, 1000 + Math.random() * 1000); // 1-2 seconds
    }
  }

  // Reset loadedCount if messages change (e.g., new chat)
  watch(
    () => props.messages,
    () => {
      loadedCount.value = BATCH_SIZE;
    }
  );
</script>
