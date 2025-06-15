<script setup>
import AddTransactionDialog from "../components/AddTransactionDialog.vue";
import { onMounted, ref, watch } from "vue";
import axiosInstance from "@/lib/axios_instance";
import { ArrowDownTrayIcon, ArrowUpTrayIcon } from "@heroicons/vue/24/outline";

const showAddTransactionDialog = ref(false);

watch(showAddTransactionDialog, (val) => {
  console.log("Dialog visibility changed:", val);
});

const expense = ref([]);
const income = ref([]);
const expense_total = ref(0);
const income_total = ref(0);

const fetchData = async () => {
  try {
    const today = new Date();
    const startDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const response = await axiosInstance.get("/history", {
      params: {
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      },
    });
    const data = response.data;

    expense.value = data.expense || [];
    income.value = data.income || [];
    expense_total.value = data.expense_total || 0;
    income_total.value = data.income_total || 0;
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="flex flex-col p-8 w-full max-w-7xl">
    <AddTransactionDialog
      v-model="showAddTransactionDialog"
      @cancel="showAddTransactionDialog = false"
    />

    <button
      class="mb-4 self-end px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
      @click="showAddTransactionDialog = true"
    >
      Add Transaction
    </button>
    <div
      class="bg-white rounded-2xl shadow-lg flex flex-col max-h-[400px] py-6 pl-6 overflow-hidden mb-8"
    >
      <h2 class="mb-4 text-xl font-semibold text-gray-800">
        Daily Transactions : {{ new Date().toLocaleDateString() }}
      </h2>
      <div
        class="flex flex-col md:flex-row gap-8 h-full min-h-[200px] overflow-y-auto"
      >
        <div class="flex-1 pr-6 md:p-0">
          <h3
            class="text-lg font-semibold text-red-500 mb-2 flex items-center gap-2"
          >
            <ArrowUpTrayIcon class="w-5 h-5 inline text-red-500" />
            Expenses
            <span class="ml-auto text-sm text-gray-400 font-normal"
              >Total:
              <span class="font-bold text-red-500"
                >Rp{{ Number(expense_total).toLocaleString() }}</span
              ></span
            >
          </h3>
          <ul class="list-none p-0 m-0 divide-y divide-gray-100">
            <li
              v-for="item in expense"
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
            <li v-if="!expense.length" class="py-2 text-gray-400 text-center">
              No expenses
            </li>
          </ul>
        </div>
        <div class="w-px bg-gray-200 mx-4 hidden md:block" />
        <div class="flex-1 pr-6">
          <h3
            class="text-lg font-semibold text-green-600 mb-2 flex items-center gap-2"
          >
            <ArrowDownTrayIcon class="w-5 h-5 inline text-green-600" />
            Incomes
            <span class="ml-auto text-sm text-gray-400 font-normal"
              >Total:
              <span class="font-bold text-green-600"
                >Rp{{ Number(income_total).toLocaleString() }}</span
              ></span
            >
          </h3>
          <ul class="list-none p-0 m-0 divide-y divide-gray-100">
            <li
              v-for="item in income"
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
                >+ Rp{{ Number(item.jumlah_pemasukan).toLocaleString() }}</span
              >
            </li>
            <li v-if="!income.length" class="py-2 text-gray-400 text-center">
              No incomes
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="flex flex-col md:flex-row gap-8 mb-8">
      <div
        class="bg-white rounded-2xl shadow-lg p-6 flex flex-col min-h-[250px] flex-2"
      >
        <h2 class="mb-4 text-xl font-semibold text-gray-800">Graphic 1</h2>
        <div
          class="flex-1 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-lg border-2 border-dashed border-gray-200"
        >
          [ Chart Placeholder ]
        </div>
      </div>
      <div
        class="bg-white rounded-2xl shadow-lg p-6 flex flex-col min-h-[250px] flex-1"
      >
        <h2 class="mb-4 text-xl font-semibold text-gray-800">Graphic 2</h2>
        <div
          class="flex-1 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-lg border-2 border-dashed border-gray-200"
        >
          [ Chart Placeholder ]
        </div>
      </div>
    </div>
  </div>
</template>
