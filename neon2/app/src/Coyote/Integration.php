<?php
namespace Neon2\Coyote;

use Neon2\JobBoard\JobOffer;
use Neon2\JobBoard\PlanBundle;

interface Integration {
    /**
     * @return JobOffer[]
     */
    public function listJobOffers(): array;

    public function planBundle(?int $userId): PlanBundle;
}
