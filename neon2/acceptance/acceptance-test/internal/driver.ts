import {Page} from '@playwright/test';
import {Payment, PricingPlan, PricingType} from './dsl';
import {WebDriver} from './webDriver';

export type PaymentNotification = string;
export type PaymentStatus = string;

export class Driver {
  private web: WebDriver;

  constructor(page: Page) {
    this.web = new WebDriver(page);
  }

  async loadApplication(): None {
    await this.web.navigate('/');
  }

  async publishJobOffer(
    title: string,
    pricingType: PricingType,
    payment: Payment,
    paymentCardNumber?: string,
  ): None {
    const pricingPlan: PricingPlan = pricingType === 'free' ? 'free' : 'premium';
    await this.createJobOffer(title, pricingPlan);
    if (pricingType === 'paid') {
      await this.finalizeJobOfferPayment(payment, paymentCardNumber!);
    }
  }

  async initiatePayment(jobOfferTitle: string, cardNumber: string): None {
    await this.createJobOffer(jobOfferTitle, 'premium');
    await this.fillCardDetails(cardNumber);
    await this.proceedCardPayment();
  }

  private async createJobOffer(title: string, pricingPlan: PricingPlan): None {
    await this.web.click('Dodaj ofertę');
    if (pricingPlan === 'free') {
      await this.web.click('Publikuj ogłoszenie');
    }
    if (pricingPlan === 'premium') {
      await this.web.click('Kup ogłoszenie');
    }
    if (pricingPlan === 'strategic') {
      await this.web.click('Kup ogłoszenie');
    }
    await this.web.fillByLabel('Tytuł oferty', title);
    await this.web.click('Dodaj');
    await this.web.waitForText('Dodano ofertę pracy!');
  }

  private async fillCardDetails(cardNumber: string): None {
    await this.web.fill('paymentProviderCard', cardNumber);
  }

  private async finalizeJobOfferPayment(payment: Payment, paymentCardNumber: string): None {
    await this.web.waitForText('Oferta została stworzona, zostanie opublikowana kiedy zaksięgujemy płatność.');
    if (payment === 'completed') {
      await this.fillCardDetails(paymentCardNumber);
      await this.proceedCardPayment();
      await this.web.waitForText('Płatność sfinalizowana!');
    }
  }

  private async proceedCardPayment(): None {
    await this.web.click('Zapłać i Publikuj');
  }

  async updateJobOffer(sourceTitle: string, targetTitle: string): None {
    await this.web.click(sourceTitle);
    await this.web.click('Edytuj');
    await this.web.fillByLabel('Tytuł oferty', targetTitle);
    await this.web.click('Zapisz');
    await this.web.waitForText('Zaktualizowano ofertę pracy!');
  }

  async searchJobOffers(searchPhrase: string): None {
    await this.web.fillByPlaceholder('Szukaj po tytule', searchPhrase);
    await this.web.clickByTestId('search');
  }

  async listJobOffers(): Promise<string[]> {
    return await this.web.listStringByTestId('jobOfferTitle');
  }

  async findJobOfferExpiryInDays(jobOfferTitle: string): Promise<number> {
    await this.web.click(jobOfferTitle);
    return await this.web.readStringByTestId('jobOfferExpiresInDays');
  }

  async readPaymentNotification(): Promise<PaymentNotification> {
    await this.web.waitUntilVisible('paymentNotification');
    const notification = await this.web.readValue('paymentNotification');
    return notification as PaymentNotification;
  }

  async readPaymentStatus(): Promise<PaymentStatus> {
    await this.web.waitUntilVisible('paymentStatus');
    const status = await this.web.read('paymentStatus');
    if (status === 'Płatność przyjęta!') {
      return 'paymentComplete';
    }
    if (status === 'Płatność odrzucona') {
      return 'paymentFailed';
    }
    throw new Error('Failed to parse payment status.');
  }
}

type None = Promise<void>;
