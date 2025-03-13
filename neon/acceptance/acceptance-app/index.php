<?php
require __DIR__ . '/../../../vendor/autoload.php';

use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades;
use Illuminate\Support\Facades\Route;
use Neon\Acceptance\JobOffer;

Application::configure(__DIR__ . DIRECTORY_SEPARATOR . 'laravel')
    ->withRouting(function (): void {
        Route::middleware([
            AddQueuedCookiesToResponse::class,
            StartSession::class,
        ])->group(function () {
            Route::get('/integration/job-offers', function (Request $request) {
                sessionAddJobOffer(new JobOffer(
                    $request->get('jobOfferTitle'),
                    $request->get('jobOfferPublishDate'),
                    $request->get('jobOfferSalaryTo'),
                    $request->get('jobOfferWorkMode'),
                    $request->get('jobOfferLocations', []),
                ));
                return \response(status:201);
            });
            Route::get('/', function (): Response {
                $neon = new \Neon\NeonApplication('/neon');
                $neon->addJobOffer('Swift Developer', '2023-03-03', 4000, 'remote', ['New York']);
                $neon->addJobOffer('Rust Developer', '2000-01-01', 7500, 'stationary', ['London']);
                $neon->addJobOffer('Go Developer', '2012-02-02', 12500, 'stationary', ['Amsterdam']);
                foreach (sessionJobOffers() as $jobOffer) {
                    $neon->addJobOffer(
                        $jobOffer->title,
                        $jobOffer->publishDate,
                        $jobOffer->salaryTo,
                        $jobOffer->workMode,
                        $jobOffer->locations);
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

/**
 * @return JobOffer[]
 */
function sessionJobOffers(): array
{
    return \unserialize(session()->get('values', serialize([])));
}

function sessionAddJobOffer(JobOffer $jobOffer): void
{
    session()->put('values', \serialize([...sessionJobOffers(), $jobOffer]));
}
