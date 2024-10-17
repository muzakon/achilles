import "./assets/main.css";

// Vue Flow
import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import Tooltip from "primevue/tooltip";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.directive("tooltip", Tooltip);

app.mount("#app");
