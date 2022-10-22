import { createApp } from "vue";
import "./index.css";
import "animate.css";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";

const pinia = createPinia();

createApp(App).use(router).use(pinia).mount("#app");
