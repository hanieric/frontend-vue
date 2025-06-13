<template>
    <div class="masuk">
      <h3>Save Pengeluaran</h3>
      <div>
        <label for="inputPengeluaran">NAMA PENGELUARAN : </label>
        <input type="text" id="inputPengeluaran" v-model="inputPengeluaran" />
      </div>
      <div>
        <label for="inputJumlah">JUMLAH PENGELUARAN: </label>
        <input type="text" id="inputJumlah" v-model="inputJumlah" />
      </div>
  
      <button @click="handleSimpan">SAVE</button>
      <br>
      <br>
      <div>{{ hasil }}</div>
    </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  const inputPengeluaran = ref('');
  const inputJumlah = ref('');
  const hasil = ref('');
  const router = useRouter();
  
  const handleSimpan = () => {
    const data = {
      session: localStorage.getItem("jwtToken"),
      pengeluaran: inputPengeluaran.value,
      jumlah: +inputJumlah.value,
      userid : +localStorage.getItem("userid"),
    };
  
    axios.post('http://localhost:3000/save', data)
      .then((res) => {
        hasil.value = res.data;
        alert(res.data)
        router.push('/save');
        window.location.replace('http://localhost:5173/dashboard/save');
      })
      .catch((err) => {
        console.error(err);
        hasil.value = (err.response && err.response.data) || err.message;
        alert(err)
        router.push('/dashboard');
        window.location.replace('http://localhost:5173/dashboard');
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