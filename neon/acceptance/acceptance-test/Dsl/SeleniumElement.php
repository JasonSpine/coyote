<?php
namespace Neon\Acceptance\Test\Dsl;

use Facebook\WebDriver\Remote\RemoteWebElement;
use Facebook\WebDriver\WebDriverBy;

readonly class SeleniumElement
{
    public function __construct(private RemoteWebElement $element) {}

    public function text(): string
    {
        return $this->element->getText();
    }

    public function select(string $dropdownOption): void
    {
        $this->element->click();
        $this->element->findElement(WebDriverBy::xpath("//*[normalize-space()='$dropdownOption']"))->click();
    }

    public function click(): void
    {
        $this->element->click();
    }

    public function fill(string $text): void
    {
        $this->element->clear()->sendKeys($text);
    }

    public function check(bool $checked): void
    {
        $this->element->click();
    }
}
