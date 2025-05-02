<?php
namespace Coyote\Providers\Neon;

use Coyote\Models\UserPlanBundle;
use Coyote\Repositories\Criteria\EagerLoading;
use Coyote\Repositories\Criteria\Job\IncludeSubscribers;
use Coyote\Repositories\Eloquent\JobRepository;
use Coyote\Services\Elasticsearch\Builders\Job\SearchBuilder;
use Illuminate\Support;
use Neon2\Coyote\Integration;
use Neon2\JobBoard\JobOffer;
use Neon2\JobBoard\PlanBundle;

readonly class CoyoteIntegration implements Integration {
    public function __construct(
        private JobOfferMapper $mapper,
        private JobRepository  $job,
        private SearchBuilder  $builder,
    ) {}

    /**
     * @return JobOffer[]
     */
    public function listJobOffers(): array {
        $userId = auth()->id() ?? null;
        return $this->job->findManyWithOrder($this->elasticSearchFetchJobOfferIds($userId))
            ->map($this->mapper->neonJobOffer(...))
            ->toArray();
    }

    private function elasticSearchFetchJobOfferIds(?int $userId): array {
        $this->builder->boostLocation(request()->attributes->get('geocode'));
        $this->builder->setSort(SearchBuilder::DEFAULT_SORT);
        $result = $this->job->search($this->builder);
        /** @var Support\Collection $source */
        $source = $result->getSource();
        $this->job->pushCriteria(new EagerLoading(['firm', 'firm.assets', 'locations', 'tags', 'currency']));
        $this->job->pushCriteria(new IncludeSubscribers($userId));
        if (count($source)) {
            $allPremium = $result->getAggregationHits('premium_listing', true);
            $premium = array_first($allPremium); // only one premium at the top
            if ($premium) {
                $source->prepend($premium);
            }
            return $source->pluck('id')->unique()->toArray();
        }
        return [];
    }

    public function planBundle(?int $userId): PlanBundle {
        if ($userId === null) {
            return PlanBundle::notOwned();
        }
        /** @var UserPlanBundle $bundle */
        $bundle = UserPlanBundle::query()
            ->where('user_id', '=', $userId)
            ->where('remaining', '>', '0')
            ->first();
        if ($bundle) {
            return PlanBundle::remaining($bundle->remaining, $bundle->plan->name);
        }
        return PlanBundle::notOwned();
    }
}
