<?php
namespace Neon;

readonly class Salary
{
    public function __construct(
        public int      $rangeFrom,
        public int      $rangeTo,
        public Currency $currency,
        public Rate     $rate,
        public bool     $isNet,
    ) {}
}
