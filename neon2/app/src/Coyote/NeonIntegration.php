<?php
namespace Neon2\Coyote;

use Neon2\JobBoard;
use Neon2\JobBoard\InvoiceInformation;
use Neon2\JobBoard\JobBoardGate;
use Neon2\JobBoard\JobOffer;
use Neon2\JobBoard\PlanBundle;
use Neon2\JobBoard\PlanBundleGate;
use Neon2\Payment\PaymentGate;
use Neon2\Payment\PaymentService;
use Neon2\Payment\PreparedPayment;
use Neon2\Request\JobOfferSubmit;

readonly class NeonIntegration implements Integration {
    private JobBoard $board;

    public function __construct(
        private JobBoardGate   $gate,
        private PlanBundleGate $planBundles,
        private PaymentService $paymentService,
        bool                   $testMode,
    ) {
        $this->board = new JobBoard(new PaymentGate(), $gate, new JobBoard\PlanBundleGate(), $testMode);
    }

    /**
     * @return JobOffer[]
     */
    public function listJobOffers(): array {
        return $this->gate->listJobOffers();
    }

    public function planBundle(?int $userId): PlanBundle {
        if ($userId === null) {
            return PlanBundle::notOwned();
        }
        if ($this->planBundles->hasBundle($userId)) {
            return PlanBundle::remaining(
                $this->planBundles->remainingJobOffers($userId),
                $this->planBundles->planBundleName($userId));
        }
        return PlanBundle::notOwned();
    }

    public function createJobOffer(string $jobOfferPlan, JobOfferSubmit $jobOffer): JobOffer {
        return $this->board->createJobOffer($jobOfferPlan, $jobOffer);
    }

    public function updateJobOffer(int $jobOfferId, JobOfferSubmit $jobOffer): void {
        $this->gate->updateJobOffer($jobOfferId, $jobOffer);
    }

    public function preparePayment(int $userId, int $amount, string $paymentId, InvoiceInformation $invoiceInfo): PreparedPayment {
        return $this->paymentService->preparePayment($userId, $amount, $paymentId);
    }
}
