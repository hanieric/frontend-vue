<script setup>
import { ref, onMounted } from "vue";
import io from "socket.io-client";
import { ChatBubbleOvalLeftIcon } from "@heroicons/vue/24/outline";
import { useAuthStore } from "@/store/auth";

const store = useAuthStore();

const username = ref(store.user ? store.user.username : "Guest");

const message = ref("");
const messages = ref([]);
let socket;

onMounted(() => {
  socket = io("http://localhost:3001");

  socket.on("message", (data) => {
    if (username !== data.username) {
      messages.value.push({
        text: `${data.username}: ${data.text}`,
        sentByUser: false,
      });
    }
  });
});

const sendMessage = () => {
  const chatMessage = { username: username, text: message.value };
  console.log(username);
  const MSG = `${chatMessage.username}: ${chatMessage.text}`;
  messages.value.push({ text: MSG, sentByUser: true });
  socket.emit("message", chatMessage);
  message.value = "";
};
</script>

<template>
  <div class="flex flex-col items-center bg-gray-100 py-8 max-w-xl w-full">
    <div
      class="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 flex flex-col h-[70vh]"
    >
      <div class="flex items-center mb-4">
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
        <span class="ml-auto text-sm text-gray-400">Online</span>
      </div>
      <div class="flex-1 overflow-y-auto mb-4 px-2">
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
              {{ msg.text }}
            </div>
          </li>
        </ul>
      </div>
      <form class="flex gap-2" @submit.prevent="sendMessage" autocomplete="off">
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
