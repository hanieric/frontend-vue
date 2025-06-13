<template>
    <div>{{ hasil }}</div>
</template>

<script setup>
    import axios from 'axios';
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';


    const hasil = ref('');
    const router = useRouter();

    axios.get('http://localhost:3000/logout')
    .then((res) => {
    hasil.value = res.data;
    alert(res.data)
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userid');
    router.push('/')
    window.location.replace('http://localhost:5173');
    })
    .catch((err) => {
    console.error(err);
    hasil.value = (err.response && err.response.data) || err.message;
    });
</script>