<template>
  <div
    class="h-full overflow-y-auto px-4 pr-6"
    ref="scrollContainer"
    @scroll="onScroll"
  >
    <ul>
      <li v-if="isLoading" class="mx-auto my-2 h-8 w-8 mb-6">
        <LoadingIndicator />
      </li>
      <li
        v-for="(msg, index) in messages"
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
  import LoadingIndicator from "./LoadingIndicator.vue";
  import { ref, nextTick, onMounted, watch } from "vue";

  const props = defineProps({
    messages: {
      type: Array,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  });

  watch(
    () => props.messages,
    async (_) => {
      // If new messages are added, adjust the scroll position
      await nextTick();
      const el = scrollContainer.value;
      if (el) {
        adjustScrollPosition(el);
      }
    },
    { immediate: true, deep: true }
  );

  const scrollContainer = ref(null);

  const emit = defineEmits(["loadMore"]);

  let previousScrollHeight = 0;
  function onScroll() {
    const el = scrollContainer.value;
    if (!el) return;
    previousScrollHeight = el.scrollHeight;
    if (el.scrollTop === 0 && props.isLoading === false) {
      emit("loadMore");
    }
  }

  const adjustScrollPosition = async (el) => {
    const newScrollHeight = el.scrollHeight;
    const scrollDiff = newScrollHeight - previousScrollHeight;

    el.scrollTop = el.scrollTop + scrollDiff;
  };
</script>
