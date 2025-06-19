<script setup>
import { ref, onMounted, nextTick, onUnmounted } from "vue";
import io from "socket.io-client";
import {
  ChatBubbleOvalLeftIcon,
  PaperAirplaneIcon,
} from "@heroicons/vue/24/outline";
import { useAuthStore } from "@/store/auth";
import axiosInstance from "@/lib/axios_instance";
import { useToast } from "vue-toastification";
import ListChat from "@/components/ListChat.vue";
import useLoading from "@/hooks/use_loading";

const store = useAuthStore();
const toast = useToast();
const { isLoading, setLoad } = useLoading();

const onlineState = ref(false);

const username = ref(store.user ? store.user.username : "Guest");

const message = ref("");
const messages = ref([]);
let socket;

const fetchChatHistory = async () => {
  if (isLoading.value) return; // Prevent multiple fetches

  if (messages.value.length > 0) {
    for (const lastMessage of messages.value) {
      if (lastMessage.id == 1) return;

      if (new Date() - new Date(lastMessage.timestamp) >= 24 * 60 * 60 * 1000)
        return;
    }
  }
  setLoad(true);
  try {
    const response = await axiosInstance.get("/chat", {
      params: {
        lastId: messages.value.length > 0 ? messages.value[0].id : null,
        count: 20,
      },
    });

    const parsedMessage = response.data.map((chat) => ({
      id: chat.chat_id,
      text: chat.message,
      sentByUser: store.user.userId === chat["user_id"],
      username: chat.username,
      timestamp: chat.timestamp,
    }));

    const newArray = [...parsedMessage, ...messages.value];
    newArray.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    messages.value = newArray;

    setLoad(false);
  } catch (error) {
    setLoad(false);
    toast.error("Failed to fetch chat history. Please try again later.");
    console.error("Error fetching chat history:", error);
  }
};

const connectSocket = () => {
  socket = io(import.meta.env.VITE_WEBSOCKET_URL, {
    transports: ["websocket"],
    auth: {
      token: store.token,
    },
  });

  socket.on("connect", () => {
    console.log("Connected to WebSocket server");
    onlineState.value = true;
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from WebSocket server");
    onlineState.value = false;
  });

  socket.on("message", (msg) => {
    messages.value.push({
      text: msg.text,
      sentByUser: store.user.userId === msg["user_id"],
      username: msg.username || "Unknown",
      timestamp: msg.timestamp,
    });

    toast.clear("sending-message");
    scrollDown();
  });
};

const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

const sendMessage = () => {
  if (message.value.trim() === "") return;

  const msg = {
    text: message.value,
    sentByUser: true,
    timestamp: new Date().toISOString(),
  };

  toast.info("Sending message...", {
    id: "sending-message",
  });

  if (!socket || !socket.connected) {
    console.error("Socket is not connected");
    toast.error("Cannot send message, please check your connection.");
    onlineState.value = false;

    return;
  }

  socket.emit("message", msg);

  message.value = ""; // Clear the input field

  scrollDown();

  focusInput();
};

const scrollDown = async () => {
  // Scrolls the chat container to the bottom
  await nextTick();
  const chatContainer = document.querySelectorAll("#chat-container");
  chatContainer.forEach((container) => {
    container.scrollTop = container.scrollHeight;
  });
  focusInput();
};

const focusInput = () => {
  // Focuses the input field when the component is mounted
  const messageInputs = document.querySelectorAll("#message-input");
  messageInputs.forEach((input) => input.focus());
};

onMounted(() => {
  connectSocket();
  fetchChatHistory();
});

onUnmounted(() => {
  disconnectSocket();
});
</script>

<template>
  <!-- Mobile chat UI (visible on small screens only) -->
  <div class="w-screen flex flex-col md:hidden">
    <div
      class="flex items-center px-4 py-4 bg-white z-10 shadow-md border-b border-gray-200"
    >
      <span
        class="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-500 text-white font-bold mr-3"
      >
        {{ username ? username.charAt(0).toUpperCase() : "?" }}
      </span>
      <div>
        <h2 class="text-lg font-semibold text-gray-800">Console Chat</h2>
        <p class="text-xs text-gray-500">
          <span>
            <ChatBubbleOvalLeftIcon class="w-4 h-4 inline-block mr-1" />
          </span>
          chat as {{ username }}!
        </p>
      </div>
      <span
        class="ml-auto flex items-center text-xs"
        :class="onlineState ? 'text-green-500' : 'text-red-500'"
      >
        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 8 8">
          <circle cx="4" cy="4" r="4" />
        </svg>
        {{ onlineState ? "Online" : "Offline" }}
      </span>
    </div>

    <ListChat
      id="chat-container"
      :messages="messages"
      class="bg-white/80 py-4 pl-4"
      @loadMore="fetchChatHistory"
      :isLoading="isLoading"
    />

    <form
      class="flex gap-2 px-4 w-screen bg-white py-4 border-t border-gray-200"
      @submit.prevent="sendMessage"
      autocomplete="off"
    >
      <input
        id="message-input"
        v-model="message"
        type="text"
        placeholder="Type a message..."
        class="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
        maxlength="200"
      />
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
        :disabled="!message.trim()"
      >
        <PaperAirplaneIcon class="w-5 h-5" />
      </button>
    </form>
  </div>

  <!-- Desktop chat UI (visible on medium screens and up) -->
  <div class="hidden md:flex flex-col w-full max-w-screen items-center">
    <div
      class="mt-8 max-w-xl w-full bg-white rounded-xl shadow-lg hidden md:flex flex-col h-[80vh]"
    >
      <div
        class="flex items-center px-6 py-4 border-b border-gray-200 shadow-md"
      >
        <span
          class="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-500 text-white font-bold mr-3"
        >
          {{ username ? username.charAt(0).toUpperCase() : "?" }}
        </span>
        <div>
          <h2 class="text-xl font-semibold text-gray-800">Console Chat</h2>
          <p class="text-sm text-gray-500">
            <span>
              <ChatBubbleOvalLeftIcon
                class="w-4 h-4 inline-block mr-1"
              /> </span
            >chat as {{ username }}!
          </p>
        </div>
        <span
          class="ml-auto flex items-center text-sm"
          :class="onlineState ? 'text-green-500' : 'text-red-500'"
        >
          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="4" />
          </svg>
          {{ onlineState ? "Online" : "Offline" }}
        </span>
      </div>
      <ListChat
        id="chat-container"
        class="py-4"
        :messages="messages"
        @loadMore="fetchChatHistory"
        :isLoading="isLoading"
      />
      <form
        class="flex gap-2 w-full border-t border-gray-200 px-6 py-4"
        @submit.prevent="sendMessage"
        autocomplete="off"
      >
        <input
          v-model="message"
          type="text"
          placeholder="Type a message..."
          class="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          maxlength="200"
        />
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold transition"
          :disabled="!message.trim()"
        >
          Send
          <PaperAirplaneIcon class="w-5 h-5 inline-block ml-1" />
        </button>
      </form>
    </div>
    <p class="text-xs text-gray-500 mt-2 text-center hidden md:block">
      All messages are public. Be respectful.
    </p>
  </div>
</template>
