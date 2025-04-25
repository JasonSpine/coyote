import {PaymentNotification, PaymentProvider} from './PaymentProvider';

export class StripePaymentProvider implements PaymentProvider {
  private readonly stripe: stripe.Stripe;
  private readonly cardElement: stripe.elements.Element;

  constructor(private publishableKey: string) {
    const stripe: stripe.StripeStatic = window['Stripe'];
    this.stripe = stripe(this.publishableKey);
    this.cardElement = this.stripe.elements().create('card');
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

  private confirmCardPayment(paymentToken: string): Promise<stripe.PaymentIntentResponse> {
    return this.stripe.confirmCardPayment(paymentToken, {
      payment_method: {card: this.cardElement},
    });
  }

  private parsePaymentResponse(response: stripe.PaymentIntentResponse): PaymentNotification {
    if (response.error) {
      return this.parseErrorResponse(response.error);
    }
    if (response.paymentIntent) {
      if (response.paymentIntent.status === 'succeeded') {
        return 'accepted';
      }
    }
    return 'unexpectedProviderResponse';
  }

  private parseErrorResponse(error: stripe.Error): PaymentNotification {
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
