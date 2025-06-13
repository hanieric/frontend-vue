import { ref } from "vue";

export default function useCheckToken() {
  const isTokenValid = ref(false);

  function checkToken() {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      isTokenValid.value = false;
      return false;
    }
    const payload = token.split(".")[1];
    if (!payload) {
      isTokenValid.value = false;
      return false;
    }
    try {
      const decoded = JSON.parse(atob(payload));
      const exp = decoded.exp;
      if (!exp) {
        isTokenValid.value = false;
        return false;
      }
      const now = Math.floor(Date.now() / 1000);
      isTokenValid.value = exp > now;
      return isTokenValid.value;
    } catch (e) {
      isTokenValid.value = false;
      return false;
    }
  }

  return {
    isTokenValid,
    checkToken,
  };
}
