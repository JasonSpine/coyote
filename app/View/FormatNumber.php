<?php
namespace Coyote\View;

class FormatNumber {
    public function format(int $number): string {
        if ($number >= 1_000_000) {
            return round($number / 1_000_000, 1) . 'm';
        }
        if ($number > 950) {
            return \round($number / 1000) . 'k';
        }
        return "$number";
    }
}
