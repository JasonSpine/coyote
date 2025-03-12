<?php
require __DIR__ . '/../../../vendor/autoload.php';

use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades;
use Illuminate\Support\Facades\Route;

Application::configure(__DIR__ . DIRECTORY_SEPARATOR . 'laravel')
    ->withRouting(function (): void {
        Route::middleware([
            AddQueuedCookiesToResponse::class,
            StartSession::class,
        ])->group(function () {
            Route::get('/integration/job-offers', function (Request $request) {
                session()->put('values', \json_encode([...sessionJobOffers(), [
                    $request->query->get('jobOfferTitle'),
                    $request->query->get('jobOfferPublishDate'),
                    $request->query->get('jobOfferSalaryTo'),
                    $request->query->get('jobOfferWorkMode'),
                ]]));
                return \response(status:201);
            });
            Route::get('/', function (): Response {
                $neon = new \Neon\NeonApplication('/neon');
                $neon->addJobOffer('Swift Developer', '2023-03-03', 1400, 'remote');
                $neon->addJobOffer('Rust Developer', '2000-01-01', 1500, 'stationary');
                $neon->addJobOffer('Go Developer', '2012-02-02', 1000, 'stationary');
                foreach (sessionJobOffers() as [$title, $publish, $salaryTo, $workMode]) {
                    $neon->addJobOffer($title, $publish, $salaryTo, $workMode);
                }
                return response(<<<EOF
                    <html>
                    <head>
                        <link href="//fonts.googleapis.com/css?family=Inter:500,700" rel="stylesheet" type="text/css">
                        <link rel="stylesheet" href="{$neon->styleUrl()}">
                    </head>
                    <body class="bg-body">{$neon->htmlMarkup()}</body>
                    </html>
                    EOF,
                );
            });
            Route::get('/neon/assets/{filename}', function (string $filename): Response {
                $neon = new \Neon\NeonApplication('/neon');
                return response($neon->viteFile("/assets/$filename"));
            });
        });
    })
    ->booted(fn() => Facades\Config::set('app.debug', true))
    ->booted(function () {
        Facades\Config::set('session', [
            'driver'          => 'cookie',
            'cookie'          => 'neon',
            'path'            => '/',
            'domain'          => '',
            'lifetime'        => 120,
            'lottery'         => [2, 100],
            'expire_on_close' => false,
            'secure'          => false,
        ]);
    })
    ->booted(function () {
        $date = \date('Y-m-d.H-i-s');
        Facades\Config::set('logging', [
            'default'  => 'single',
            'channels' => [
                'single' => [
                    'driver' => 'single',
                    'path'   => "ERROR.$date.log",
                ],
            ],
        ]);
    })
    ->withExceptions()
    ->create()
    ->handleRequest(Request::capture());

function sessionJobOffers(): array
{
    return json_decode(session()->get('values', '[]'), true);
}
