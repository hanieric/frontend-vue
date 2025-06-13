<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
      <h3 class="text-2xl font-bold text-gray-800 mb-6 text-center">
        Daftar Akun
      </h3>

      <div class="mb-4">
        <label for="inputNama" class="block text-gray-600 font-medium mb-2"
          >Nama</label
        >
        <input
          type="text"
          id="inputNama"
          v-model="inputNama"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Masukkan nama kamu"
        />
      </div>

      <div class="mb-6">
        <label for="inputPassword" class="block text-gray-600 font-medium mb-2"
          >Password</label
        >
        <input
          type="password"
          id="inputPassword"
          v-model="inputPassword"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Buat password yang aman"
        />
      </div>

      <button
        @click="handleDaftar"
        class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Sign In
      </button>

      <div v-if="hasil" class="mt-6 text-center text-green-600 font-semibold">
        {{ hasil }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
const inputNama = ref("");
const inputPassword = ref("");
const hasil = ref("");
const router = useRouter();

const handleDaftar = () => {
  const user = {
    username: inputNama.value,
    password: inputPassword.value,
  };

  axios
    .post("http://localhost:3000/register", user)
    .then((res) => {
      hasil.value = res.data;
      alert(res.data);
      router.push("/login");
      window.location.replace("http://localhost:5173/login");
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
