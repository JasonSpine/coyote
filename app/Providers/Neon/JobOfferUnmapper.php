<?php
namespace Coyote\Providers\Neon;

use Coyote;
use Coyote\User;
use Neon;
use Neon\LegalForm;
use Neon\WorkExperience;
use Neon\WorkMode;
use Neon2\Request\ApplicationMode;
use Neon2\Request\HiringType;
use Neon2\Request\JobOfferSubmit;

class JobOfferUnmapper {
    public function jobOfferInput(User $owner, JobOfferSubmit $jobOffer): array {
        return [
            'user_id'         => $owner->id,
            'title'           => $jobOffer->title,
            'description'     => $jobOffer->description,
            'salary_from'     => $jobOffer->salaryRangeFrom,
            'salary_to'       => $jobOffer->salaryRangeTo,
            'is_gross'        => !$jobOffer->salaryIsNet,
            'currency_id'     => $this->coyoteCurrencyId($jobOffer->salaryCurrency),
            'rate'            => $jobOffer->salaryRate->value,
            'locations'       => \array_map(
                fn(string $location) => ['country' => 'unknown', 'city' => $location, 'latitude' => 50.0, 'longitude' => 19.0, 'label' => "$location, unknown"],
                $jobOffer->locations),
            'tags'            => $this->coyoteTagNames($jobOffer->tagNames),
            'is_remote'       => $this->coyoteRemoteRange($jobOffer->workMode) > 0,
            'remote_range'    => $this->coyoteRemoteRange($jobOffer->workMode),
            'employment'      => $this->coyoteLegalForm($jobOffer->legalForm),
            'seniority'       => $this->coyoteWorkExperience($jobOffer->experience),
            'enable_apply'    => $this->coyoteApplicationMode($jobOffer->applicationMode),
            'apply_type'      => $this->coyoteApplicationMode($jobOffer->applicationMode) ? 'service' : 'external',
            'email'           => $jobOffer->applicationEmail,
            'application_url' => $jobOffer->applicationExternalAts,
            'features'        => [],
        ];
    }

    public function companyInput(User $owner, JobOfferSubmit $jobOffer): array {
        return [
            'user_id'     => $owner->id,
            'name'        => $jobOffer->companyName,
            'slug'        => str_slug($jobOffer->companyName),
            'logo'        => $jobOffer->companyLogoUrl,
            'website'     => $jobOffer->companyWebsiteUrl,
            'description' => $jobOffer->companyDescription,
            'youtube_url' => $jobOffer->companyVideoUrl,
            'employees'   => $jobOffer->companySizeLevel,
            'founded'     => $jobOffer->companyFundingYear,

            'country_id'    => null,
            'city'          => null,
            'street'        => $jobOffer->companyAddress,
            'street_number' => null,
            'postcode'      => null,
            'latitude'      => null,
            'longitude'     => null,

            'is_agency' => $jobOffer->companyHiringType === HiringType::Agency,
            'benefits'  => [],
        ];
    }

    public function planId(string $jobOfferPlan): int {
        return Coyote\Plan::query()
            ->where('is_active', true)
            ->where('name', \ucFirst($jobOfferPlan))
            ->firstOrFail('id')
            ->id;
    }

    private function coyoteCurrencyId(Neon\Currency $currency): mixed {
        return Coyote\Currency::query()
            ->where('name', $currency->value)
            ->firstOrFail('id')
            ->id;
    }

    private function coyoteTagNames(array $tagNames): array {
        return \array_map(
            fn(string $tagName) => ['name' => $tagName, 'priority' => 2],
            $tagNames);
    }

    private function coyoteRemoteRange(Neon\WorkMode $workMode): int {
        return match ($workMode) {
            WorkMode::Stationary  => 0,
            WorkMode::Hybrid      => 50,
            WorkMode::FullyRemote => 100,
        };
    }

    private function coyoteLegalForm(Neon\LegalForm $legalForm): string {
        return match ($legalForm) {
            LegalForm::EmploymentContract      => 'employment',
            LegalForm::ContractOfMandate       => 'mandatory',
            LegalForm::ContractForSpecificTask => 'contract',
            LegalForm::BusinessToBusiness      => 'b2b',
        };
    }

    private function coyoteWorkExperience(Neon\WorkExperience $experience): ?string {
        return match ($experience) {
            WorkExperience::Intern      => 'student',
            WorkExperience::Junior      => 'junior',
            WorkExperience::MidLevel    => 'mid',
            WorkExperience::Senior      => 'senior',
            WorkExperience::Lead        => 'lead',
            WorkExperience::Manager     => 'manager',
            WorkExperience::NotProvided => null,
        };
    }

    private function coyoteApplicationMode(\Neon2\Request\ApplicationMode $applicationMode): bool {
        return $applicationMode === ApplicationMode::_4programmers;
    }

    public function coyoteCompanyPhotoAssets(JobOfferSubmit $jobOffer): array {
        return Coyote\Models\Asset::query()
            ->whereIn('path', \array_map(
                $this->assetPath(...),
                $jobOffer->companyPhotoUrls))
            ->get()
            ->toArray();
    }

    private function assetPath(mixed $photoUrl): string {
        return \explode('/uploads/', $photoUrl)[1];
    }
}
