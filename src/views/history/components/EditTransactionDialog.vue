<template>
  <VueFinalModal
    v-model="show"
    :transition="'fade'"
    :click-outside="true"
    :esc-to-close="true"
    class="flex items-center justify-center fixed inset-0 bg-black/40 w-full"
  >
    <form action="submit" @submit.prevent="handleEdit">
      <div
        class="bg-white shadow-lg rounded-xl p-8 max-w-sm md:max-w-md w-screen"
      >
        <h3 class="text-2xl font-bold mb-8 text-center text-gray-800">
          Edit Transaksi
        </h3>
        <div class="mb-4">
          <label
            :for="
              inputTipe === 'pemasukan' ? 'inputPemasukan' : 'inputPengeluaran'
            "
            class="block text-gray-700 font-semibold mb-2"
          >
            {{
              inputTipe === "pemasukan" ? "Nama Pemasukan" : "Nama Pengeluaran"
            }}
          </label>
          <input
            type="text"
            :id="
              inputTipe === 'pemasukan' ? 'inputPemasukan' : 'inputPengeluaran'
            "
            v-model="inputKeterangan"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            :placeholder="
              inputTipe === 'pemasukan'
                ? 'Masukkan nama pemasukan'
                : 'Masukkan nama pengeluaran'
            "
          />
        </div>
        <div class="mb-6">
          <label
            :for="
              inputTipe === 'pemasukan' ? 'inputJumlahPemasukan' : 'inputJumlah'
            "
            class="block text-gray-700 font-semibold mb-2"
          >
            {{
              inputTipe === "pemasukan"
                ? "Jumlah Pemasukan"
                : "Jumlah Pengeluaran"
            }}
          </label>
          <div class="relative">
            <span
              class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
              >Rp</span
            >
            <input
              type="text"
              :id="
                inputTipe === 'pemasukan'
                  ? 'inputJumlahPemasukan'
                  : 'inputJumlah'
              "
              v-model="inputJumlah"
              class="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              :placeholder="
                inputTipe === 'pemasukan'
                  ? 'Masukkan jumlah pemasukan'
                  : 'Masukkan jumlah pengeluaran'
              "
            />
          </div>
        </div>
        <div class="mb-6 flex items-center relative">
          <label
            for="inputTipe"
            class="block text-gray-700 font-semibold mr-4 flex-1"
          >
            Tipe
          </label>
          <div class="flex-2 relative w-full" id="inputTipe">
            <button
              type="button"
              @click="showTipeMenu = !showTipeMenu"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-400 transition flex items-center justify-between"
            >
              <span>
                {{ inputTipe === "pemasukan" ? "Pemasukan" : "Pengeluaran" }}
              </span>
              <ChevronDownIcon
                class="h-5 w-5 text-gray-500 ml-2 animate-transform transition-transform duration-200"
                :class="{ 'rotate-180': showTipeMenu }"
              />
            </button>
            <div
              v-if="showTipeMenu"
              class="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10"
            >
              <div
                tabindex="0"
                id="pengeluaran"
                @click="selectTipe('pengeluaran')"
                @keydown.enter.prevent="selectTipe('pengeluaran')"
                class="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-t-lg focus:bg-blue-200 outline-none"
                :class="{
                  'bg-blue-50 font-semibold': inputTipe === 'pengeluaran',
                }"
              >
                Pengeluaran
              </div>
              <div
                tabindex="0"
                id="pemasukan"
                @click="selectTipe('pemasukan')"
                @keydown.enter.prevent="selectTipe('pemasukan')"
                class="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-b-lg focus:bg-blue-200 outline-none"
                :class="{
                  'bg-blue-50 font-semibold': inputTipe === 'pemasukan',
                }"
              >
                Pemasukan
              </div>
            </div>
          </div>
        </div>
        <DatePickerDialog
          v-model="showDatePicker"
          v-model:value="selectedDate"
          @confirm="handleDateConfirm"
          @cancel="showDatePicker = false"
        />
        <div class="mb-6">
          <label
            for="inputTanggal"
            class="block text-gray-700 font-semibold mb-2"
          >
            Tanggal
          </label>
          <button
            type="button"
            @click="showDatePicker = true"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-400 transition flex items-center justify-between"
          >
            <span>
              {{
                selectedDate
                  ? new Date(selectedDate).toLocaleDateString()
                  : "Pilih Tanggal"
              }}
            </span>
            <CalendarDateRangeIcon class="h-5 w-5 text-gray-500 ml-2" />
          </button>
        </div>
        <button
          :disabled="isLoading"
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition mt-6 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          UPDATE {{ inputTipe === "pemasukan" ? "INCOME" : "EXPENSE" }}
        </button>
      </div>
    </form>
  </VueFinalModal>
