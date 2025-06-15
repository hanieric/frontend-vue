<script setup>
import { ref, onMounted, nextTick } from "vue";
import io from "socket.io-client";
import {
  ChatBubbleOvalLeftIcon,
  PaperAirplaneIcon,
} from "@heroicons/vue/24/outline";
import { useAuthStore } from "@/store/auth";
import axiosInstance from "@/lib/axios_instance";

const store = useAuthStore();

const onlineState = ref(false);

const username = ref(store.user ? store.user.username : "Guest");

const message = ref("");
const messages = ref([]);
let socket;

const fetchChatHistory = async () => {
  try {
    const response = await axiosInstance.get("/chat");

    messages.value = response.data.map((chat) => ({
      text: chat.message,
      sentByUser: store.user.userId === chat["user_id"],
      username: chat.username,
      timestamp: chat.timestamp,
    }));

    scrollDown();
  } catch (error) {
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
    console.log("Connected to chat server");
    onlineState.value = true;
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from chat server");
    onlineState.value = false;
  });
};

const sendMessage = () => {
  if (message.value.trim() === "") return;

  const msg = {
    text: message.value,
    sentByUser: true,
    timestamp: new Date().toISOString(),
  };

  console.log("Sending message:", msg);
  if (!socket || !socket.connected) {
    console.error("Socket is not connected");
    onlineState.value = false;

    return;
  }

  socket.emit("message", msg);
  messages.value.push(msg);
  message.value = "";

  scrollDown();
};

const scrollDown = async () => {
  // Scrolls the chat container to the bottom
  await nextTick();
  const chatContainer = document.querySelector(".overflow-y-auto");
  if (chatContainer) {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
};

onMounted(() => {
  connectSocket();
  fetchChatHistory();
});
</script>

<template>
  <div class="flex flex-col items-center py-8 max-w-xl w-full">
    <div
      class="w-full max-w-2xl bg-white rounded-lg shadow-lg py-6 pl-6 flex flex-col h-[70vh]"
    >
      <div class="flex items-center mb-4 pr-6">
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
      <div class="flex-1 overflow-y-auto mb-4 px-2 pr-6">
        <ul>
          <li
            v-for="(msg, index) in messages"
            :key="index"
            :class="
              msg.sentByUser
                ? 'flex justify-end mb-2'
                : 'flex justify-start mb-2'
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
      <form
        class="flex gap-2 pr-6"
        @submit.prevent="sendMessage"
        autocomplete="off"
      >
        <input
          v-model="message"
          type="text"
          placeholder="Type a message..."
          class="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          @keyup.enter="sendMessage"
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
    <p class="mt-6 text-gray-400 text-xs">
      All messages are public. Be respectful.
    </p>
  </div>
</template>

<style scoped>
.chat-container {
  max-width: 400px;
  margin: 20px auto;
}

.masuk {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 8px;
}

.sent-message {
  text-align: right;
  background-color: #4caf50; /* Green for sent messages */
  color: white;
}

.received-message {
  text-align: left;
  background-color: #ddd; /* Gray background for received messages */
  color: #333; /* Adjust text color for better visibility */
}
</style>
