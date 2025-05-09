<?php
namespace Neon2\Request;

use Neon\Currency;
use Neon\LegalForm;
use Neon\Rate;
use Neon\WorkExperience;
use Neon\WorkMode;

readonly class JobOfferSubmit {
    /**
     * @param JobOfferLocation[] $locations
     * @param string[] $tagNames
     * @param string[] $companyPhotoUrls
     */
    public function __construct(
        public string            $title,
        public ?string           $description,
        public ?int              $salaryRangeFrom,
        public ?int              $salaryRangeTo,
        public bool              $salaryIsNet,
        public Currency          $salaryCurrency,
        public Rate              $salaryRate,
        public array             $locations,
        public array             $tagNames,
        public WorkMode          $workMode,
        public LegalForm         $legalForm,
        public WorkExperience    $experience,
        public ApplicationMode   $applicationMode,
        public ?string           $applicationEmail,
        public ?string           $applicationExternalAts,
        public ?string           $companyName,
        public ?string           $companyLogoUrl,
        public ?string           $companyWebsiteUrl,
        public ?string           $companyDescription,
        public array             $companyPhotoUrls,
        public ?string           $companyVideoUrl,
        public ?int              $companySizeLevel,
        public ?int              $companyFundingYear,
        public ?JobOfferLocation $companyAddress,
        public HiringType        $companyHiringType,
    ) {}
}
