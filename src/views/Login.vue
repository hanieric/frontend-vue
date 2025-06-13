<template>
    <div class="masuk">
      <h3>Masuk</h3>
      <div>
        <label for="inputNama">NAMA : </label>
        <input type="text" id="inputNama" v-model="inputNama" />
      </div>
      <div>
        <label for="inputPassword">PASSWORD : </label>
        <input type="password" id="inputPassword" v-model="inputPassword" />
      </div>
  
      <button @click="handleMasuk">LOG IN</button>
      <br>
      <br>
      <div>{{ hasil }}</div>
    </div>
  </template>
  
<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  const inputNama = ref('');
  const inputPassword = ref('');
  const hasil = ref('');
  const router = useRouter();
  
  const handleMasuk = () => {
    const user = {
      username: inputNama.value,
      password: inputPassword.value,
    };
  
    axios.post('http://localhost:3000/login', user)
      .then((res) => {
        const token = res.data.token;
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("username", res.data.user.username);
        localStorage.setItem("userid", res.data.user.id);
        router.push('/dashboard');
        window.location.replace('http://localhost:5173/dashboard');
      })
      .catch((err) => {
        console.error(err);
        hasil.value = (err.response && err.response.data) || err.message;
        router.push('/login');
      });
  };
  </script>
  
  
  <style scoped>
  .masuk {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  
  }
  </style>