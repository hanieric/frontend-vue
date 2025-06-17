<template>
  <VueFinalModal
    v-model="isOpen"
    class="fixed inset-0 flex items-center justify-center bg-black/40"
    @click.self="close"
  >
    <div
      class="bg-white rounded-lg shadow-lg w-screen max-w-sm md:max-w-md p-6 relative"
    >
      <!-- Modal Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Select Date</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600">
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <!-- Calendar Navigation -->
      <div class="flex justify-between items-center mb-4">
        <button
          @click="goToPreviousMonth"
          class="p-2 rounded-full hover:bg-gray-200 text-gray-600"
        >
          <ChevronLeftIcon class="h-5 w-5" />
        </button>
        <div class="flex items-center gap-2">
          <!-- Month Dropdown -->
          <span
            id="monthDropdown"
            class="font-semibold text-lg text-gray-800 cursor-pointer select-none relative p-2"
            @click="showMonthDropdown = !showMonthDropdown"
          >
            {{ monthNames[currentMonth] }}
            <div
              v-if="showMonthDropdown"
              class="absolute left-0 top-full mt-1 z-10 bg-white border rounded shadow w-32 max-h-60 overflow-y-auto"
              style="scrollbar-width: none"
            >
              <div
                v-for="(month, idx) in monthNames"
                :key="month"
                @click.stop="selectMonth(idx)"
                class="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                :class="{ 'bg-blue-600 text-white': idx === currentMonth }"
              >
                {{ month }}
              </div>
            </div>
          </span>
          <!-- Year Dropdown -->
          <span
            id="yearDropdown"
            class="font-semibold text-lg text-gray-800 cursor-pointer select-none relative p-2"
            @click="showYearDropdown = !showYearDropdown"
          >
            {{ currentYear }}
            <div
              v-if="showYearDropdown"
              class="absolute left-0 top-full mt-1 z-10 bg-white border rounded shadow w-32 max-h-60 overflow-y-auto"
              style="scrollbar-width: none"
            >
              <div
                v-for="year in yearOptions"
                :key="year"
                @click.stop="selectYear(year)"
                class="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                :class="{ 'bg-blue-600 text-white': year === currentYear }"
              >
                {{ year }}
              </div>
            </div>
          </span>
        </div>
        <button
          @click="goToNextMonth"
          class="p-2 rounded-full hover:bg-gray-200 text-gray-600"
        >
          <ChevronRightIcon class="h-5 w-5" />
        </button>
      </div>

      <!-- Calendar Grid (Days of Week) -->
      <div
        class="grid grid-cols-7 text-center text-sm font-medium text-gray-500 mb-2"
      >
        <div v-for="dayName in dayNames" :key="dayName" class="py-2">
          {{ dayName }}
        </div>
      </div>

      <!-- Calendar Grid (Days of Month) -->
      <div class="grid grid-cols-7 text-center">
        <div
          v-for="day in calendarDays"
          :key="day.dateString"
          class="py-2 rounded-full cursor-pointer transition-colors duration-200"
          :class="{
            'text-gray-400': !day.isCurrentMonth, // Days from prev/next month
            'text-gray-900': day.isCurrentMonth, // Days from current month
            'bg-blue-600 text-white': day.isSelected, // Selected date
            'bg-blue-200/40': day.isToday,
            'hover:bg-blue-100': day.isCurrentMonth && !day.isSelected, // Hover for current month
            'font-semibold': day.isToday, // Today's date
            'opacity-50 cursor-not-allowed': day.isPastMonthDay, // Visually dim past month days from previous month
          }"
          @click="selectDay(day)"
        >
          {{ day.day }}
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end gap-2 mt-6">
        <button
          @click="close"
          class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
        >
          Cancel
        </button>
        <button
          @click="confirm"
          class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
        >
          OK
        </button>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup>
  import { ref, watch, computed } from "vue";
  import {
    XMarkIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
  } from "@heroicons/vue/24/outline";

  const props = defineProps({
    modelValue: { type: Boolean, required: true }, // Controls modal visibility
    value: { type: Date, default: "" }, // ISO date string for initial/current selection
  });

  const isOpen = ref(props.modelValue); // Local state for modal visibility

  watch(
    () => props.modelValue,
    (newValue) => {
      isOpen.value = newValue; // Sync local state with prop
    }
  );

  // Modal control functions (from your original code)
  function close() {
    selectedDate.value = new Date(props.value || today); // Reset to initial value
    currentMonth.value = selectedDate.value.getMonth();
    currentYear.value = selectedDate.value.getFullYear();

    emits("update:modelValue", false);
    emits("cancel");
  }

  function confirm() {
    // Emit the selected date as an ISO string
    emits("update:value", selectedDate.value.toISOString());
    emits("confirm", selectedDate.value.toISOString());
    emits("update:modelValue", false);
  }

  const emits = defineEmits([
    "update:modelValue", // For v-model:modelValue (visibility)
    "update:value", // For v-model:value (selected date)
    "confirm", // Emits when OK is clicked with the selected date
    "cancel", // Emits when Cancel/Close is clicked
  ]);

  // Reactive state for the currently displayed month/year in the calendar
  const today = new Date();
  const currentMonth = ref(today.getMonth()); // 0-11
  const currentYear = ref(today.getFullYear());

  // Reactive state for the user's selected date in the picker
  // Initialize with prop.value or today's date if prop.value is empty
  const selectedDate = ref(props.value ? new Date(props.value) : today);

  // Helper arrays for names (Indonesian)
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  // Start with Monday (0: Sunday, 1: Monday, ..., 6: Saturday)
  const dayNames = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

  // Watch for changes in the `value` prop to update `selectedDate`
  watch(
    () => props.value,
    (newValue) => {
      if (newValue) {
        selectedDate.value = new Date(newValue);
        // Also update calendar view to the month of the provided value
        currentMonth.value = selectedDate.value.getMonth();
        currentYear.value = selectedDate.value.getFullYear();
      } else {
        // If value is cleared, revert selectedDate to today
        selectedDate.value = today;
        currentMonth.value = today.getMonth();
        currentYear.value = today.getFullYear();
      }
    },
    { immediate: true } // Run immediately on component mount
  );

  // Computed property to generate all days for the current calendar view
  const calendarDays = computed(() => {
    const days = [];
    const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1);
    const lastDayOfMonth = new Date(
      currentYear.value,
      currentMonth.value + 1,
      0
    ); // Get last day by setting day to 0 of next month

    // Determine the day of the week for the first day of the month (0 for Sunday, 1 for Monday...)
    // We want Monday to be 0 for our grid, so adjust if Sunday is 0
    const firstDayOfWeek =
      firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1; // Adjust Sunday from 0 to 6

    // Days from previous month to fill the first week
    const prevMonthLastDay = new Date(
      currentYear.value,
      currentMonth.value,
      0
    ).getDate(); // Last day of previous month
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const date = new Date(currentYear.value, currentMonth.value - 1, day);
      days.push({
        day,
        date,
        dateString: date.toISOString().split("T")[0],
        isCurrentMonth: false,
        isToday: false, // Don't highlight past/future month days as today
        isSelected: false, // Not selected if not current month
        isPastMonthDay: true, // Flag to dim previous month's filler days
      });
    }

    // Days of the current month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(currentYear.value, currentMonth.value, day);
      const dateString = date.toISOString().split("T")[0];
      const isToday =
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate();
      const isSelected =
        selectedDate.value &&
        date.getFullYear() === selectedDate.value.getFullYear() &&
        date.getMonth() === selectedDate.value.getMonth() &&
        date.getDate() === selectedDate.value.getDate();

      days.push({
        day,
        date,
        dateString,
        isCurrentMonth: true,
        isToday,
        isSelected,
        isPastMonthDay: false,
      });
    }

    // Days from next month to fill the last week
    const totalDaysDisplayed = days.length;
    const remainingSlots = 42 - totalDaysDisplayed; // Max 6 weeks * 7 days = 42 slots (can be 35 also)
    for (let day = 1; day <= remainingSlots % 7; day++) {
      const date = new Date(currentYear.value, currentMonth.value + 1, day);
      const dateString = date.toISOString().split("T")[0];
      days.push({
        day,
        date,
        dateString,
        isCurrentMonth: false,
        isToday: false,
        isSelected:
          selectedDate.value &&
          dateString === selectedDate.value.toISOString().split("T")[0],
        isPastMonthDay: false, // These are future month filler, don't dim
      });
    }

    return days;
  });

  // Navigation functions
  function goToPreviousMonth() {
    if (currentMonth.value === 0) {
      currentMonth.value = 11;
      currentYear.value--;
    } else {
      currentMonth.value--;
    }
  }

  function goToNextMonth() {
    if (currentMonth.value === 11) {
      currentMonth.value = 0;
      currentYear.value++;
    } else {
      currentMonth.value++;
    }
  }

  // Handle day selection from the grid
  function selectDay(day) {
    if (day.isCurrentMonth || day.isPastMonthDay) {
      // Only allow selecting days displayed
      selectedDate.value = day.date;
      // If user clicks a day from prev/next month in the filler, navigate to that month
      if (!day.isCurrentMonth) {
        currentMonth.value = day.date.getMonth();
        currentYear.value = day.date.getFullYear();
      }
    }
  }

  // Month and year dropdown visibility
  const showMonthDropdown = ref(false);
  const showYearDropdown = ref(false);

  // Generate year options for the dropdown (e.g., 10 years before and after current year)
  const yearOptions = computed(() => {
    const startYear = currentYear.value - 10;
    const endYear = currentYear.value;
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years;
  });

  // Handle month selection from the dropdown
  function selectMonth(monthIndex) {
    currentMonth.value = monthIndex;
    showMonthDropdown.value = false; // Close dropdown after selection
  }

  // Handle year selection from the dropdown
  function selectYear(year) {
    currentYear.value = year;
    showYearDropdown.value = false; // Close dropdown after selection
  }

  import { onMounted, onBeforeUnmount } from "vue";

  function handleClickOutside(event) {
    const monthDropdown = document.getElementById("monthDropdown");
    const yearDropdown = document.getElementById("yearDropdown");
    if (
      showMonthDropdown.value &&
      monthDropdown &&
      !monthDropdown.contains(event.target)
    ) {
      showMonthDropdown.value = false;
    }
    if (
      showYearDropdown.value &&
      yearDropdown &&
      !yearDropdown.contains(event.target)
    ) {
      showYearDropdown.value = false;
    }
  }

  import { nextTick } from "vue";
  import { VueFinalModal } from "vue-final-modal";

  // Scroll to selected month/year when dropdown opens
  watch(showMonthDropdown, async (val) => {
    if (val) {
      await nextTick();
      const dropdown = document.querySelector("#monthDropdown .absolute");
      const selected = dropdown?.querySelector(".bg-blue-600");
      if (selected && dropdown) {
        dropdown.scrollTop = selected.offsetTop - dropdown.offsetTop;
      }
    }
  });

  watch(showYearDropdown, async (val) => {
    if (val) {
      await nextTick();
      const dropdown = document.querySelector("#yearDropdown .absolute");
      const selected = dropdown?.querySelector(".bg-blue-600");
      if (selected && dropdown) {
        dropdown.scrollTop = selected.offsetTop - dropdown.offsetTop;
      }
    }
  });

  onMounted(() => {
    document.addEventListener("mousedown", handleClickOutside);
  });
  onBeforeUnmount(() => {
    document.removeEventListener("mousedown", handleClickOutside);
  });
</script>
