<?php
namespace Neon;

class NeonApplication
{
    private array $offers = [];

    public function __construct(private string $basePath) {}

    public function htmlMarkup(): string
    {
        $jobOffers = json_encode($this->jobOffers());
        return <<<html
            <div id="vueApplication"></div>
            <script>var jobOffers = {$jobOffers};</script>
            <script src="{$this->scriptUrl()}"></script>        
            html;
    }

    public function addJobOffer(string $jobOfferTitle, string $publishDate, int $salaryTo, string $workMode): void
    {
        $this->offers[] = [
            'title'       => $jobOfferTitle,
            'publishDate' => $publishDate,
            'salaryTo'    => $salaryTo,
            'workMode'    => $workMode,
        ];
    }

    private function jobOffers(): array
    {
        return $this->offers;
    }

    private function scriptUrl(): string
    {
        return $this->url($this->viteManifest()['src/main.ts']['file']);
    }

    public function styleUrl(): string
    {
        return $this->url($this->viteManifest()['src/main.ts']['css'][0]);
    }

    private function url(string $path): string
    {
        return \rTrim($this->basePath, '/') . '/' . $path;
    }

    private function viteManifest(): array
    {
        return json_decode($this->viteFile('manifest.json'), true);
    }

    public function viteFile(string $file): string
    {
        return \file_get_contents(__DIR__ . "/../web/dist/$file");
    }
}
