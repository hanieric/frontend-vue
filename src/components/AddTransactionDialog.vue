<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useDraftStore } from "../store/draft.js";
import axiosInstance from "../lib/axios_instance.js";
import { onMounted } from "vue";
import { VueFinalModal } from "vue-final-modal";
import {
  ChevronDownIcon,
  CalendarDateRangeIcon,
} from "@heroicons/vue/24/outline";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);
const show = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    show.value = val;
  }
);

watch(show, (val) => {
  emit("update:modelValue", val);
});

const handleTransform = (value) => {
  console.log("Transforming value:", value);
  if (!value) return "0";
  // Hapus spasi di awal dan akhir
  value = value.trim();

  if (value === "") {
    value = "0";
    return value;
  }

  if (value.length == 2 && value[1] !== ".") {
    value = value.replace("0", "");
    return value;
  }

  // Hanya izinkan satu titik desimal
  const firstDot = value.indexOf(".");
  if (firstDot !== -1) {
    // Hapus semua titik setelah yang pertama
    value =
      value.slice(0, firstDot + 1) +
      value.slice(firstDot + 1).replace(/\./g, "");
  }

  if ((value.match(/\./g) || []).length > 1) {
    // Jika ada lebih dari satu titik, hapus titik terakhir yang dimasukkan
    value =
      value.slice(0, value.lastIndexOf(".")).replace(/\./g, "") +
      value.slice(value.lastIndexOf("."));
  }

  // Hanya izinkan angka, koma, dan titik
  value = value.replace(/[^0-9,.]/g, "");

  // Tambahkan koma setiap 3 digit dari belakang
  let parts = value.replace(/,/g, "").split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  value = parts.join(".");

  return value;
};

const handleParse = (value) => {
  if (!value) return 0;

  // Hapus spasi di awal dan akhir
  value = value.trim();

  const firstDot = value.indexOf(".");
  let parts;
  if (firstDot !== -1) {
    parts = [value.slice(0, firstDot), value.slice(firstDot + 1)];
  } else {
    parts = [value];
  }
  // Remove commas from the thousand part
  parts[0] = parts[0].replace(/,/g, "");
  // Join back with dot if decimal exists
  const joined = parts.join(firstDot !== -1 ? "." : "");
  // Parse into number
  return Number(joined);
};

const draftStore = useDraftStore();
const { isLoading, setLoad } = useLoading();

const handlePost = async () => {
  const data = toData();

  if (!data.keterangan || !data.jumlah) {
    toast.error("Semua field harus diisi!");
    return;
  }

  setLoad(true);

  try {
    const response = await axiosInstance.post(
      `/create/${data.tipe == "pengeluaran" ? "expense" : "income"}`,
      data
    );
    setLoad(false);

    inputKeterangan.value = "";
    inputJumlah.value = "0";

    draftStore.clearDraft();

    toast.success("Transaksi berhasil dibuat!");
  } catch (error) {
    console.error(error);
    setLoad(false);
    if (error.response.data.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Terjadi kesalahan. Coba lagi.");
    }
  }
};

const toast = useToast();

const inputKeterangan = ref("");
const inputJumlah = ref("0");
const inputTipe = ref("pengeluaran");
const selectedDate = ref(Date());

const draft = draftStore.draft;
if (draft) {
  inputKeterangan.value = draft.keterangan;
  inputJumlah.value = handleTransform(draft.jumlah.toString());
  selectedDate.value = draft.date ? new Date(draft.date) : new Date();
  inputTipe.value = draft.tipe || "pengeluaran";
}

watch(inputJumlah, (newValue) => {
  inputJumlah.value = handleTransform(newValue);
  useDraftStore().updateDraft(toData());
});

watch(inputKeterangan, (_) => {
  useDraftStore().updateDraft(toData());
});

const toData = () => {
  return {
    keterangan: inputKeterangan.value,
    jumlah: handleParse(inputJumlah.value),
    date: selectedDate.value,
    tipe: inputTipe.value,
  };
};

// Tipe pengeluaran
const showTipeMenu = ref(false);

watch(inputTipe, (_) => {
  useDraftStore().updateDraft(toData());
});

onMounted(() => {
  document.addEventListener("click", (e) => {
    const tipeMenu = document.getElementById("inputTipe");
    if (showTipeMenu.value && tipeMenu && !tipeMenu.contains(e.target)) {
      showTipeMenu.value = false;
    }
  });
});

import { nextTick } from "vue";
import DatePickerDialog from "@/components/DatePickerDialog.vue";
import useLoading from "@/hooks/use_loading.js";

watch(showTipeMenu, async (val) => {
  if (val) {
    await nextTick();
    // Focus the first menu item when popup opens
    const firstMenuItem = document.getElementById("pengeluaran");
    if (firstMenuItem) {
      firstMenuItem.focus();
    }
  }
});

// Date Picker Dialog
const showDatePicker = ref(false);

const handleDateConfirm = (date) => {
  selectedDate.value = new Date(date);
  useDraftStore().updateDraft(toData());
};
</script>

<template>
  <VueFinalModal
    v-model="show"
    :transition="'fade'"
    :click-outside="true"
    :esc-to-close="true"
    class="flex items-center justify-center fixed inset-0 bg-black/40 w-full"
  >
    <form action="submit" @submit.prevent="handlePost">
      <div class="bg-white shadow-lg rounded-xl p-8 max-w-md w-screen">
        <h3 class="text-2xl font-bold mb-8 text-center text-gray-800">
          Buat Transaksi
        </h3>
        <div class="mb-4">
          <label
            for="inputPengeluaran"
            class="block text-gray-700 font-semibold mb-2"
            >Nama Pengeluaran</label
          >
          <input
            type="text"
            id="inputPengeluaran"
            v-model="inputKeterangan"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Masukkan nama pengeluaran"
          />
        </div>
        <div class="mb-6">
          <label
            for="inputJumlah"
            class="block text-gray-700 font-semibold mb-2"
            >Jumlah Pengeluaran</label
          >
          <div class="relative">
            <span
              class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
              >Rp</span
            >
            <input
              type="text"
              id="inputJumlah"
              v-model="inputJumlah"
              class="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Masukkan jumlah pengeluaran"
            />
          </div>
        </div>
        <div class="mb-6 flex items-center relative">
          <label
            for="inputTipe"
            class="block text-gray-700 font-semibold mr-4 flex-1"
            >Tipe</label
          >
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
                :class="{
                  'rotate-180': showTipeMenu,
                }"
              />
            </button>
            <div
              v-if="showTipeMenu"
              class="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10"
            >
              <div
                tabindex="0"
                id="pengeluaran"
                @click="
                  inputTipe = 'pengeluaran';
                  showTipeMenu = false;
                "
                @keydown.enter.prevent="
                  inputTipe = 'pengeluaran';
                  showTipeMenu = false;
                "
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
                @click="
                  inputTipe = 'pemasukan';
                  showTipeMenu = false;
                "
                @keydown.enter.prevent="
                  inputTipe = 'pemasukan';
                  showTipeMenu = false;
                "
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
            >Tanggal</label
          >
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
          @click="handlePost"
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition mt-6 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ADD {{ inputTipe === "pemasukan" ? "INCOME" : "EXPENSE" }}
        </button>
      </div>
    </form>
  </VueFinalModal>
</template>
