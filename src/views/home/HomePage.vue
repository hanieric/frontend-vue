<script setup>
import { useAuthStore } from "../../store/auth";
import { useRouter } from "vue-router";
import FeatureCard from "./components/FeatureCard.vue";
import {
  ChartBarIcon,
  ShieldCheckIcon,
  UsersIcon,
  LightBulbIcon,
  CurrencyDollarIcon,
  DocumentCurrencyDollarIcon,
  BookOpenIcon,
} from "@heroicons/vue/24/outline";
import FeatureDetail from "./components/FeatureDetail.vue";

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
    class="flex flex-col bg-gradient-to-br from-blue-50 to-green-50 w-screen overflow-y-auto"
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
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 flex-1 py-16 justify-center items-stretch animate-fade-in"
      >
        <FeatureCard
          :icon="ChartBarIcon"
          icon-color="text-blue-500"
          border-color="border-blue-400"
          title="Track Expenses"
          description="Easily log and categorize your daily expenses."
        />
        <FeatureCard
          :icon="ShieldCheckIcon"
          icon-color="text-green-500"
          border-color="border-green-400"
          title="Secure"
          description="Your data is protected with top-notch security."
        />
        <FeatureCard
          :icon="UsersIcon"
          icon-color="text-purple-500"
          border-color="border-purple-400"
          title="Collaborative"
          description="Work together with your team seamlessly."
        />
        <FeatureCard
          :icon="LightBulbIcon"
          icon-color="text-yellow-500"
          border-color="border-yellow-400"
          title="Insights"
          description="Visualize your spending and income with beautiful charts."
        />
      </section>

      <section class="max-w-6xl mx-auto py-16 px-4">
        <div class="text-center mb-12">
          <h2
            class="text-4xl font-bold text-gray-800 mb-6 leading-tight animate-fade-in"
          >
            Take Control of Your Financial Future
          </h2>
          <p
            class="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-4 animate-slide-up"
          >
            Transform the way you handle money with intelligent tracking,
            actionable insights, and personalized recommendations.
          </p>
          <div
            class="flex justify-center items-center gap-2 text-blue-600 font-medium animate-bounce"
          >
            <i class="fas fa-chart-trending-up text-lg"></i>
            <span>Start building better financial habits today</span>
          </div>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureDetail
            :icon="CurrencyDollarIcon"
            color="blue"
            title="Expense Tracking"
            description="Log your daily expenses effortlessly and categorize them for better insights."
          />

          <FeatureDetail
            :icon="DocumentCurrencyDollarIcon"
            color="green"
            title="Income Management"
            description="Track multiple income sources and monitor your cash flow with automated recurring income detection."
          />

          <FeatureDetail
            :icon="BookOpenIcon"
            color="purple"
            title="Budget Planning"
            description="Set realistic budgets and receive smart alerts when you're approaching your limits."
            class="md:col-span-2 lg:col-span-1"
          />
        </div>
      </section>

      <section class="max-w-6xl mx-auto py-16 px-4">
        <div class="text-center mb-12">
          <h2
            class="text-4xl font-bold text-gray-800 mb-6 leading-tight animate-fade-in"
          >
            Why Choose HANIERICK?
          </h2>
          <p
            class="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-4 animate-slide-up"
          >
            Discover the features that make HANIERICK the ultimate financial
            tracking tool for individuals and businesses alike.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureDetail
            color="yellow"
            title="Smart Insights"
            description="Get actionable insights into your spending habits and income trends to make informed financial decisions."
          />

          <FeatureDetail
            color="red"
            title="Real-Time Alerts"
            description="Receive instant notifications for unusual spending patterns or when you're nearing your budget limits."
          />

          <FeatureDetail
            color="teal"
            title="Automated Sync"
            description="Seamlessly sync your financial data across devices and platforms for a unified experience."
          />

          <FeatureDetail
            color="orange"
            title="Customizable Tools"
            description="Tailor HANIERICK to your needs with customizable categories, reports, and dashboards."
          />

          <FeatureDetail
            color="indigo"
            title="Cloud Backup"
            description="Keep your data safe and accessible with secure cloud backups and easy restoration options."
          />

          <FeatureDetail
            color="gray"
            title="24/7 Support"
            description="Get assistance whenever you need it with our dedicated customer support team available around the clock."
          />
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
