import {BackendPaymentStatus, BackendPreparedPayment, JobBoardBackend} from "../backend";
import {InvoiceInformation, VatIdState} from "../main";
import {PaymentMethod, PaymentNotification, PaymentProvider} from "./PaymentProvider";

interface PaymentListener {
  paymentInitiationVatIdState(vatId: VatIdState): void;
  notificationReceived(notification: string): void;
  statusChanged(paymentId: string, status: PaymentStatus): void;
}

export type PaymentStatus = 'paymentComplete'|'paymentFailed';

export class PaymentService {
  private listeners: PaymentListener[] = [];

  constructor(private backend: JobBoardBackend, private provider: PaymentProvider) {}

  addEventListener(listener: PaymentListener) {
    this.listeners.push(listener);
  }

  async initiatePayment(paymentId: string, invoiceInfo: InvoiceInformation, paymentMethod: PaymentMethod): Promise<void> {
    const response = await this.backend.preparePayment(paymentId, invoiceInfo);
    this.listeners.forEach(listener => {
      const vatId = response.status === 'failedInvalidVatId' ? 'invalid' : 'valid';
      return listener.paymentInitiationVatIdState(vatId);
    });
    if (response.status === 'success') {
      const payment = response.preparedPayment!;
      this.updatePaymentNotification(await this.performPayment(payment, paymentMethod));
      this.updatePaymentStatus(paymentId, await this.readPaymentStatus(payment.paymentId));
    }
  }

  private async readPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    let counter = 0;
    while (true) {
      counter++;
      const status: BackendPaymentStatus = await this.backend.fetchPaymentStatus(paymentId);
      if (status !== 'awaitingPayment') {
        return status;
      }
      await new Promise(resolve => setTimeout(resolve, 500));
      if (counter >= 10) {
        break;
      }
    }
    return 'paymentFailed';
  }

  private performPayment(payment: BackendPreparedPayment, paymentMethod: PaymentMethod): Promise<PaymentNotification> {
    if (payment.providerReady) {
      return this.provider.performPayment(payment.paymentToken!, paymentMethod);
    }
    return Promise.resolve('unexpectedProviderResponse');
  }

  private updatePaymentNotification(notification: string): void {
    this.listeners.forEach(listener => listener.notificationReceived(notification));
  }

  private updatePaymentStatus(paymentId: string, status: PaymentStatus): void {
    this.listeners.forEach(listener => listener.statusChanged(paymentId, status));
  }
}
