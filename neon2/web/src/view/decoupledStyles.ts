export function transformToShadowRoot(element: HTMLElement): ShadowRoot {
  const template = element.innerHTML;
  element.innerHTML = '';
  const shadowRoot = element.attachShadow({mode: 'open'});
  shadowRoot.innerHTML = template;
  return shadowRoot;
}

export function shadowRootCopyStyleSheets(root: ShadowRoot): void {
  const styleSheet = shadowRootStylesheet();
  styleSheet.disabled = true;
  const [htmlRootStyles, shadowRootStyles] = splitStylesheets(styleSheet);
  window.document.adoptedStyleSheets.push(htmlRootStyles);
  root.adoptedStyleSheets.push(shadowRootStyles);
}

function shadowRootStylesheet(): CSSStyleSheet {
  for (const styleSheet of window.document.styleSheets) {
    if (styleSheet.title === 'includeInShadowRoot') {
      return styleSheet;
    }
  }
  throw new Error('Failed to include stylesheet from root to shadow root.');
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
