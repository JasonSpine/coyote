import {App, createApp} from "vue";
import JobBoard from "./JobBoard.vue";
import "./tailwind.css";

export function createVueApplication(container: Element): void {
  const app: App<Element> = createApp(JobBoard);
  app.mount(container);
}
