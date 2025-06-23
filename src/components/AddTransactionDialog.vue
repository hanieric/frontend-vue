<script setup>
  import { ref, watch } from "vue";
  import { useToast } from "vue-toastification";
  import { useDraftStore } from "../store/draft.js";
  import axiosInstance from "../lib/axios_instance.js";
  import { VueFinalModal } from "vue-final-modal";
  import { CalendarDateRangeIcon } from "@heroicons/vue/24/outline";
  import { parseToThousand, parseToNumber } from "@/lib/thousand_parser.js";

  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
  });

  const emit = defineEmits(["update:modelValue", "success"]);
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
      await axiosInstance.post(
        `/create/${data.tipe == "pengeluaran" ? "expense" : "income"}`,
        data
      );
      setLoad(false);

      inputKeterangan.value = "";
      inputJumlah.value = "0";

      draftStore.clearDraft();

      toast.success("Transaksi berhasil dibuat!");

      show.value = false;
      emit("success");
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
    inputJumlah.value = parseToThousand(draft.jumlah.toString());
    selectedDate.value = draft.date ? new Date(draft.date) : new Date();
    inputTipe.value = draft.tipe || "pengeluaran";
  }

  watch(inputJumlah, (newValue) => {
    inputJumlah.value = parseToThousand(newValue);
    useDraftStore().updateDraft(toData());
  });

  watch(inputKeterangan, (_) => {
    useDraftStore().updateDraft(toData());
  });

  const toData = () => {
    return {
      keterangan: inputKeterangan.value,
      jumlah: parseToNumber(inputJumlah.value),
      date: selectedDate.value,
      tipe: inputTipe.value,
    };
  };

  watch(inputTipe, (_) => {
    useDraftStore().updateDraft(toData());
  });

  import DatePickerDialog from "@/components/DatePickerDialog.vue";
  import useLoading from "@/hooks/use_loading.js";
  import TypeDropdown from "./TypeDropdown.vue";

  // Date Picker Dialog
  const showDatePicker = ref(false);

  const handleDateConfirm = (date) => {
    selectedDate.value = new Date(date);
    useDraftStore().updateDraft(toData());
  };

  const showTipeMenu = ref(false);
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
      <div
        class="bg-white shadow-lg rounded-xl p-8 max-w-sm md:max-w-md w-screen"
      >
        <h3 class="text-2xl font-bold mb-8 text-center text-gray-800">
          Buat Transaksi
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
        <TypeDropdown
          v-model="inputTipe"
          :showTipeMenu="showTipeMenu"
          class="mb-6"
        />
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
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition mt-6 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ADD {{ inputTipe === "pemasukan" ? "INCOME" : "EXPENSE" }}
        </button>
      </div>
    </form>
  </VueFinalModal>
</template>
