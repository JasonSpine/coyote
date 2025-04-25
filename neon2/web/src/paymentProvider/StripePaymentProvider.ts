import {PaymentIntentResult, Stripe, StripeCardElement, StripeError} from '@stripe/stripe-js';
import {loadStripe} from '@stripe/stripe-js/pure';
import {PaymentNotification, PaymentProvider} from './PaymentProvider';

export class StripePaymentProvider implements PaymentProvider {
  private readonly _runtime: Promise<PaymentProvider>;

  constructor(publishableKey: string) {
    this._runtime = this.loadRuntime(publishableKey);
  }

  private async loadRuntime(key: string): Promise<PaymentProvider> {
    return new StripeRuntime((await loadStripe(key))!);
  }

  mountCardInput(cssSelector: string): void {
    this._runtime.then(runtime => runtime.mountCardInput(cssSelector));
  }

  unmountCardInput(): void {
    this._runtime.then(runtime => runtime.unmountCardInput());
  }

  performPayment(paymentToken: string): Promise<PaymentNotification> {
    return this._runtime.then(runtime => runtime.performPayment(paymentToken));
  }
}

class StripeRuntime implements PaymentProvider {
  private readonly cardElement: StripeCardElement;

  constructor(private stripe: Stripe) {
    this.cardElement = stripe.elements().create('card');
  }

  public mountCardInput(cssSelector: string): void {
    this.cardElement.mount(cssSelector);
  }

  public unmountCardInput(): void {
    this.cardElement.unmount();
  }

  public async performPayment(paymentToken: string): Promise<PaymentNotification> {
    return this.parsePaymentResponse(await this.confirmCardPayment(paymentToken));
  }

  private confirmCardPayment(paymentToken: string): Promise<PaymentIntentResult> {
    return this.stripe.confirmCardPayment(paymentToken, {
      payment_method: {card: this.cardElement},
    });
  }

  private parsePaymentResponse(response: PaymentIntentResult): PaymentNotification {
    if (response.error) {
      return this.parseErrorResponse(response.error);
    }
    if (response.paymentIntent?.status === 'succeeded') {
      return 'accepted';
    }
    return 'unexpectedProviderResponse';
  }

  private parseErrorResponse(error: StripeError): PaymentNotification {
    if (error.code === 'expired_card') {
      return 'declinedCardExpired';
    }
    if (error.code === 'card_declined') {
      if (error.decline_code === 'generic_decline') {
        return 'declinedCard';
      }
      if (error.decline_code === 'insufficient_funds') {
        return 'declinedInsufficientFunds';
      }
    }
    return 'declinedPayment';
  }
}
