<?php
namespace Neon2;

use Neon2\JobBoard\JobBoardGate;
use Neon2\JobBoard\JobOffer;
use Neon2\JobBoard\PlanBundleGate;
use Neon2\Payment\PaymentGate;
use Neon2\Payment\PaymentStatus;

readonly class JobBoard {
    public function __construct(
        private PaymentGate    $payments,
        private JobBoardGate   $jobBoardGate,
        private PlanBundleGate $planBundle,
        private bool           $testMode,
    ) {}

    public function testMode(): bool {
        return $this->testMode;
    }

    public function addJobOffer(string $jobOfferTitle, string $jobOfferPlan, string $jobOfferDescription): JobOffer {
        if ($jobOfferPlan === 'free') {
            return $this->jobBoardGate->addJobOffer(
                $jobOfferTitle,
                $jobOfferDescription,
                'free', 
                null);
        }
        return $this->jobBoardGate->addJobOffer(
            $jobOfferTitle,
            $jobOfferDescription,
            $jobOfferPlan,
            $this->generatePaymentId());
    }

    public function paymentUpdate(Payment\PaymentUpdate $paymentUpdate): void {
        if ($paymentUpdate->type === PaymentStatus::Completed) {
            $this->paymentCompleted($paymentUpdate);
        }
        if ($paymentUpdate->type === PaymentStatus::Failed) {
            $this->payments->updatePaymentStatus(
                $paymentUpdate->paymentId,
                PaymentStatus::Failed);
        }
    }

    private function paymentCompleted(Payment\PaymentUpdate $paymentUpdate): void {
        $this->payments->updatePaymentStatus($paymentUpdate->paymentId,
            PaymentStatus::Completed);
        $jobOfferId = $this->jobOfferId($paymentUpdate->paymentId);
        $this->jobBoardGate->publishJobOffer($jobOfferId);
        $this->setPlanBundle(
            $this->payments->paymentUserId($paymentUpdate->paymentId),
            $this->jobBoardGate->pricingPlanByPaymentId($paymentUpdate->paymentId));
    }

    private function generatePaymentId(): string {
        return \uniqId();
    }

    private function jobOfferId(string $paymentId): int {
        return $this->jobBoardGate->jobOfferIdByPaymentId($paymentId);
    }

    private function setPlanBundle(int $bundleOwnerUserId, string $planBundleName): void {
        if ($planBundleName !== 'premium') {
            $this->planBundle->setBundle(
                $bundleOwnerUserId,
                $this->remainingJobOffers($planBundleName),
                $planBundleName);
        }
    }

    private function remainingJobOffers(string $planBundleName): int {
        if ($planBundleName === 'strategic') {
            return 2;
        }
        if ($planBundleName === 'growth') {
            return 4;
        }
        return 19;
    }

    public function publishJobOfferUsingBundle(int $jobOfferId, int $userId): void {
        if (!$this->planBundle->hasBundle($userId)) {
            return;
        }
        $remainingJobOffers = $this->planBundle->remainingJobOffers($userId);
        if ($remainingJobOffers === 0) {
            return;
        }
        $this->jobBoardGate->publishJobOffer($jobOfferId);
        $this->planBundle->decreaseRemainingJobOffers($userId);
    }
}
