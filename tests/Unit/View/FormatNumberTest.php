<?php
namespace Tests\Unit\View;

use Coyote\View\FormatNumber;
use PHPUnit\Framework\Attributes\Before;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

class FormatNumberTest extends TestCase {
    private FormatNumber $format;

    #[Before]
    public function initialize(): void {
        $this->format = new FormatNumber();
    }

    #[Test]
    public function smallNumberIsFormatedAsIs(): void {
        $this->assertSame('512', $this->format->format(512));
    }

    #[Test]
    public function thousandIsFormattedAs1k(): void {
        $this->assertSame('1k', $this->format->format(1000));
    }

    #[Test]
    public function twoThousandsIsFormattedAs2k(): void {
        $this->assertSame('2k', $this->format->format(2000));
    }

    #[Test]
    public function bigNumberIsFormattedAsInteger(): void {
        $this->assertSame('2k', $this->format->format(2346));
    }

    #[Test]
    public function bigNumberIsRoundedUp(): void {
        $this->assertSame('3k', $this->format->format(2900));
    }

    #[Test]
    public function oneMillionIsFormatedAs1m(): void {
        $this->assertSame('1m', $this->format->format(1000 * 1000));
    }

    #[Test]
    public function twoMillionIsFormatedAs2m(): void {
        $this->assertSame('2m', $this->format->format(2 * 1000 * 1000));
    }

    #[Test]
    public function veryBigNumberIsFormattedAsSmallFraction(): void {
        $this->assertSame('3.6m', $this->format->format(3_576_789));
    }

    #[Test]
    public function almostThousandIs1k(): void {
        $this->assertSame('1k', $this->format->format(999));
        $this->assertSame('1k', $this->format->format(955));
    }
}
