<template>
  <MonthPickerDialog
    v-model="showMonthPicker"
    v-model:value="selectedMonth"
    @selectMonth="handleMonthChange"
  />
  <div
    class="mx-auto max-w-7xl flex flex-col py-8 mb-16 gap-8 px-6 overflow-y-auto"
  >
    <div class="flex flex-col gap-4">
      <div
        class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded flex items-center justify-between"
      >
        <span>
          Data yang ditampilkan adalah untuk bulan
          <strong>{{ formatMonth(selectedMonth) }}</strong>
        </span>
        <button
          class="ml-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition"
          @click="showMonthPicker = true"
        >
          Ganti Bulan
        </button>
      </div>
    </div>

    <div
      v-if="hasError"
      class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded flex items-center justify-between"
    >
      <span> Terjadi kesalahan saat mengambil data. Silakan coba lagi. </span>
      <button
        class="ml-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
        @click="fetchData"
      >
        Coba Lagi
      </button>
    </div>
    <div>
      <!-- Desktop/Tablet: Show Table -->
      <div class="hidden md:flex w-full flex-col lg:flex-row gap-16">
        <div class="flex-1">
          <h2 class="text-2xl font-bold mb-6 text-gray-800">
            Riwayat Pemasukan
          </h2>
          <div class="overflow-x-auto rounded-lg shadow mb-10">
            <table class="min-w-full bg-white divide-y divide-gray-200">
              <thead class="bg-green-100">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nama Pemasukan
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Jumlah Pemasukan
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tanggal
                  </th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-200">
                <tr v-if="income.length === 0">
                  <td colspan="3" class="px-6 py-4 text-center text-gray-400">
                    Tidak ada data pemasukan untuk bulan ini.
                  </td>
                </tr>
                <tr
                  v-for="(item, index) in income"
                  :key="index"
                  @click="onIncomeRowClick(item)"
                  class="hover:bg-green-50 cursor-pointer transition"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-gray-700">
                    {{ item.nama_pemasukan }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-gray-700">
                    {{ formatUang(item.jumlah_pemasukan) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-gray-700">
                    {{ formatTanggal(item.tanggal) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mb-12 text-right">
            <span class="text-lg font-semibold text-gray-700"
              >Total Pemasukan:
            </span>
            <span class="text-lg font-bold text-green-600">{{
              formatUang(totalIncome)
            }}</span>
          </div>
        </div>
        <div class="flex-1">
          <h2 class="text-2xl font-bold mb-6 text-gray-800">
            Riwayat Pengeluaran
          </h2>
          <div class="overflow-x-auto rounded-lg shadow">
            <table class="min-w-full bg-white divide-y divide-gray-200">
              <thead class="bg-gray-100">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nama Pengeluaran
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Jumlah Pengeluaran
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tanggal
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-if="expense.length === 0">
                  <td colspan="3" class="px-6 py-4 text-center text-gray-400">
                    Tidak ada data pengeluaran untuk bulan ini.
                  </td>
                </tr>
                <tr
                  v-for="(item, index) in expense"
                  :key="index"
                  @click="onExpenseRowClick(item)"
                  class="hover:bg-blue-50 cursor-pointer transition"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-gray-700">
                    {{ item.nama_pengeluaran }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-gray-700">
                    {{ formatUang(item.jumlah_pengeluaran) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-gray-700">
                    {{ formatTanggal(item.tanggal) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="total-expense mt-6 text-right">
            <span class="text-lg font-semibold text-gray-700"
              >Total Pengeluaran:
            </span>
            <span class="text-lg font-bold text-red-600">{{
              formatUang(totalExpense)
            }}</span>
          </div>
        </div>
      </div>
      <!-- Mobile: Show Card -->
      <div class="flex flex-col gap-8 md:hidden">
        <div>
          <h2 class="text-xl font-bold mb-4 text-gray-800">
            Riwayat Pemasukan
          </h2>
          <div
            v-for="(item, index) in income"
            :key="index"
            @click="onIncomeRowClick(item)"
            class="bg-white rounded-lg shadow p-4 mb-4 hover:bg-green-50 cursor-pointer transition"
          >
            <div class="font-semibold text-green-700">
              {{ item.nama_pemasukan }}
            </div>
            <div class="text-gray-700">
              {{ formatUang(item.jumlah_pemasukan) }}
            </div>
            <div class="text-gray-500 text-sm">
              {{ formatTanggal(item.tanggal) }}
            </div>
          </div>
          <div class="total-income mb-8 text-right">
            <span class="text-base font-semibold text-gray-700"
              >Total Pemasukan:
            </span>
            <span class="text-base font-bold text-green-600">{{
              formatUang(totalIncome)
            }}</span>
          </div>
        </div>
        <div>
          <h2 class="text-xl font-bold mb-4 text-gray-800">
            Riwayat Pengeluaran
          </h2>
          <div
            v-for="(item, index) in expense"
            :key="index"
            @click="onExpenseRowClick(item)"
            class="bg-white rounded-lg shadow p-4 mb-4 hover:bg-blue-50 cursor-pointer transition"
          >
            <div class="font-semibold text-blue-700">
              {{ item.nama_pengeluaran }}
            </div>
            <div class="text-gray-700">
              {{ formatUang(item.jumlah_pengeluaran) }}
            </div>
            <div class="text-gray-500 text-sm">
              {{ formatTanggal(item.tanggal) }}
            </div>
          </div>
          <div class="total-expense text-right">
            <span class="text-base font-semibold text-gray-700"
              >Total Pengeluaran:
            </span>
            <span class="text-base font-bold text-red-600">{{
              formatUang(totalExpense)
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axiosInstance from "../lib/axios_instance.js";
import MonthPickerDialog from "@/components/MonthPickerDialog.vue";
import useLoading from "@/hooks/use_loading.js";

const income = ref([]);
const totalIncome = ref(0);
const expense = ref([]);
const totalExpense = ref(0);

const { isLoading, setLoad } = useLoading();
const hasError = ref(false);

const storedMonthLabel = localStorage.getItem("selectedMonthLabel");
const selectedMonth = ref(
  new Date(storedMonthLabel || new Date().toISOString())
);

const fetchData = async () => {
  setLoad(true);
  hasError.value = false;
  try {
    const selectedMonthDate = selectedMonth.value;
    const response = await axiosInstance.get("/history", {
      params: {
        start_date: new Date(
          selectedMonthDate.getFullYear(),
          selectedMonthDate.getMonth(),
          1
        ).toISOString(),

        end_date: new Date(
          selectedMonthDate.getFullYear(),
          selectedMonthDate.getMonth() + 1,
          0
        ).toISOString(),
      },
    });
    setLoad(false);
    const data = response.data;
    income.value = data.income || [];
    totalIncome.value = data.income_total || 0;
    expense.value = data.expense || [];
    totalExpense.value = data.expense_total || 0;
  } catch (error) {
    setLoad(false);
    hasError.value = true;
    console.error("Error fetching history:", error);
  }
};

const formatUang = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);
};

const formatTanggal = (dateString) => {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

const onIncomeRowClick = (item) => {
  console.log("Income row clicked:", item);
  // Implement your logic here, e.g., navigate to details page
};

const onExpenseRowClick = (item) => {
  console.log("Expense row clicked:", item);
  // Implement your logic here, e.g., navigate to details page
};

const formatMonth = (date) => {
  return new Date(date).toLocaleString("id-ID", {
    month: "long",
    year: "numeric",
  });
};

const showMonthPicker = ref(false);

const handleMonthChange = (month) => {
  selectedMonth.value = month;
  localStorage.setItem("selectedMonthLabel", month.toISOString());
  fetchData(); // Re-fetch data for the selected month
};

onMounted(() => {
  // Fetch data when the component is mounted
  fetchData();
});
</script>
