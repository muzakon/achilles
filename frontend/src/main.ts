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

import 'notivue/notification.css'
import 'notivue/animations.css'

const app = createApp(App);

registerPlugins(app);
app.mount("#app");
