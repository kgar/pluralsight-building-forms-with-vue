import { createApp } from "vue";
import App from "./App.vue";
import { VuelidatePlugin } from "@vuelidate/core";

const app = createApp(App);
app.use(VuelidatePlugin);
app.mount("#app");
