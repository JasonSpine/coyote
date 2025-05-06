import {shadowRootCopyStyleSheets} from "./decoupledStyles";

export function runInShadowDom(listener: (element: HTMLElement) => void): void {
  class NeonApplicationElement extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({mode: 'open'});
      shadow.innerHTML = `<div id="application"></div>`;
      shadowRootCopyStyleSheets(shadow);
      listener(shadow.querySelector('#application')!);
    }
  }

  customElements.define('custom-neon-application', NeonApplicationElement);
}

export function setDarkTheme(isDarkTheme: boolean): void {
  document.querySelector('custom-neon-application')!.classList.toggle('dark', isDarkTheme);
}
