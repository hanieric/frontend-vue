<script setup>
    import axios from 'axios';
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';


    const hasil = ref('');
    const router = useRouter();
    const token = {
      session: localStorage.getItem("jwtToken"),
    };
    const username = localStorage.getItem("username")
    axios.post('http://localhost:3000/dashboard',token)
    .then((res) => {
    hasil.value = `HALLO , ${username} . SELAMAT DATANG KEMBALI DI DASHBOARD USER DENGAN ID ${res.data.userId} `;
    })
    .catch((err) => {
    console.error(err);
    hasil.value = (err.response && err.response.data) || err.message;
    router.push('/')
    window.location.replace('http://localhost:5173');
    });

</script>

<template>
    <div>{{ hasil }}</div>
</template>
