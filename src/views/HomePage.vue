<script setup>
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const handleGetStarted = () => {
  if (authStore.isAuthenticated) {
    // Redirect to dashboard if already authenticated
    router.push("/dashboard");
  } else {
    // Redirect to login page if not authenticated
    router.push("/login");
  }
};
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-green-50 w-screen"
  >
    <header
      class="bg-white shadow-lg py-10 flex flex-col items-center relative px-8"
    >
      <img
        src="@/assets/logo.png"
        alt="HANIERICK Logo"
        class="w-32 h-32 mb-4 animate-bounce"
      />
      <h1
        class="text-5xl font-extrabold text-blue-700 mb-2 tracking-tight drop-shadow"
      >
        HANIERICK
      </h1>
      <p class="text-xl text-gray-700 mb-8 font-medium">
        The Smart Expense & Income Tracker
      </p>
      <p class="text-lg text-gray-500 mb-6 max-w-xl text-center">
        Take control of your finances. Track your expenses, manage your income,
        and visualize your financial health—all in one place.
      </p>
      <button
        @click="handleGetStarted"
        class="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-lg shadow-lg hover:from-blue-700 hover:to-green-600 transition font-semibold text-lg mt-8 cursor-pointer hover:scale-105 transform duration-300"
      >
        Get Started
      </button>
      <span class="absolute top-4 right-8 text-sm text-gray-400 font-mono"
        >v1.0</span
      >
    </header>
    <div class="max-w-7xl mx-auto px-8">
      <section
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 flex-1 py-16 justify-center items-stretch"
      >
        <div
          class="flex flex-col items-center bg-white rounded-xl shadow-lg p-8 border-t-4 border-blue-400 h-full min-h-[160px]"
        >
          <i class="fas fa-bolt text-yellow-400 text-4xl mb-4"></i>
          <h2 class="text-2xl font-semibold mb-2">Fast</h2>
          <p class="text-gray-600 text-center">
            Lightning-fast performance for all your needs.
          </p>
        </div>
        <div
          class="flex flex-col items-center bg-white rounded-xl shadow-lg p-8 border-t-4 border-blue-500 h-full min-h-[160px]"
        >
          <i class="fas fa-lock text-blue-500 text-4xl mb-4"></i>
          <h2 class="text-2xl font-semibold mb-2">Secure</h2>
          <p class="text-gray-600 text-center">
            Your data is protected with top-notch security.
          </p>
        </div>
        <div
          class="flex flex-col items-center bg-white rounded-xl shadow-lg p-8 border-t-4 border-green-500 h-full min-h-[160px]"
        >
          <i class="fas fa-users text-green-500 text-4xl mb-4"></i>
          <h2 class="text-2xl font-semibold mb-2">Collaborative</h2>
          <p class="text-gray-600 text-center">
            Work together with your team seamlessly.
          </p>
        </div>
        <div
          class="flex flex-col items-center bg-white rounded-xl shadow-lg p-8 border-t-4 border-pink-400 h-full min-h-[160px]"
        >
          <i class="fas fa-chart-line text-pink-400 text-4xl mb-4"></i>
          <h2 class="text-2xl font-semibold mb-2">Insights</h2>
          <p class="text-gray-600 text-center">
            Visualize your spending and income with beautiful charts.
          </p>
        </div>
      </section>
      <section class="max-w-4xl mx-auto py-8 px-4">
        <div class="grid md:grid-cols-2 gap-8">
          <div
            class="bg-white rounded-lg shadow p-6 flex flex-col items-center"
          >
            <i class="fas fa-wallet text-blue-600 text-3xl mb-2"></i>
            <h3 class="text-xl font-bold mb-2">Expense Tracking</h3>
            <p class="text-gray-600 text-center">
              Easily log your daily expenses and categorize them for better
              budgeting.
            </p>
          </div>
          <div
            class="bg-white rounded-lg shadow p-6 flex flex-col items-center"
          >
            <i class="fas fa-coins text-green-500 text-3xl mb-2"></i>
            <h3 class="text-xl font-bold mb-2">Income Management</h3>
            <p class="text-gray-600 text-center">
              Record your income sources and monitor your cash flow
              effortlessly.
            </p>
          </div>
        </div>
      </section>
    </div>
    <footer class="bg-white py-6 text-center shadow-inner mt-8">
      <p class="text-gray-500">&copy; 2024 HANIERICK. All rights reserved.</p>
      <div class="flex justify-center gap-4 mt-2">
        <a href="#" class="text-blue-500 hover:underline text-sm"
          >Privacy Policy</a
        >
        <a href="#" class="text-blue-500 hover:underline text-sm">Contact</a>
      </div>
    </footer>
  </div>
</template>
