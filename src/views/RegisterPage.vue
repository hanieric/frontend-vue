<script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { useToast } from "vue-toastification";
  import useLoading from "../hooks/use_loading.js";
  import LoadingIndicator from "@/components/LoadingIndicator.vue";
  import axiosInstance from "../lib/axios_instance.js";

  const inputNama = ref("");
  const inputPassword = ref("");

  const { isLoading, setLoad } = useLoading();
  const toast = useToast();
  const router = useRouter();

  const handleRegister = async () => {
    const user = {
      username: inputNama.value,
      password: inputPassword.value,
    };

    if (!user.username || !user.password) {
      toast.error("Nama dan password harus diisi!");
      return;
    }

    setLoad(true);

    try {
      await axiosInstance.post("/register", user);
      setLoad(false);
      toast.success("Berhasil mendaftar! Silakan login.");
      router.push("/login");
    } catch (err) {
      setLoad(false);
      console.error(err);
      const errorMessage = err.response
        ? err.response.data
        : "Terjadi kesalahan saat mendaftar. Silakan coba lagi.";
      toast.error(errorMessage);
    }
  };
</script>

<template>
  <div
    class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm md:max-w-md my-auto"
  >
    <h3 class="text-2xl font-bold text-gray-800 mb-6 text-center">
      Daftar Akun
    </h3>

    <form @submit.prevent="handleRegister">
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
          placeholder="Masukkan password"
        />
      </div>
      <button
        :disabled="isLoading"
        type="submit"
        class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mt-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 flex justify-center items-center"
      >
        Register
        <div v-if="isLoading" class="w-10">
          <LoadingIndicator class="ml-4" />
        </div>
      </button>
    </form>
  </div>
</template>
