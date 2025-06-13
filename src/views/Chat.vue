<script setup>
import { ref, onMounted } from 'vue';
import io from 'socket.io-client';

const username = localStorage.getItem("username");
const message = ref('');
const messages = ref([]);
let socket;

onMounted(() => {
  socket = io('http://localhost:3001');

  socket.on('message', (data) => {
    if (username !== data.username){
    messages.value.push({ text: `${data.username}: ${data.text}`, sentByUser: false });
  }
  });
});

const sendMessage = () => {
  const chatMessage = {username : username,text :message.value};
  console.log(username)
  const MSG = `${chatMessage.username}: ${chatMessage.text}`
  messages.value.push({ text: MSG, sentByUser: true });
  socket.emit('message', chatMessage);
  message.value = '';
};
</script>

<template>
<div class="masuk">
  <div id="app">
    <h3>Username : {{ username }}</h3>
    
    <div class="chat-container">
      <ul>
        <li v-for="(msg, index) in messages" :key="index" :class="{ 'sent-message': msg.sentByUser, 'received-message': !msg.sentByUser }">
          {{ msg.text }}
        </li>
      </ul>
    </div>
    
    <div class="input-container">
      <input v-model="message" placeholder="Type a message" />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
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
  background-color: #4CAF50; /* Green for sent messages */
  color: white;
}

.received-message {
  text-align: left;
  background-color: #ddd; /* Gray background for received messages */
  color: #333; /* Adjust text color for better visibility */
}
</style>
