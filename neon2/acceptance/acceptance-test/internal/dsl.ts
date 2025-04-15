import {Driver, PaymentNotification, PaymentStatus} from './driver';
import {Mangler} from './mangler';
import {assertContains, assertEquals, assertNotContains} from './playwright';

export type PricingType = 'free'|'paid';
export type Payment = 'completed'|'ignored';
export type Card = 'valid'|'declined'|'expired'|'insufficientFunds';
export type PricingBundleName = 'strategic'|'growth'|'scale';
export type PricingPlan = 'free'|'premium'|PricingBundleName;

export class Dsl {
  private mangler: Mangler;

  constructor(private driver: Driver) {
    this.mangler = new Mangler();
  }

  async beforeEach(): None {
    await this.driver.loadApplication(this.newUserId());
    this.mangler.reset();
  }

  private newUserId(): number {
    return parseInt(Math.random().toString().substring(2));
  }

  async resetClient(): None {
    await this.driver.reloadApplication();
  }

  async publishJobOffer(jobOffer: {
    title: string,
    plan?: PricingPlan,
    pricingType?: PricingType,
    payment?: Payment,
  }): None {
    await this.driver.publishJobOffer(
      this.enc(jobOffer.title),
      this.pricingPlan(jobOffer.plan, jobOffer.pricingType),
      jobOffer.payment || 'completed',
      this.cardNumber('valid'));
  }

  private pricingPlan(plan: PricingPlan|undefined, pricingType: PricingType|undefined): PricingPlan {
    if (plan) {
      return plan;
    }
    return pricingType === 'paid' ? 'premium' : 'free';
  }

  async updateJobOffer(update: {title: string, updatedTitle: string}): None {
    await this.driver.updateJobOffer(this.enc(update.title), this.enc(update.updatedTitle));
  }

  async searchJobOffers(search: {searchPhrase: string}): None {
    await this.driver.searchJobOffers(search.searchPhrase);
  }

  async assertJobOfferIsListed(assertion: {jobOfferTitle: string}): None {
    assertContains(
      assertion.jobOfferTitle,
      this.mangler.decodedAll(await this.driver.listJobOffers()));
  }

  async assertJobOfferIsNotListed(assertion: {jobOfferTitle: string}): None {
    assertNotContains(
      assertion.jobOfferTitle,
      this.mangler.decodedAll(await this.driver.listJobOffers()));
  }

  async assertJobOfferExpiresInDays(assertion: {jobOfferTitle: string, expectedExpiry: number}): None {
    assertEquals(
      assertion.expectedExpiry,
      await this.driver.findJobOfferExpiryInDays(this.enc(assertion.jobOfferTitle)));
  }

  private enc(name: string): string {
    return this.mangler.encoded(name);
  }

  async initiatePayment(payment: {card: Card}): None {
    await this.driver.initiatePayment(
      this.enc('Job offer'),
      this.cardNumber(payment.card || 'valid'));
  }

  private cardNumber(card: Card): string {
    const cardNumbers: Record<Card, string> = {
      'valid': '4242424242424242',
      'expired': '4000000000000069',
      'insufficientFunds': '4000000000009995',
      'declined': '4000000000000002',
    };
    return cardNumbers[card];
  }

  async assertPaymentNotification(assertion: {expectedPaymentNotification: PaymentNotification}): None {
    assertEquals(assertion.expectedPaymentNotification,
      await this.driver.readPaymentNotification());
  }

  async assertPaymentStatus(assertion: {expectedPaymentStatus: PaymentStatus}): None {
    assertEquals(assertion.expectedPaymentStatus,
      await this.driver.readPaymentStatus());
  }

  async assertPlanBundleRemaining(assertion: {
    expectedRemainingJobOffers: number,
    expectedBundleName: PricingBundleName
  }): None {
    const bundle = await this.driver.findPlanBundle();
    assertEquals(assertion.expectedBundleName, bundle.bundleName);
    assertEquals(assertion.expectedRemainingJobOffers, bundle.remainingJobOffers);
  }

  async assertPlanBundleNone(): None {
    assertEquals(false, await this.driver.hasPlanBundle());
  }
}

type None = Promise<void>;
