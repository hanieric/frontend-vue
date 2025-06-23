<script setup>
  import AddTransactionDialog from "../components/AddTransactionDialog.vue";
  import { onMounted, ref, watch } from "vue";
  import axiosInstance from "@/lib/axios_instance";
  import {
    ArrowDownTrayIcon,
    ArrowUpTrayIcon,
  } from "@heroicons/vue/24/outline";
  import { useAuthStore } from "@/store/auth";

  const authStore = useAuthStore();

  const showAddTransactionDialog = ref(false);

  const expense = ref({});
  const income = ref({});

  const expense_total = ref(0);
  const income_total = ref(0);

  const dailyExpense = ref([]);
  const dailyIncome = ref([]);

  const dailyExpenseTotal = ref(0);
  const dailyIncomeTotal = ref(0);

  const isSameDay = (date, date2) => {
    // Check if two dates are the same day (ignoring time)
    const d1 = new Date(date);
    const d2 = new Date(date2 || new Date());
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const fetchData = async () => {
    try {
      const today = new Date();

      const endDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );
      const startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 29
      );

      const response = await axiosInstance.get("/history", {
        params: {
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
        },
      });
      const data = response.data;

      expense_total.value = data.expense_total || 0;
      income_total.value = data.income_total || 0;

      const expenseData = data.expense || [];
      const incomeData = data.income || [];

      expense.value = groupByDate(expenseData, "jumlah_pengeluaran");

      income.value = groupByDate(incomeData, "jumlah_pemasukan");

      dailyExpense.value = expenseData.filter((item) =>
        isSameDay(item.tanggal, today)
      );

      dailyIncome.value = incomeData.filter((item) =>
        isSameDay(item.tanggal, today)
      );

      dailyExpenseTotal.value = dailyExpense.value.reduce(
        (sum, item) => sum + Number(item.jumlah_pengeluaran),
        0
      );

      dailyIncomeTotal.value = dailyIncome.value.reduce(
        (sum, item) => sum + Number(item.jumlah_pemasukan),
        0
      );
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const groupByDate = (items) => {
    // Groups items by date (YYYY-MM-DD), value is an array of items for that date
    return items.reduce((acc, item) => {
      const date = new Date(item.tanggal).toLocaleDateString().slice(0, 10); // 'YYYY-MM-DD'
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});
  };

  import { computed } from "vue";
  import { Line } from "vue-chartjs";
  import {
    Chart,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
    Tooltip,
    Legend,
  } from "chart.js";

  Chart.register(
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
    Tooltip,
    Legend
  );

  // Prepare chart data
  const chartData = computed(() => {
    const dates = Object.keys(expense.value).sort();
    return {
      labels: dates,
      datasets: [
        {
          label: "Total Expense",
          data: dates.map((date) =>
            expense.value[date].reduce(
              (sum, item) => sum + Number(item.jumlah_pengeluaran),
              0
            )
          ),
          fill: false,
          borderColor: "#ef4444",
          backgroundColor: "#ef4444",
          tension: 0.3,
        },
      ],
    };
  });

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { title: { display: true, text: "Date" } },
      y: {
        title: { display: true, text: "Total Expense" },
        beginAtZero: true,
      },
    },
  };

  import { Pie } from "vue-chartjs";
  import { ArcElement } from "chart.js";

  Chart.register(ArcElement);

  const expenseIncomePieData = computed(() => ({
    labels: ["Expense", "Income"],
    datasets: [
      {
        data: [expense_total.value, income_total.value],
        backgroundColor: ["#ef4444", "#22c55e"],
        borderWidth: 1,
      },
    ],
  }));

  const expenseIncomePieOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "bottom" },
      title: { display: false },
      tooltip: { enabled: true },
    },
  };

  onMounted(() => {
    fetchData();
  });
</script>

