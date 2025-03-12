import {createApp} from "vue";
import Main from "./Main.vue";
import "./dom/tailwind.css";

const applicationRoot = document.querySelector('#neon-application') as HTMLElement;

if (applicationRoot.dataset.decoupled) {
  const shadowRoot = transformToShadowRoot(applicationRoot);
  shadowRootCopyStyleSheets(shadowRoot);
  createApp(Main).mount(shadowRoot.querySelector('#vueApplication')!);
} else {
  createApp(Main).mount('#vueApplication');
}

function transformToShadowRoot(element: HTMLElement): ShadowRoot {
  const template = element.innerHTML;
  element.innerHTML = '';
  const shadowRoot = element.attachShadow({mode: 'open'});
  shadowRoot.innerHTML = template;
  return shadowRoot;
}

function shadowRootCopyStyleSheets(root: ShadowRoot): void {
  for (const styleSheet of window.document.styleSheets) {
    if (styleSheet.title === 'includeShadowRoot') {
      root.adoptedStyleSheets.push(copiedStyleSheet(styleSheet));
    }
  }
}

function copiedStyleSheet(source: CSSStyleSheet): CSSStyleSheet {
  const copy = new CSSStyleSheet();
  for (let index = 0; index < source.cssRules.length; index++) {
    copy.insertRule(source.cssRules.item(index).cssText, index);
  }
  return copy;
}
