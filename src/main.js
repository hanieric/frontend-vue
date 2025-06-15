import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { createVfm } from "vue-final-modal";

import App from "./App.vue";
import router from "./router";

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App);

const options = {
  position: "bottom-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: false,
};

app.use(createVfm());
app.use(Toast, options);

app.use(createPinia());
app.use(router);

app.mount("#app");
