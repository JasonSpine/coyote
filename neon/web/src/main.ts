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
  const styleSheet = shadowRootStylesheet(root);
  if (!styleSheet) {
    return;
  }
  styleSheet.disabled = true;
  const [htmlRootStyles, shadowRootStyles] = splitStylesheets(styleSheet);
  window.document.adoptedStyleSheets.push(htmlRootStyles);
  root.adoptedStyleSheets.push(shadowRootStyles);
}

function shadowRootStylesheet(root: ShadowRoot): CSSStyleSheet|null {
  for (const styleSheet of window.document.styleSheets) {
    if (styleSheet.title === 'includeShadowRoot') {
      return styleSheet;
    }
  }
  throw new Error('Failed to parse shadow root stylesheet.');
}

function splitStylesheets(styleSheet: CSSStyleSheet): [CSSStyleSheet, CSSStyleSheet] {
  const propertyStyles = new CSSStyleSheet();
  const stylesClone = new CSSStyleSheet();
  for (let index = 0; index < styleSheet.cssRules.length; index++) {
    const rule = styleSheet.cssRules.item(index)!;
    if (rule.constructor.name === 'CSSPropertyRule') {
      propertyStyles.insertRule(rule.cssText);
    } else {
      stylesClone.insertRule(rule.cssText, index);
    }
  }
  return [propertyStyles, stylesClone];
}
