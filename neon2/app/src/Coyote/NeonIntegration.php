<?php
namespace Neon2\Coyote;

use Neon2\JobBoard\JobBoardGate;
use Neon2\JobBoard\JobOffer;
use Neon2\JobBoard\PlanBundle;
use Neon2\JobBoard\PlanBundleGate;

readonly class NeonIntegration implements Integration {
    public function __construct(
        private JobBoardGate   $gate,
        private PlanBundleGate $planBundles,
    ) {}

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
}
