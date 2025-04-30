<?php
namespace Test\Neon2\Integration;

use Neon\Currency;
use Neon\LegalForm;
use Neon\Rate;
use Neon\WorkExperience;
use Neon\WorkMode;
use Neon2\JobBoard\JobBoardGate;
use Neon2\JobBoard\JobOffer;
use Neon2\JobBoard\JobOfferStatus;
use Neon2\JobBoard\PaymentIntent;
use Neon2\Request\ApplicationMode;
use Neon2\Request\HiringType;
use Neon2\Request\JobOfferSubmit;
use PHPUnit\Framework\Attributes\Before;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

class JobBoardGateTest extends TestCase {
    private JobBoardGate $board;

    #[Before]
    public function initialize(): void {
        $this->board = new JobBoardGate();
        $this->board->clear();
    }

    #[Test]
    public function emptyOffers(): void {
        $this->assertEquals([], $this->board->listJobOffers());
    }

    #[Test]
    public function addJobOffer(): void {
        $this->addFreeOffer('Foo');
        [$jobOffer] = $this->board->listJobOffers();
        $this->assertEquals('Foo', $jobOffer->fields->title);
    }

    #[Test]
    public function newIdIsGeneratedForNewJob(): void {
        $this->addFreeOffer('Foo');
        $this->addFreeOffer('Bar');
        [$jobOffer1, $jobOffer2] = $this->board->listJobOffers();
        $this->assertNotEquals($jobOffer1->id, $jobOffer2->id);
    }

    #[Test]
    public function editJobOffer(): void {
        $jobOffer = $this->addFreeOffer('New title');
        $this->board->updateJobOffer($jobOffer->id, $this->fields('New title'));
        [$jobOffer] = $this->board->listJobOffers();
        $this->assertEquals('New title', $jobOffer->fields->title);
    }

    #[Test]
    public function payingPaymentOnPaidJobOfferChangesStatusToPublished(): void {
        $offer = $this->addPaidOffer('Foo');
        $this->board->publishJobOffer($offer->id);
        [$jobOffer] = $this->board->listJobOffers();
        $this->assertEquals(JobOfferStatus::Published, $jobOffer->status);
    }

    #[Test]
    public function readJobOfferIdByPaymentId(): void {
        $jobOffer = $this->addJobOfferWithPaymentId('', 'payment-id', 'premium');
        $this->assertEquals(
            $jobOffer->id,
            $this->board->jobOfferIdByPaymentId('payment-id'));
    }

    #[Test]
    public function readPricingPlanByPaymentId(): void {
        $this->addJobOfferWithPaymentId('', 'payment-id-123', 'scale');
        $this->assertSame('scale', $this->board->pricingPlanByPaymentId('payment-id-123'));
    }

    private function addFreeOffer(string $title): JobOffer {
        return $this->addJobOfferWithPaymentId($title, null, 'free');
    }

    private function addPaidOffer(string $title): JobOffer {
        return $this->addJobOfferWithPaymentId($title, 'payment-id', 'premium');
    }

    private function addJobOfferWithPaymentId(string $title, ?string $paymentId, string $pricingPlan): JobOffer {
        return $this->board->createJobOffer(
            $this->fields($title),
            $pricingPlan,
            1,
            JobOfferStatus::Published,
            $paymentId
                ? new PaymentIntent($paymentId, 0, 0)
                : null);
    }

    private function fields(string $title): JobOfferSubmit {
        return new JobOfferSubmit(
            $title,
            null,
            null,
            null,
            false,
            Currency::PLN,
            Rate::Monthly,
            [],
            [],
            WorkMode::Hybrid,
            LegalForm::BusinessToBusiness,
            WorkExperience::Intern,
            ApplicationMode::_4programmers,
            null,
            null,
            null,
            null,
            null,
            null,
            [],
            null,
            null,
            null,
            null,
            HiringType::Direct,
        );
    }
}
