<?php
namespace Neon\Acceptance;

readonly class JobOffer
{
    public function __construct(
        public string  $title,
        public string  $url,
        public string  $publishDate,
        public int     $salaryTo,
        public string  $workMode,
        public array   $locations,
        public ?string $companyName,
    ) {}
}
