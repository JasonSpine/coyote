import {shadowRootCopyStyleSheets, transformToShadowRoot} from "./decoupledStyles";
import {createVueApplication} from "./dom/vue";

createVueApplication(applicationElement('#neon-application', '#vueApplication'));

function applicationElement(rootSelector: string, elementSelector: string): Element {
  const root = document.querySelector(rootSelector) as HTMLElement;
  if (root.dataset.decoupled) {
    const shadowRoot = transformToShadowRoot(root);
    shadowRootCopyStyleSheets(shadowRoot);
    return shadowRoot.querySelector(elementSelector)!;
  }
  return document.querySelector(elementSelector)!;
}
