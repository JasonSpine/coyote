<?php
namespace Neon2\Payment;

use Neon2\Database;

readonly class PaymentGate {
    private Database $database;

    public function __construct() {
        $this->database = new Database();
        $this->database->execute('CREATE TABLE IF NOT EXISTS payments (
            userId INTEGER NOT NULL,
            paymentId TEXT NOT NULL UNIQUE,
            status TEXT NOT NULL);');
    }

    public function createPayment(int $userId, string $paymentId): void {
        $this->database->execute('INSERT INTO payments (userId, paymentId, status) 
            VALUES (:userId, :paymentId, :status)
            ON CONFLICT (paymentId) DO NOTHING;', [
            'userId'    => $userId,
            'paymentId' => $paymentId,
            'status'    => $this->format(PaymentStatus::Awaiting),
        ]);
    }

    public function paymentUserId(string $paymentId): int {
        $values = $this->database->query('SELECT userId FROM payments WHERE paymentId = :paymentId;', [
            'paymentId' => $paymentId,
        ]);
        return $values[0]['userId'];
    }

    public function updatePaymentStatus(string $paymentId, PaymentStatus $status): void {
        $this->database->execute('UPDATE payments SET status = :status WHERE paymentId = :paymentId;', [
            'paymentId' => $paymentId,
            'status'    => $this->format($status),
        ]);
    }

    public function readPaymentStatus(string $paymentId): PaymentStatus {
        $values = $this->database->query('SELECT status FROM payments WHERE paymentId = :paymentId;', [
            'paymentId' => $paymentId,
        ]);
        if (empty($values)) {
            return PaymentStatus::Awaiting;
        }
        return $this->parse($values[0]['status']);
    }

    private function format(PaymentStatus $status): string {
        return match ($status) {
            PaymentStatus::Completed => 'completed',
            PaymentStatus::Failed    => 'failed',
            PaymentStatus::Awaiting  => 'awaiting',
        };
    }

    private function parse(string $status): PaymentStatus {
        return match ($status) {
            'completed' => PaymentStatus::Completed,
            'failed'    => PaymentStatus::Failed,
            'awaiting'  => PaymentStatus::Awaiting,
        };
    }
}
