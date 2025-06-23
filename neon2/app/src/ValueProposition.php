<?php
namespace Neon2;

use Coyote\Services\Guest;
use Illuminate\Database\Connection;

readonly class ValueProposition {
    public function __construct(private Guest $guest, private Connection $connection) {}

    public function event(string $eventName, array $metadata): void {
        $this->guest->setSetting('hasEvent', true);
        $this->connection->table('guest_events')->insert([
            'guest_id'   => $this->guest->guestId,
            'event_name' => $eventName,
            'metadata'   => \json_encode($metadata),
            'created_at' => now(),
        ]);
    }
}
