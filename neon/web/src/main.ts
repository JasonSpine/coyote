import {createApp} from "vue";
import Main from "./Main.vue";
import "./dom/tailwind.css";

const app = createApp(Main, {});
app.mount('#vueApplication');
