<?php
namespace Neon2\JobBoard;

use Neon2\Database;

readonly class PlanBundleGate {
    private Database $database;

    public function __construct() {
        $this->database = new Database();
        $this->database->execute('CREATE TABLE IF NOT EXISTS plan_bundles (
            userId INTEGER NOT NULL,
            planBundleName TEXT NOT NULL,
            remainingJobOffers INTEGER NOT NULL);');
    }

    public function setBundle(int $userId, int $remainingJobOffers, string $planBundleName): void {
        $this->database->execute('DELETE FROM plan_bundles WHERE userId = :userId;', [
            'userId' => $userId,
        ]);
        $this->database->execute('INSERT INTO plan_bundles 
            (userId, planBundleName, remainingJobOffers)
            VALUES (:userId, :bundleName, :remaining);',
            [
                'userId'     => $userId,
                'bundleName' => $planBundleName,
                'remaining'  => $remainingJobOffers,
            ]);
    }

    public function hasBundle(int $userId): bool {
        $query = $this->database->query('SELECT * FROM plan_bundles WHERE userId = :userId;', [
            'userId' => $userId,
        ]);
        return !empty($query);
    }

    public function remainingJobOffers(int $userId): int {
        $query = $this->database->query('SELECT * FROM plan_bundles WHERE userId = :userId;', [
            'userId' => $userId,
        ]);
        return $query[0]['remainingJobOffers'];
    }

    public function planBundleName(int $userId): string {
        $query = $this->database->query('SELECT * FROM plan_bundles WHERE userId = :userId;', [
            'userId' => $userId,
        ]);
        return $query[0]['planBundleName'];
    }

    public function decreaseRemainingJobOffers(int $userId): void {
        $this->database->execute('UPDATE plan_bundles 
            SET remainingJobOffers = remainingJobOffers - 1 
            WHERE userId = :userId;',
            ['userId' => $userId]);
    }
}
