<template>
    <div class="masuk">
      <h3>Hapus Data Pengeluaran</h3>
      <br>
      <table class="table">
        <thead>
        <tr>
        <th>Nomor</th>
        <th>Nama Pengeluaran</th>
        <th>Jumlah Pengeluaran</th>
        <th>Tombol Hapus</th>
        </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in hasil" :key="index">
                <td>{{ index+1 }}</td>
            <td>{{ item.nama_pengeluaran }}</td>
            <td>{{ formatUang(item.jumlah_pengeluaran) }}</td>
            <button @click="handleHapus(index,item.id)">HAPUS</button>
            </tr>
        </tbody>
    </table>
    <div v-for="(item, index) in total" :key="index">
        Total pengeluaran saat ini adalah {{ formatUang(item.total_pengeluaran) }}
    </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import axios from 'axios';
    const hasil = ref('');
    const router = useRouter();
    const total = ref('');

    const data = {
        session: localStorage.getItem("jwtToken"),
        id : +localStorage.getItem("userid"),
    };

    const formatUang = (value) => {
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
    });
    return formatter.format(value);
    };

    axios.post('http://localhost:3000/show', data)
        .then((res) => {
        hasil.value = res.data[0];
        total.value = res.data[1];
        })
        .catch((err) => {
        console.error(err);
        hasil.value = (err.response && err.response.data) || err.message;
        router.push('/dashboard');
        window.location.replace('http://localhost:5173/dashboard');
        });

    const handleHapus = (index,item_id) =>{
        hasil.value.splice(index,1);
        const data_item = {
        session: localStorage.getItem("jwtToken"),
        id : item_id,
    };
        axios.post('http://localhost:3000/erase', data_item)
        .then((res) => {
        hasil.value = res.data;
        alert(res.data)
        router.push('/erase')
        window.location.replace('http://localhost:5173/dashboard/erase');

        })
        .catch((err) => {
        console.error(err);
        hasil.value = (err.response && err.response.data) || err.message;
        router.push('/dashboard');
        window.location.replace('http://localhost:5173/dashboard');
        });
    }

</script>


<style scoped>
    .masuk {
        max-width: 600px;
        margin: auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    }

    .table th, .table td {
    border: 1px solid #dddddd;
    padding: 8px;
    text-align: left;
    }

    .table th {
    background-color: #f2f2f2;
    }
</style>