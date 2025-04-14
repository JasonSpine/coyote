import {JobOfferPayment, JobOfferPayments} from "../src/jobOfferPayments";
import {assertEquals, describe, test} from "./assertion";

describe('Job offers association with payments.', () => {
  test('Read payment id for a job offer id', () => {
    const payments = new JobOfferPayments();
    const jobOffer: JobOfferPayment = {
      paymentId: 'payment',
      jobOfferId: 42,
    };
    payments.addJobOffer(jobOffer);
    assertEquals(42, payments.jobOfferId('payment'));
  });
  test('Read job offer id by a payment id', () => {
    const payments = new JobOfferPayments();
    const jobOffer: JobOfferPayment = {
      paymentId: 'payment',
      jobOfferId: 25,
    };
    payments.addJobOffer(jobOffer);
    assertEquals('payment', payments.paymentId(25));
  });
  test('Read job pricing plan by payment id', () => {
    const payments = new JobOfferPayments();
    const jobOffer: JobOfferPayment = {
      paymentId: 'payment-id',
      jobOfferId: 25,
      pricingPlan: 'growth',
    };
    payments.addJobOffer(jobOffer);
    assertEquals('growth', payments.pricingPlan('payment-id'));
  });
});
