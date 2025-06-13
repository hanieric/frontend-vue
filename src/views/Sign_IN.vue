<template>
  <div class="masuk">
    <h3>Daftar</h3>
    <div>
      <label for="inputNama">NAMA : </label>
      <input type="text" id="inputNama" v-model="inputNama" />
    </div>
    <div>
      <label for="inputPassword">PASSWORD : </label>
      <input type="password" id="inputPassword" v-model="inputPassword" />
    </div>

    <button @click="handleDaftar">SIGN IN</button>
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
const router = useRouter()

const handleDaftar = () => {
  const user = {
    username: inputNama.value,
    password: inputPassword.value,
  };

  axios.post('http://localhost:3000/register', user)
    .then((res) => {
      hasil.value = res.data;
      alert(res.data)
      router.push('/login')
      window.location.replace('http://localhost:5173/login');
    })
    .catch((err) => {
      console.error(err);
      hasil.value = (err.response && err.response.data) || err.message;
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
