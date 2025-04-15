<?php
namespace Test\Neon2\Integration;

use Neon2\JobBoard\PlanBundleGate;
use PHPUnit\Framework\Attributes\Before;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

class PlanBundleGateTest extends TestCase {
    private PlanBundleGate $planBundles;

    #[Before]
    public function initialize(): void {
        $this->planBundles = new PlanBundleGate();
    }

    #[Test]
    public function doesNotHaveBundle(): void {
        $this->assertFalse($this->planBundles->hasBundle(111));
    }

    #[Test]
    public function storePlanBundle(): void {
        $this->planBundles->setBundle(112, 0, '');
        $this->assertTrue($this->planBundles->hasBundle(112));
    }

    #[Test]
    public function storePlanBundleRemainingJobOffers(): void {
        $this->planBundles->setBundle(113, 2, '');
        $this->assertSame(2, $this->planBundles->remainingJobOffers(113));
    }

    #[Test]
    public function storePlanBundleName(): void {
        $this->planBundles->setBundle(114, 2, 'strategic');
        $this->assertSame('strategic', $this->planBundles->planBundleName(114));
    }

    #[Test]
    public function overridesPlanBundleName(): void {
        $this->planBundles->setBundle(115, 2, 'strategic');
        $this->planBundles->setBundle(115, 4, 'growth');
        $this->assertSame('growth', $this->planBundles->planBundleName(115));
        $this->assertSame(4, $this->planBundles->remainingJobOffers(115));
    }

    #[Test]
    public function storeRemainingJobOffersPerUser(): void {
        $this->planBundles->setBundle(116, 33, 'strategic');
        $this->planBundles->setBundle(117, 44, 'growth');
        $this->assertSame(33, $this->planBundles->remainingJobOffers(116));
        $this->assertSame(44, $this->planBundles->remainingJobOffers(117));
    }
}
