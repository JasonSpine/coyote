import {Page} from '@playwright/test';
import {JobOfferSubmitAttemptMode, Payment, PaymentMethod, PricingBundleName, PricingPlan} from './dsl';
import {WebDriver} from './webDriver';

export type PaymentNotification = string;
export type PaymentStatus = string;

export class Driver {
  private web: WebDriver;

  constructor(page: Page) {
    this.web = new WebDriver(page);
  }

  async loadApplication(userId: number): None {
    await this.web.navigate('/?userId=' + userId.toString());
  }

  userId(): number {
    return parseInt(this.web.queryParam('userId'));
  }

  async reloadApplication(): None {
    await this.web.reload();
  }

  async publishJobOffer(
    title: string,
    pricingPlan: PricingPlan,
    payment: Payment,
    paymentCardNumber: string,
    description: string,
    companyName: string,
  ): None {
    await this.createJobOffer(title, pricingPlan, payment, description, companyName);
    if (pricingPlan === 'free') {
      await this.web.waitForText('Dodano ogłoszenie!');
      await this.web.click('Zobacz pozostałe');
    } else {
      await this.finalizeJobOfferPayment(payment, paymentCardNumber);
    }
  }

  async finishPayment(paymentCardNumber: string): None {
    await this.finalizeJobOfferPayment('completed', paymentCardNumber);
  }

  private async createJobOffer(
    title: string,
    pricingPlan: PricingPlan,
    payment: Payment,
    description: string,
    companyName: string,
  ) {
    await this.web.click('Dodaj ogłoszenie');
    if (payment !== 'redeem-bundle') {
      await this.selectPricingPlan(pricingPlan);
    }
    await this.submitJobOfferForm(title, description, companyName);
  }

  async initiateCardPayment(jobOfferTitle: string, cardNumber: string): None {
    await this.web.click('Dodaj ogłoszenie');
    await this.selectPricingPlan('premium');
    await this.submitJobOfferForm(jobOfferTitle, 'description', 'companyName');
    await this.selectPaymentMethod('card');
    await this.fillCardDetails(cardNumber);
    await this.fillInvoiceInformation();
    await this.proceedPayment();
  }

  async initiateP24Payment(jobOfferTitle: string): None {
    await this.web.click('Dodaj ogłoszenie');
    await this.selectPricingPlan('premium');
    await this.submitJobOfferForm(jobOfferTitle, 'description', 'companyName');
    await this.selectPaymentMethod('p24');
    await this.fillInvoiceInformation();
    await this.proceedPayment();
  }

  private async submitJobOfferForm(title: string, description: string, companyName: string): None {
    await this.fillJobOfferForm(title, description, companyName);
    await this.web.click('Dodaj ogłoszenie');
    await this.web.waitForText('Dodano ogłoszenie!');
  }

  private async fillJobOfferForm(title: string, description: string, companyName: string): None {
    await this.fillJobOfferCompanyName(companyName);
    await this.fillJobOfferDetails(title, description);
  }

  private async fillJobOfferCompanyName(companyName: string): None {
    await this.web.fillByLabel('Nazwa firmy', companyName);
    await this.web.click('Dalej');
  }

  private async fillJobOfferDetails(title: string, description: string): None {
    await this.web.fillByLabel('Tytuł ogłoszenia', title);
    await this.web.fillByLabel('Szczegółowe informacje', description);
    await this.web.click('Dalej');
  }

  private async selectPricingPlan(pricingPlan: PricingPlan): None {
    if (pricingPlan === 'free') {
      await this.web.click('Publikuj ogłoszenie');
    } else if (pricingPlan === 'premium') {
      await this.web.click('Kup ogłoszenie');
    } else if (pricingPlan === 'strategic') {
      await this.web.click('Kup pakiet Strategic');
    } else if (pricingPlan === 'growth') {
      await this.web.click('Kup pakiet Growth');
    } else if (pricingPlan === 'scale') {
      await this.web.click('Kup pakiet Scale');
    } else {
      throw new Error('Failed to select a pricing plan.');
    }
  }

  private async selectPaymentMethod(paymentMethod: PaymentMethod): None {
    if (paymentMethod === 'card') {
      await this.web.click('Karta kredytowa / debetowa');
    }
    if (paymentMethod === 'p24') {
      await this.web.click('BLIK lub przelew');
    }
  }

