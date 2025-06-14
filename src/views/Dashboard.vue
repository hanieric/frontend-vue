<script setup></script>

<template>
  <div class="p-8 w-full max-w-7xl">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Transaction Record -->
      <div
        class="bg-white rounded-2xl shadow-lg p-6 flex flex-col min-h-[250px] md:col-span-2 lg:col-span-3"
      >
        <h2 class="mb-4 text-xl font-semibold text-gray-800">
          Transaction Record
        </h2>
        <ul class="list-none p-0 m-0">
          <li
            class="flex justify-between py-2 border-b border-gray-100 text-base last:border-b-0"
          >
            <span class="text-gray-600">Groceries</span>
            <span class="text-red-500 font-bold">- $50.00</span>
          </li>
          <li
            class="flex justify-between py-2 border-b border-gray-100 text-base last:border-b-0"
          >
            <span class="text-gray-600">Salary</span>
            <span class="text-green-600 font-bold">+ $2,000.00</span>
          </li>
          <li class="flex justify-between py-2 text-base">
            <span class="text-gray-600">Utilities</span>
            <span class="text-red-500 font-bold">- $120.00</span>
          </li>
        </ul>
      </div>
      <!-- Graphic Placeholder 1 -->
      <div
        class="bg-white rounded-2xl shadow-lg p-6 flex flex-col min-h-[250px] lg:col-span-2"
      >
        <h2 class="mb-4 text-xl font-semibold text-gray-800">Graphic 1</h2>
        <div
          class="flex-1 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-lg border-2 border-dashed border-gray-200"
        >
          [ Chart Placeholder ]
        </div>
      </div>
      <!-- Graphic Placeholder 2 -->
      <div
        class="bg-white rounded-2xl shadow-lg p-6 flex flex-col min-h-[250px]"
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
