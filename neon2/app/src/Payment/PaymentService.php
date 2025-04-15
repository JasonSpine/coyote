<?php
namespace Neon2\Payment;

use Neon2\Payment\Provider\PaymentProvider;

readonly class PaymentService {
    public function __construct(
        private PaymentGate     $gate,
        private PaymentProvider $provider,
    ) {}

    public function preparePayment(int $userId, int $amount, string $paymentId): PreparedPayment {
        $payment = $this->provider->prepareCardPayment($amount, $paymentId);
        $this->gate->createPayment($userId, $payment->paymentId);
        return $payment;
    }
}
