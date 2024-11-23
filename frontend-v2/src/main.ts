/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Styles
import "@/assets/tailwind.css";
import "@/assets/main.scss";

// Vue Flow
import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";

// Plugins
import api from "./helper/Axios";

const app = createApp(App);

// Prototypes
app.provide("$api", api);

registerPlugins(app);

app.mount("#app");
