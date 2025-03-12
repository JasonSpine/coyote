<?php
namespace Neon\Acceptance\Test\Dsl;

use Facebook\WebDriver\Remote\RemoteWebElement;
use Facebook\WebDriver\WebDriverSelect;

readonly class SeleniumElement
{
    public function __construct(private RemoteWebElement $element) {}

    public function text(): string
    {
        return $this->element->getText();
    }

    public function select(string $dropdownOption): void
    {
        $select = new WebDriverSelect($this->element);
        $select->selectByVisibleText($dropdownOption);
    }

    public function click(): void
    {
        $this->element->click();
    }

    public function fill(string $text): void
    {
        $this->element->clear()->sendKeys($text);
    }
}
