<template>
  <div class="flex flex-col gap-8 md:hidden">
    <div>
      <h2 class="text-xl font-bold mb-4 text-gray-800">Riwayat Pemasukan</h2>
      <div
        v-for="(item, index) in income"
        :key="index"
        @click="onIncomeClick(item)"
        class="bg-white rounded-lg shadow p-4 mb-4 hover:bg-green-50 cursor-pointer transition"
      >
        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-2">
            <div
              class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded w-fit"
            >
              {{ formatTanggal(item.tanggal) }}
            </div>
            <div class="font-semibold text-gray-800">
              {{ item.nama_pemasukan }}
            </div>
          </div>
          <div class="font-bold text-green-600">
            {{ formatUang(item.jumlah_pemasukan) }}
          </div>
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
      <h2 class="text-xl font-bold mb-4 text-gray-800">Riwayat Pengeluaran</h2>
      <div
        v-for="(item, index) in expense"
        :key="index"
        @click="onExpenseClick(item)"
        class="bg-white rounded-lg shadow p-4 mb-4 hover:bg-red-50 cursor-pointer transition"
      >
        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-2">
            <div
              class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded w-fit"
            >
              {{ formatTanggal(item.tanggal) }}
            </div>
            <div class="font-semibold text-gray-800">
              {{ item.nama_pengeluaran }}
            </div>
          </div>
          <div class="font-bold text-red-600">
            {{ formatUang(item.jumlah_pengeluaran) }}
          </div>
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
</template>

<script setup>
const props = defineProps({
  income: Array,
  totalIncome: Number,
  expense: Array,
  totalExpense: Number,
  formatUang: Function,
  formatTanggal: Function,
  onIncomeClick: Function,
  onExpenseClick: Function,
});
</script>
