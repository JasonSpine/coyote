import {PricingPlan} from "./main";

export class JobOfferPayments {
  private payments: JobOfferPayment[] = [];

  addJobOffer(payment: JobOfferPayment): void {
    if (payment.paymentId === null) {
      throw new Error('Failed to accept job offer payment without paymentId.');
    }
    this.payments.push(payment);
  }

  jobOfferId(paymentId: string): number {
    return this.jobOffer(paymentId).jobOfferId;
  }

  pricingPlan(paymentId: string): PricingPlan {
    return this.jobOffer(paymentId).pricingPlan;
  }

  paymentId(jobOfferId: number): string {
    return this.payments.find(payment => payment.jobOfferId === jobOfferId)!.paymentId;
  }

  private jobOffer(paymentId: string): JobOfferPayment {
    return this.payments.find(payment => payment.paymentId === paymentId)!;
  }
}

export interface JobOfferPayment {
  jobOfferId: number;
  paymentId: string;
  pricingPlan: PricingPlan;
}
