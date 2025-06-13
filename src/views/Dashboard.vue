<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axiosInstance from "../lib/axios_instance.js";
import useCheckToken from "../hooks/use_check_token.js";

const hasil = ref("");
const router = useRouter();
const { isTokenValid, checkToken } = useCheckToken();

checkToken();

if (!isTokenValid.value) {
  router.push("/");
} else {
  const username = localStorage.getItem("username");

  axiosInstance
    .post("http://localhost:3000/dashboard")
    .then((res) => {
      hasil.value = `HALLO , ${username} . SELAMAT DATANG KEMBALI DI DASHBOARD USER DENGAN ID ${res.data.userId} `;
    })
    .catch((err) => {
      console.error(err);
      hasil.value = (err.response && err.response.data) || err.message;
      router.push("/");
    });
}
</script>

<template>
  <div>{{ hasil }}</div>
</template>