</template>

<script setup>
  import { ref, watch, computed } from "vue";
  import { VueFinalModal } from "vue-final-modal";
  import DatePickerDialog from "@/components/DatePickerDialog.vue";
  import {
    ChevronDownIcon,
    CalendarDateRangeIcon,
  } from "@heroicons/vue/24/outline";
  import axiosInstance from "@/lib/axios_instance.js";
  import useLoading from "@/hooks/use_loading";
  import { useToast } from "vue-toastification";
  import { parseToNumber, parseToThousand } from "@/lib/thousand_parser";

  // Props for initial data
  const props = defineProps({
    show: Boolean,
    id: Number,
    keterangan: String,
    nominal: [String, Number],
    tipe: String,
    date: [String, Date],
  });
  const emit = defineEmits(["update:show", "submit"]);

  // Dialog visibility
  const show = computed({
    get: () => props.show,
    set: (val) => emit("update:show", val),
  });

  // Form state
  const inputKeterangan = ref(props.keterangan || "");
  const inputJumlah = ref(props.nominal ? String(props.nominal) : "");
  const inputTipe = ref(props.tipe || "pengeluaran");
  const selectedDate = ref(props.date ? new Date(props.date) : null);

  const showTipeMenu = ref(false);
  const showDatePicker = ref(false);

  // Watch for prop changes (if dialog is reused)
  watch(
    () => props.keterangan,
    (val) => (inputKeterangan.value = val || "")
  );
  watch(
    () => props.nominal,
    (val) => (inputJumlah.value = parseToThousand(val))
  );
  watch(
    () => props.tipe,
    (val) => (inputTipe.value = val || "pengeluaran")
  );
  watch(
    () => props.date,
    (val) => (selectedDate.value = val ? new Date(val) : null)
  );

  watch(inputJumlah, (val) => {
    inputJumlah.value = parseToThousand(val);
  });

  // Methods
  function selectTipe(tipe) {
    inputTipe.value = tipe;
    showTipeMenu.value = false;
  }

  function handleDateConfirm(date) {
    selectedDate.value = date;
    showDatePicker.value = false;
  }

  const { isLoading, setLoad } = useLoading();
  const toast = useToast();

  async function handleEdit() {
    setLoad(true);

    try {
      const response = await axiosInstance.put(
        `/update/${inputTipe.value == "pemasukan" ? "income" : "expense"}`,
        {
          id: props.id,
          keterangan: inputKeterangan.value,
          jumlah: parseToNumber(inputJumlah.value),
          date: selectedDate.value.toISOString(),
        }
      );

      setLoad(false);

      toast.success(
        `Berhasil mengupdate ${
          inputTipe.value === "pemasukan" ? "pemasukan" : "pengeluaran"
        }!`
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));

      emit("submit", {
        id: props.id,
        keterangan: inputKeterangan.value,
        nominal: Number(inputJumlah.value),
        tipe: inputTipe.value,
        date: selectedDate.value,
      });
    } catch (error) {
      console.error("Error updating transaction:", error);
      isLoading.value = false;
      return;
    }

    show.value = false;
  }
</script>
