import { defineStore } from "pinia";

const STORAGE_KEY = "auth";

function loadAuthFromStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return { isAuthenticated: false, user: null, token: null };
    }
  }
  return { isAuthenticated: false, user: null, token: null };
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    ...loadAuthFromStorage(),
  }),
  actions: {
    authenticated(userData, token) {
      this.isAuthenticated = true;
      this.user = userData;
      this.token = token;
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          isAuthenticated: this.isAuthenticated,
          user: this.user,
          token: this.token,
        })
      );
    },
    logout() {
      this.isAuthenticated = false;
      this.user = null;
      this.token = null;
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});