<template>
  <div class="flex flex-col p-8 w-full max-w-7xl h-full">
    <AddTransactionDialog
      v-model="showAddTransactionDialog"
      @success="fetchData"
    />

    <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p class="text-gray-600 mt-2">
          Welcome back!
          {{ authStore.user.username || "User" }},
          <br />
          Here’s a quick overview of your financial status.
        </p>
      </div>

      <button
        class="mb-4 self-end px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
        @click="showAddTransactionDialog = true"
      >
        Add Transaction
      </button>
    </div>
    <div
      class="bg-white rounded-2xl shadow-lg flex flex-col max-h-[400px] pl-6 py-6 overflow-hidden mb-8"
    >
      <div class="mb-4 flex items-center gap-4 flex-wrap pr-6">
        <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span class="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
          Transaksi Hari Ini
        </h2>
        <span
          class="text-gray-500 text-base font-medium bg-gray-100 px-4 py-1 rounded-lg shadow-sm"
        >
          {{
            new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
          }}
        </span>
      </div>
      <div class="flex flex-col h-full min-h-[200px]">
        <div
          class="justify-between gap-4 border-b pb-2 mb-4 border-gray-200 mr-6 hidden xl:flex"
        >
          <div class="flex-1 flex justify-between items-center gap-2">
            <h3
              class="text-lg font-semibold text-red-500 flex items-center gap-2"
            >
              <ArrowUpTrayIcon class="w-5 h-5 inline text-red-500" />
              Expenses
            </h3>
            <span class="ml-auto text-sm text-gray-400 font-normal"
              >-
              <span class="font-bold text-red-500"
                >Rp{{ Number(dailyExpenseTotal).toLocaleString() }}</span
              ></span
            >
          </div>
          <div class="w-px bg-gray-200 mx-4" />
          <div class="flex-1 flex items-center gap-2">
            <h3
              class="text-lg font-semibold text-green-600 flex items-center gap-2"
            >
              <ArrowDownTrayIcon class="w-5 h-5 inline text-green-600" />
              Incomes
            </h3>
            <span class="ml-auto text-sm text-gray-400 font-normal">
              +
              <span class="font-bold text-green-600">
                Rp{{ Number(dailyIncomeTotal).toLocaleString() }}
              </span>
            </span>
          </div>
        </div>
        <div
          class="flex flex-col xl:flex-row gap-4 flex-1 pr-6 overflow-y-auto"
        >
          <div class="flex-1 flex flex-col">
            <div
              class="flex-1 items-center gap-2 flex justify-between xl:hidden"
            >
              <h3
                class="text-lg font-semibold text-red-500 flex items-center gap-2"
              >
                <ArrowUpTrayIcon class="w-5 h-5 inline text-red-500" />
                Expenses
              </h3>
              <span class="ml-auto text-sm text-gray-400 font-normal"
                >-
                <span class="font-bold text-red-500"
                  >Rp{{ Number(dailyExpenseTotal).toLocaleString() }}</span
                ></span
              >
            </div>
            <ul class="list-none p-0 m-0 divide-y divide-gray-100 flex-1">
              <li
                v-for="item in dailyExpense"
                :key="'expense-' + item.id"
                class="flex justify-between py-2 items-center"
              >
                <div>
                  <span class="text-gray-700 font-medium">{{
                    item.nama_pengeluaran
                  }}</span>
                  <span class="block text-xs text-gray-400">{{
                    new Date(item.tanggal).toLocaleDateString()
                  }}</span>
                </div>
                <span class="text-red-500 font-bold"
                  >- Rp{{
                    Number(item.jumlah_pengeluaran).toLocaleString()
                  }}</span
                >
              </li>
              <li
                v-if="!dailyExpense.length"
                class="py-2 text-gray-400 text-center"
              >
                No expenses
              </li>
            </ul>
          </div>
          <div class="w-px bg-gray-200 mx-4 hidden xl:block" />
          <div class="flex-1 flex flex-col">
            <div
              class="flex-1 items-center gap-2 flex justify-between xl:hidden"
            >
              <h3
                class="text-lg font-semibold text-green-600 flex items-center gap-2"
              >
                <ArrowDownTrayIcon class="w-5 h-5 inline text-green-600" />
                Incomes
              </h3>
              <span class="ml-auto text-sm text-gray-400 font-normal">
                +
                <span class="font-bold text-green-600">
                  Rp{{ Number(dailyIncomeTotal).toLocaleString() }}
                </span>
              </span>
            </div>
            <ul class="list-none p-0 m-0 divide-y divide-gray-100 flex-1">
              <li
                v-for="item in dailyIncome"
                :key="'income-' + item.id"
                class="flex justify-between py-2 items-center"
              >
                <div>
                  <span class="text-gray-700 font-medium">{{
                    item.nama_pemasukan
                  }}</span>
                  <span class="block text-xs text-gray-400">{{
                    new Date(item.tanggal).toLocaleDateString()
                  }}</span>
                </div>
                <span class="text-green-600 font-bold"
                  >+ Rp{{
                    Number(item.jumlah_pemasukan).toLocaleString()
                  }}</span
                >
              </li>
              <li
                v-if="!dailyIncome.length"
                class="py-2 text-gray-400 text-center"
              >
                No incomes
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col xl:flex-row gap-8 mb-8">
      <div class="bg-white rounded-2xl shadow-lg p-6 flex flex-col flex-2">
        <h2
          class="mb-4 text-xl font-semibold text-gray-800 flex items-center gap-2"
        >
          <span class="inline-block w-3 h-3 rounded-full bg-red-500"></span>
          Expense Trend (Last 30 Days)
        </h2>
        <div
          class="relative flex-1 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center min-h-[250px]"
        >
          <Line
            :data="chartData"
            :options="chartOptions"
            class="w-full h-full"
          />
        </div>
        <div class="mt-4 flex justify-between text-sm text-gray-500">
          <span>
            <span class="font-semibold">Total Expense:</span>
            Rp{{ Number(expense_total).toLocaleString() }}
          </span>
          <span>
            <span class="font-semibold">Days:</span>
            {{ chartData.labels.length }}
          </span>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6 flex flex-col flex-1">
        <h2 class="mb-4 text-xl font-semibold text-gray-800">
          Expense vs Income (This Month)
        </h2>
        <div
          class="flex items-center justify-center flex-1 bg-gray-50 rounded-xl border border-gray-200"
        >
          <div
            class="aspect-square w-full max-w-xs mx-auto p-4 flex items-center justify-center"
          >
            <Pie
              :data="expenseIncomePieData"
              :options="expenseIncomePieOptions"
              class="w-full h-full"
            />
          </div>
        </div>
        <div class="mt-4 flex justify-between text-sm text-gray-500">
          <span>
            <span class="font-semibold">Total Expense:</span>
            Rp{{ Number(expense_total).toLocaleString() }}
          </span>
          <span>
            <span class="font-semibold">Total Income:</span>
            Rp{{ Number(income_total).toLocaleString() }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
