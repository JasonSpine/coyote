export interface PaymentProvider {
  mountCardInput(cssSelector: string): void;
  unmountCardInput(): void;
  performPayment(paymentToken: string): Promise<PaymentNotification>;
}

export type PaymentNotification =
  |'accepted'
  |'declinedPayment'
  |'declinedCard'
  |'declinedInsufficientFunds'
  |'declinedCardExpired'
  |'unexpectedProviderResponse';
