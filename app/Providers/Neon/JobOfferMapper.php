<?php
namespace Coyote\Providers\Neon;

use Coyote;
use Coyote\Job;
use Coyote\Job\Location;
use Neon\Currency;
use Neon\LegalForm;
use Neon\Rate;
use Neon\WorkExperience;
use Neon\WorkMode;
use Neon2\Request\ApplicationMode;
use Neon2\Request\HiringType;
use Neon2\Request\JobOfferSubmit;

readonly class JobOfferMapper {
    public function jobOfferFields(Coyote\Job $jobOffer): JobOfferSubmit {
        return new JobOfferSubmit(
            $jobOffer->title,
            $this->stripFormatting($jobOffer->description),
            $jobOffer->salary_from,
            $jobOffer->salary_to,
            !$jobOffer->is_gross,
            Currency::from($jobOffer->currency->name),
            Rate::from($jobOffer->rate),
            $this->neonLocations($jobOffer),
            $this->neonTagNames($jobOffer),
            $this->neonWorkMode($jobOffer),
            $this->neonLegalForm($jobOffer),
            $this->neonWorkExperience($jobOffer),
            $jobOffer->enable_apply ? ApplicationMode::_4programmers : ApplicationMode::ExternalAts,
            $jobOffer->email,
            $jobOffer->application_url,
            $jobOffer->firm->name,
            $this->companyLogoUrl($jobOffer),
            $jobOffer->firm->website,
            $this->stripFormatting($jobOffer->firm->description),
            $this->companyPhotoUrls($jobOffer->firm),
            $jobOffer->firm->youtube_url,
            $jobOffer->firm->employees,
            $jobOffer->firm->founded,
            'not-used',
            $jobOffer->firm->is_agency ? HiringType::Agency : HiringType::Direct,
        );
    }

    private function stripFormatting(?string $text): ?string {
        if ($text === null) {
            return null;
        }
        $formattedText = new FormattedText();
        return $formattedText->stripFormatting($text);
    }

    private function companyLogoUrl(Coyote\Job $jobOffer): ?string {
        $logo = $jobOffer->firm->logo;
        if ($logo->getFilename() && $logo->size() > 0) {
            return (string)$jobOffer->firm->logo->url();
        }
        return null;
    }

    private function companyPhotoUrls(Coyote\Firm $firm): array {
        return $firm->assets
            ->map(fn(Coyote\Models\Asset $asset): string => Coyote\Services\Assets\Url::make($asset))
            ->toArray();
    }

    private function neonWorkExperience(Coyote\Job $jobOffer): ?WorkExperience {
        return match ($jobOffer->seniority) {
            'student' => WorkExperience::Intern,
            'junior'  => WorkExperience::Junior,
            'mid'     => WorkExperience::MidLevel,
            'senior'  => WorkExperience::Senior,
            'lead'    => WorkExperience::Lead,
            'manager' => WorkExperience::Manager,
            null      => WorkExperience::NotProvided,
        };
    }

    private function neonLegalForm(Coyote\Job $jobOffer): LegalForm {
        return match ($jobOffer->employment) {
            'employment' => LegalForm::EmploymentContract,
            'mandatory'  => LegalForm::ContractOfMandate,
            'contract'   => LegalForm::ContractForSpecificTask,
            'b2b'        => LegalForm::BusinessToBusiness,
        };
    }

    /**
     * @return string[]
     */
    private function neonTagNames(Coyote\Job $jobOffer): array {
        return $jobOffer->tags->pluck('name')->toArray();
    }

    private function neonWorkMode(Job $jobOffer): WorkMode {
        if (!$jobOffer->is_remote) {
            return WorkMode::Stationary;
        }
        if ($jobOffer->remote_range === 100) {
            return WorkMode::FullyRemote;
        }
        return WorkMode::Hybrid;
    }

    private function neonLocations(Job $jobOffer): array {
        return $jobOffer->locations
            ->map(fn(Location $location): string => $location->city)
            ->filter(fn(string $city) => !empty($city))
            ->toArray();
    }
}
