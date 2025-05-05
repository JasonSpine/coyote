<?php
namespace Neon2;

readonly class JobBoardView {
    private Web\ViteManifest $vite;

    public function __construct(
        private \Neon2\Coyote\Integration  $integration,
        private \Neon2\Invoice\CountryGate $countries,
        private ?string                    $stripePublishableKey,
    ) {
        $this->vite = new \Neon2\Web\ViteManifest(__DIR__ . '/../../web/');
    }

    public function jobBoardView(bool $isTestMode, ?int $userId, ?string $userEmail, string $csrfToken): string {
        $backendInput = $this->backendInput($isTestMode, $userId, $userEmail, $csrfToken);
        $entryUrl = "/neon2/static/{$this->vite->scriptUrl()}";
        $styleUrl = "/neon2/static/{$this->vite->styleUrl()}";
        if ($isTestMode) {
            $resources = null;
        } else {
            $resources = '<link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Inter:400,500,700">';
        }
        $faLightUrl = "/neon2/static/{$this->vite->fontAwesomeLightUrl()}";
        $faRegularUrl = "/neon2/static/{$this->vite->fontAwesomeRegularUrl()}";
        $faSolidUrl = "/neon2/static/{$this->vite->fontAwesomeSolidUrl()}";
        return <<<html
            <html>
            <head>
              <meta name="viewport" content="width=device-width,initial-scale=1">
              <link rel="stylesheet" type="text/css" href="$styleUrl">
              <link rel="preload" as="font" type="font/woff2" crossorigin href="$faLightUrl">
              <link rel="preload" as="font" type="font/woff2" crossorigin href="$faRegularUrl">
              <link rel="preload" as="font" type="font/woff2" crossorigin href="$faSolidUrl">
              $resources
            </head>
            <body class="bg-body">
              <div id="neonApplication"></div>
              <script type="module" src="$entryUrl"></script>
              <script>var backendInput = $backendInput;</script>
            </body>
            <html>
            html;
    }

    private function encodeBackendInput(array $arr): string {
        return \json_encode($arr, \JSON_THROW_ON_ERROR);
    }

    private function backendInput(bool $isTestMode, ?int $userId, ?string $userEmail, string $csrfToken): string {
        return $this->encodeBackendInput([
            'jobOffers'                => $this->integration->listJobOffers(),
            'testMode'                 => $isTestMode,
            'planBundle'               => $this->integration->planBundle($userId),
            'userId'                   => $userId,
            'jobOfferApplicationEmail' => $userEmail,
            'csrfToken'                => $csrfToken,
            'stripePublishableKey'     => $this->stripePublishableKey,
            'paymentInvoiceCountries'  => $this->countries->invoiceCountries(),
        ]);
    }
}
