<?php
namespace Neon;

readonly class JobOffer
{
    /**
     * @param string[] $locations
     * @param string[] $tagNames
     */
    public function __construct(
        public string    $title,
        public string    $url,
        public string    $publishDate,
        public ?int      $salaryFrom,
        public ?int      $salaryTo,
        public WorkMode  $workMode,
        public array     $locations,
        public ?string   $companyName,
        public ?string   $companyLogoUrl,
        public array     $tagNames,
        public LegalForm $legalForm,
    ) {}
}
