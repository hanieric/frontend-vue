import { ref } from "vue";
import { useToast } from "vue-toastification";

export default function useLoading(initial = false) {
  const isLoading = ref(initial);

  function setLoad(value) {
    isLoading.value = value;
    const toast = useToast();
    const toastId = "loading-toast";
    if (value) {
      toast.info("Tunggu sebentar...", {
        id: toastId,
        timeout: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 0.6,
        hideProgressBar: true,
      });
    } else {
      toast.clear(toastId);
    }
  }

  return {
    isLoading,
    setLoad,
  };
}
