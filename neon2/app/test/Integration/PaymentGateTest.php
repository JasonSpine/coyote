<?php
namespace Test\Neon2\Integration;

use Neon2\Database;
use Neon2\Payment\PaymentGate;
use Neon2\Payment\PaymentStatus;
use PHPUnit\Framework\Attributes\Before;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

class PaymentGateTest extends TestCase {
    private PaymentGate $paymentGate;

    #[Before]
    public function initialize(): void {
        $this->paymentGate = new PaymentGate();
        $database = new Database();
        $database->execute('DELETE FROM payments;');
    }

    #[Test]
    public function newlyCreatedPayment_hasStatusAwaitingPayment(): void {
        $this->paymentGate->createPayment(42, 'payment-id');
        $this->assertSame(PaymentStatus::Awaiting, $this->paymentGate->readPaymentStatus('payment-id'));
    }

    #[Test]
    public function missingPayment_hasStatusAwaiting(): void {
        $status = $this->paymentGate->readPaymentStatus('missing');
        $this->assertSame(PaymentStatus::Awaiting, $status);
    }

    #[Test]
    public function updatesPaymentStatus(): void {
        $this->paymentGate->createPayment(42, 'payment-42');
        $this->paymentGate->updatePaymentStatus('payment-42', PaymentStatus::Completed);
        $this->assertSame(PaymentStatus::Completed, $this->paymentGate->readPaymentStatus('payment-42'));
    }
}