  private async finalizeJobOfferPayment(payment: Payment, paymentCardNumber: string): None {
    await this.web.waitForText('Ogłoszenie zostało zapisane, zostanie opublikowane kiedy zaksięgujemy płatność.');
    if (payment === 'completed') {
      await this.fillCardDetails(paymentCardNumber);
      await this.fillInvoiceInformation();
      await this.proceedPayment();
      await this.web.waitForText('Płatność zaksięgowana!');
    }
    if (payment === 'redeem-bundle') {
      await this.finalizePaymentByUsingBundle();
      await this.web.waitForText('Skorzystałeś z pakietu, żeby opublikować ogłoszenie!');
    }
    if (payment === 'failed') {
      await this.fillCardDetails(paymentCardNumber);
      await this.fillInvoiceInformation();
      await this.proceedPayment();
      await this.web.waitForText('Płatność odrzucona.');
    }
  }

  private async fillInvoiceInformation(): None {
    await this.web.fillByLabel('Nazwa firmy', 'company name');
    await this.web.fillByLabel('Kraj', 'country');
    await this.web.fillByLabel('NIP / VAT - ID', '5555666677');
    await this.web.fillByLabel('Adres', 'company address');
    await this.web.fillByLabel('Kod pocztowy', '11-222');
    await this.web.fillByLabel('Miasto', 'company city');
  }

  private async fillCardDetails(cardNumber: string): None {
    await this.web.fill('paymentProviderCard', cardNumber);
  }

  async finalizePaymentByUsingBundle(): None {
    await this.web.click("Skorzystaj z pakietu by Opublikować");
  }

  private async proceedPayment(): None {
    await this.web.click('Zapłać i Publikuj');
  }

  async updateJobOffer(sourceTitle: string, targetTitle: string, targetDescription: string): None {
    await this.web.click(sourceTitle);
    await this.web.click('Edytuj');
    await this.fillJobOfferForm(targetTitle, targetDescription, 'Company name');
    await this.web.click('Zapisz');
    await this.web.waitForText('Zaktualizowano ogłoszenie!');
    await this.web.click('Zobacz pozostałe');
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
    const expiresInDaysTitle = await this.web.readStringByTestId('jobOfferExpiresInDays');
    return parseInt(expiresInDaysTitle.replace('za ', '').replace(' dni', ''));
  }

  async readPaymentNotification(): Promise<PaymentNotification> {
    await this.web.waitUntilVisible('paymentNotification');
    const notification = await this.web.readTestValue('paymentNotification');
    return notification as PaymentNotification;
  }

  async readPaymentStatus(): Promise<PaymentStatus> {
    await this.web.waitUntilVisible('paymentStatus');
    const status = await this.web.readStringByTestId('paymentStatus');
    if (status === 'Płatność zaksięgowana!') {
      return 'paymentComplete';
    }
    if (status === 'Płatność odrzucona.') {
      return 'paymentFailed';
    }
    throw new Error('Failed to parse payment status.');
  }

  async findPlanBundle(): Promise<PlanBundle> {
    return this.parsePlanBundle(await this.web.readStringByTestId('planBundle'));
  }

  private parsePlanBundle(planBundle: string): PlanBundle {
    const match = planBundle.match(/^Pozostało (\d+) ogłoszeń z Pakietu (\w+)\.$/);
    if (!match) {
      throw new Error('Failed to parse plan bundle.');
    }
    return {
      bundleName: match[2].toLowerCase() as PricingBundleName,
      remainingJobOffers: parseInt(match[1], 10),
    };
  }

  async hasPlanBundle(): Promise<boolean> {
    return await this.web.isVisible('planBundle');
  }

  async findJobOfferField(jobOfferTitle: string, field: 'description'|'companyName'): Promise<string> {
    await this.web.click(jobOfferTitle);
    if (field === 'description') {
      return await this.web.readStringByTestId('jobOfferDescription');
    }
    if (field === 'companyName') {
      return await this.web.readStringByTestId('jobOfferCompanyName');
    }
    throw new Error('Failed to find job offer field.');
  }

  async tryPublishJobOffer(mode: JobOfferSubmitAttemptMode): Promise<void> {
    await this.web.click('Dodaj ogłoszenie');
    await this.selectPricingPlan('free');
    if (mode === 'empty-title') {
      await this.fillJobOfferCompanyName('company name');
      await this.fillJobOfferDetails('', 'description');
    }
    if (mode === 'empty-company-name') {
      await this.fillJobOfferCompanyName('');
    }
  }

  async findErrorMessage(): Promise<string> {
    const errorMessage = await this.web.readStringByTestId('errorMessage');
    if (errorMessage === 'Podaj nazwę firmy.') {
      return 'provide-company-name';
    }
    if (errorMessage === 'Podaj tytuł ogłoszenia.') {
      return 'provide-offer-title';
    }
    throw new Error('Failed to parse error message.');
  }
}

interface PlanBundle {
  bundleName: PricingBundleName;
  remainingJobOffers: number;
}

type None = Promise<void>;
