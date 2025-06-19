<template>
  <MonthPickerDialog
    v-model="showMonthPicker"
    v-model:value="selectedMonth"
    @selectMonth="handleMonthChange"
  />

  <EditTransactionDialog
    :show="showEditDialog"
    :id="selectedTransaction?.id"
    :keterangan="
      selectedTransaction?.nama_pemasukan ||
      selectedTransaction?.nama_pengeluaran
    "
    :nominal="
      selectedTransaction?.jumlah_pemasukan ||
      selectedTransaction?.jumlah_pengeluaran
    "
    :tipe="selectedType"
    :date="selectedTransaction?.tanggal"
    @update:show="showEditDialog = $event"
    @submit="fetchData"
  />
  <div class="w-screen px-6 overflow-y-auto">
    <div class="max-w-7xl mx-auto w-full flex flex-col py-8 gap-8">
      <div class="flex flex-col gap-4 w-full">
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
        <!-- Loading shimmer -->
        <div v-if="isLoading" class="space-y-4">
          <div class="animate-pulse">
            <!-- Header shimmer -->
            <div class="flex justify-between items-center mb-6">
              <div class="h-6 bg-gray-300 rounded w-32"></div>
              <div class="h-6 bg-gray-300 rounded w-24"></div>
            </div>
            <!-- Table/Card shimmer -->
            <div class="space-y-3">
              <div
                v-for="i in 5"
                :key="i"
                class="flex justify-between items-center p-4 bg-gray-100 rounded"
              >
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div class="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
                <div class="h-6 bg-gray-300 rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>
        <!-- Desktop/Tablet: Show Table -->
        <DekstopTable
          v-if="!hasError && !isLoading"
          :income="income"
          :total-income="totalIncome"
          :expense="expense"
          :total-expense="totalExpense"
          :formatUang="formatUang"
          :formatTanggal="formatTanggal"
          @incomeClick="onIncomeClick"
          @expenseClick="onExpenseClick"
        />
        <!-- Mobile: Show Card -->
        <MobileCard
          v-if="!hasError && !isLoading"
          :income="income"
          :total-income="totalIncome"
          :expense="expense"
          :total-expense="totalExpense"
          :formatUang="formatUang"
          :formatTanggal="formatTanggal"
          @incomeClick="onIncomeClick"
          @expenseClick="onExpenseClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axiosInstance from "../../lib/axios_instance.js";
import MonthPickerDialog from "@/components/MonthPickerDialog.vue";
import useLoading from "@/hooks/use_loading.js";
import DekstopTable from "./components/DekstopTable.vue";
import MobileCard from "./components/MobileCard.vue";
import EditTransactionDialog from "./components/EditTransactionDialog.vue";

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

const showEditDialog = ref(false);
const selectedTransaction = ref(null);
const selectedType = ref("");

const onIncomeClick = (item) => {
  selectedTransaction.value = item;
  showEditDialog.value = true;
  selectedType.value = "pemasukan";
};

const onExpenseClick = (item) => {
  selectedTransaction.value = item;
  showEditDialog.value = true;
  selectedType.value = "pengeluaran";
};
</script>
