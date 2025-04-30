<?php
namespace Neon2\Invoice;

use Neon2\Invoice;

class TestCountryGate implements CountryGate {
    public function invoiceCountries(): array {
        return [
            new Invoice\Country('PL', 'Polska'),
            new Invoice\Country('DE', 'Niemcy'),
            new Invoice\Country('UA', 'Ukraina'),
            new Invoice\Country('US', 'Stany Zjednoczone'),
        ];
    }
}
