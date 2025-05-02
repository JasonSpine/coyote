<?php
namespace Coyote\Providers\Neon;

use Coyote;
use Coyote\Events\PaymentPaid;
use Coyote\Job;
use Coyote\Models\UserPlanBundle;
use Coyote\Notifications\Job\CreatedNotification;
use Coyote\Repositories\Criteria\EagerLoading;
use Coyote\Repositories\Criteria\Job\IncludeSubscribers;
use Coyote\Repositories\Eloquent\JobRepository;
use Coyote\Services\Elasticsearch\Builders\Job\SearchBuilder;
use Coyote\Services\Invoice\CalculatorFactory;
use Coyote\Services\SubmitJobService;
use Illuminate\Support;
use Neon2\Coyote\Integration;
use Neon2\JobBoard;
use Neon2\JobBoard\JobOffer;
use Neon2\JobBoard\PaymentIntent;
use Neon2\JobBoard\PlanBundle;
use Neon2\Request\JobOfferSubmit;

readonly class CoyoteIntegration implements Integration {
    public function __construct(
        private JobOfferMapper   $mapper,
        private JobOfferUnmapper $unmapper,
        private JobRepository    $job,
        private SearchBuilder    $builder,
        private SubmitJobService $submitJob,
    ) {}

    /**
     * @return JobOffer[]
     */
    public function listJobOffers(): array {
        $userId = auth()->id() ?? null;
        return $this->job->findManyWithOrder($this->elasticSearchFetchJobOfferIds($userId))
            ->map(fn(Coyote\Job $job) => $this->neonJobOffer($job, true, null))
            ->toArray();
    }

    public function neonJobOffer(
        Coyote\Job     $jobOffer,
        bool           $published,
        ?PaymentIntent $intent,
    ): JobBoard\JobOffer {
        return new JobBoard\JobOffer(
            $jobOffer->id,
            $jobOffer->deadline + 1,
            $published ? JobBoard\JobOfferStatus::Published : JobBoard\JobOfferStatus::AwaitingPayment,
            $this->mapper->jobOfferFields($jobOffer),
            $intent);
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

    public function createJobOffer(string $jobOfferPlan, JobOfferSubmit $jobOffer): JobOffer {
        $user = $this->loggedUser();
        $job = new Job();
        $job->plan_id = $this->unmapper->planId($jobOfferPlan);
        $job->fill($this->unmapper->jobOfferInput($user, $jobOffer));
        $job->firm->fill($this->unmapper->companyInput($user, $jobOffer));
        $job->firm->user_id = $user->id;
        $this->submitJob->submitJobOffer($user, $job);
        $job->firm->assets()->saveMany($this->unmapper->coyoteCompanyPhotoAssets($jobOffer));
        $job->user->notify(new CreatedNotification($job));
        $payment = $job->getUnpaidPayment();
        if (!$payment->plan->price) {
            event(new PaymentPaid($payment));
            return $this->neonJobOffer($job, true, null);
        }
        return $this->neonJobOffer($job, false, $this->paymentIntent($payment));
    }

    private function loggedUser(): Coyote\User {
        if (auth()->check()) {
            /** @var Coyote\User $user */
            $user = auth()->user();
            return $user;
        }
        abort(403);
    }

    private function paymentIntent(Coyote\Payment $payment): PaymentIntent {
        $calculator = CalculatorFactory::payment($payment);
        return new PaymentIntent(
            $payment->id,
            (int)($calculator->netPrice() * 100),
            (int)($calculator->vatPrice() * 100));
    }

    public function updateJobOffer(int $jobOfferId, JobOfferSubmit $jobOffer): void {
        $user = $this->loggedUser();
        $job = Job::query()->find($jobOfferId);
        if (!$user->can('update', $job)) {
            abort(403);
        }
        $job->fill($this->unmapper->jobOfferInput($user, $jobOffer));
        $job->firm->user_id = $user->id;
        $job->firm->fill($this->unmapper->companyInput($user, $jobOffer));
        $job->firm->save();
        $this->submitJob->submitJobOffer($user, $job);
    }
}
