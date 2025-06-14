import { defineStore } from "pinia";

const STORAGE_KEY = "draft_transaction";
const EXPIRE_KEY = "draft_transaction_expire";
const EXPIRE_DURATION = 1000 * 60 * 60 * 24; // 24 jam

function loadDraft() {
  const expire = localStorage.getItem(EXPIRE_KEY);
  if (expire && Date.now() > Number(expire)) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(EXPIRE_KEY);
    return { keterangan: null, jumlah: "", tipe: "", date: "" };
  }
  const data = localStorage.getItem(STORAGE_KEY);
  return data
    ? JSON.parse(data)
    : { keterangan: null, jumlah: "", tipe: "", date: "" };
}

function saveDraft(draft) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  localStorage.setItem(EXPIRE_KEY, (Date.now() + EXPIRE_DURATION).toString());
}

export const useDraftStore = defineStore("draft", {
  state: () => ({
    draft: loadDraft(), // { keterangan: null, jumlah: "", tipe: "", date: "" }
  }),
  actions: {
    updateDraft({ keterangan, jumlah, tipe, date }) {
      this.draft = { keterangan, jumlah, tipe, date };
      saveDraft(this.draft);
    },
    clearDraft() {
      this.draft = { keterangan: null, jumlah: "", tipe: "", date: "" };
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(EXPIRE_KEY);
    },
  },
});
