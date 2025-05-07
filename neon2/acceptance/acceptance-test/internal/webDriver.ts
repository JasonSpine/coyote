import {Page} from '@playwright/test';

export class WebDriver {
  constructor(private page: Page) {
  }

  async navigate(url: string): None {
    await this.page.goto(url);
  }

  queryParam(queryParam: string): string {
    const url = new URL(this.page.url());
    return url.searchParams.get(queryParam)!;
  }

  async reload(): None {
    await this.page.goto('/Praca');
  }

  async click(text: string): None {
    await this.page.getByText(text, {exact: true}).click();
  }

  async clickByTestId(testId: string): None {
    await this.page.getByTestId(testId).click();
  }

  async fillByLabel(label: string, value: string): None {
    await this.page.getByLabel(label).fill(value);
  }

  async selectByLabel(label: string, option: string): None {
    await this.page.getByLabel(label).selectOption(option);
  }

  async fillByPlaceholder(placeholder: string, value: string): None {
    await this.page.getByPlaceholder(placeholder).fill(value);
  }

  async read(testId: string): Promise<string> {
    const text = await this.page.getByTestId(testId).textContent();
    if (text) {
      return text.trim();
    }
    throw new Error(`Failed to read a string by test id: ${testId}`);
  }

  async listStringByTestId(testId: string): Promise<string[]> {
    return this.page.getByTestId(testId).allTextContents();
  }

  async waitForText(text: string): None {
    await this.page.getByText(text).waitFor({state: 'visible'});
  }

  async waitForTextDisappears(text: string): None {
    await this.page.getByText(text).waitFor({state: 'hidden'});
  }

  async waitUntilVisible(testId: string): None {
    await this.page.getByTestId(testId).waitFor({state: 'visible'});
  }

  async isVisible(testId: string): Promise<boolean> {
    return await this.page.getByTestId(testId).isVisible();
  }

  async isVisibleText(text: string): Promise<boolean> {
    return await this.page.getByText(text).isVisible();
  }

  async readTestValue(testId: string): Promise<string|null> {
    return await this.page.getByTestId(testId).getAttribute('data-test-value');
  }

  async fill(testId: string, value: string): None {
    await this.page.getByTestId(testId).fill(value);
  }
}

type None = Promise<void>;
