<template>
  <div class="hidden md:flex w-full flex-col lg:flex-row gap-16">
    <div class="flex-1">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Riwayat Pemasukan</h2>
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
              @click="onIncomeClick(item)"
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
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Riwayat Pengeluaran</h2>
      <div class="overflow-x-auto rounded-lg shadow">
        <table class="min-w-full bg-white divide-y divide-gray-200">
          <thead class="bg-red-50">
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
              @click="onExpenseClick(item)"
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
