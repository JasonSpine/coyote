<?php
namespace Neon2;

use Coyote\Services\Guest;
use Illuminate\Database\Connection;

class ValueProposition {
    public function __construct(private Guest $guest, private Connection $connection) {}

    public function apply(int $jobOfferId, bool $accepted): void {
        $this->connection->table('guest_events')->insert([
            'guest_id'   => $this->guest->guestId,
            'event_name' => 'job_apply',
            'metadata'   => \json_encode([
                'jobOfferId' => $jobOfferId,
                'accepted'   => $accepted,
            ]),
            'created_at' => now(),
        ]);
    }
}
