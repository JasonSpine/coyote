<?php
namespace Neon\Acceptance;

class SessionRepository
{
    public function all(): array
    {
        return json_decode(session()->get('values', '[]'), true, \JSON_THROW_ON_ERROR);
    }

    public function add(string $jobOfferTitle): void
    {
        session()->put('values', \json_encode([...$this->all(), $jobOfferTitle]));
    }
}
