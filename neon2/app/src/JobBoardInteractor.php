<?php
namespace Neon2;

use Neon2\Invoice\CountryGate;
use Neon2\JobBoard\InvoiceInformation;
use Neon2\JobBoard\JobBoardGate;
use Neon2\JobBoard\JobOffer;
use Neon2\Payment\PaymentGate;
use Neon2\Payment\PaymentService;
use Neon2\Payment\PaymentStatus;
use Neon2\Payment\PreparedPayment;
use Neon2\Payment\Provider\PaymentWebhook;
use Neon2\Payment\Provider\Stripe;
use Neon2\Payment\Provider\StripeWebhook;
use Neon2\Payment\Provider\TestPaymentProvider;
use Neon2\Payment\Provider\TestPaymentWebhook;
use Neon2\Request\JobOfferSubmit;

readonly class JobBoardInteractor {
    private JobBoard $board;
    private PaymentService $paymentService;
    private JobBoardGate $jobBoardGate;
    private JobBoardView $jobBoardView;
    private PaymentWebhook $paymentWebhook;
    private PaymentGate $gate;

    public function __construct(
        CountryGate    $countryGate,
        ?StripeSecrets $stripeSecrets,
        bool           $testMode,
    ) {
        $this->gate = new PaymentGate();
        $this->jobBoardGate = new JobBoardGate();
        $planBundle = new JobBoard\PlanBundleGate();
        $this->jobBoardView = new JobBoardView($this->jobBoardGate, $planBundle, $countryGate, $stripeSecrets?->publishableKey);
        $this->board = new JobBoard($this->gate, $this->jobBoardGate, $planBundle, $testMode);
        if ($this->board->testMode()) {
            $paymentProvider = new TestPaymentProvider();
            $this->paymentWebhook = new TestPaymentWebhook($paymentProvider);
        } else {
            $paymentProvider = new Stripe($stripeSecrets->secretKey);
            $this->paymentWebhook = new StripeWebhook($stripeSecrets->webhookSigningSecret);
        }
        $this->paymentService = new PaymentService($this->gate, $paymentProvider);
    }

    public function jobBoardView(?int $userId, string $email, string $csrfToken): string {
        return $this->jobBoardView->jobBoardView(
            $this->board->testMode(),
            $userId ?? 1,
            $email,
            $csrfToken);
    }

    public function createJobOffer(string $jobOfferPlan, JobOfferSubmit $jobOffer): JobOffer {
        return $this->board->createJobOffer($jobOfferPlan, $jobOffer);
    }

    public function updateJobOffer(int $jobOfferId, JobOfferSubmit $jobOffer): void {
        $this->jobBoardGate->updateJobOffer($jobOfferId, $jobOffer);
    }

    public function preparePayment(
        int                $userId,
        string             $paymentId,
        int                $amount,
        InvoiceInformation $invoiceInfo,
    ): PreparedPayment {
        return $this->paymentService->preparePayment($userId, $amount, $paymentId);
    }

    public function redeemBundle(int $jobOfferId, int $userId): void {
        $this->board->publishJobOfferUsingBundle($jobOfferId, $userId);
    }

    public function paymentWebhook(string $webhookPayload, string $stripeSignature): void {
        $paymentUpdate = $this->paymentWebhook->acceptPaymentUpdate($webhookPayload, $stripeSignature);
        if ($paymentUpdate) {
            $this->board->paymentUpdate($paymentUpdate);
        }
    }

    public function paymentStatus(string $paymentId): string {
        return match ($this->gate->readPaymentStatus($paymentId)) {
            PaymentStatus::Completed => 'paymentComplete',
            PaymentStatus::Failed    => 'paymentFailed',
            PaymentStatus::Awaiting  => 'awaitingPayment',
        };
    }
}
