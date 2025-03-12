<?php
require __DIR__ . '/../../../vendor/autoload.php';

use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades;
use Illuminate\Support\Facades\Route;
use Illuminate\View\View;
use Neon\Acceptance\SessionRepository;

Application::configure(__DIR__ . DIRECTORY_SEPARATOR . 'laravel')
    ->withRouting(function (): void {
        Route::middleware([
            AddQueuedCookiesToResponse::class,
            StartSession::class,
        ])->group(function () {
            Route::get('/integration/job-offers', function (Request $request, SessionRepository $repo) {
                $repo->add(
                    $request->query->get('jobOfferTitle'),
                    $request->query->get('jobOfferPublishDate'),
                    $request->query->get('jobOfferSalaryTo'));
                return \response(status:201);
            });
            Route::get('/', function (SessionRepository $repo): View {
                return view('application', [
                    'jobOffers' => $repo->all(),
                    'scriptUrl' => scriptUrl(),
                ]);
            });
            Route::get('/assets/{filename}', function (string $filename): Response {
                return response(viteDist("/assets/$filename"));
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

function scriptUrl(): string
{
    return '/' . viteManifest()['src/main.ts']['file'];
}

function viteManifest(): array
{
    return json_decode(viteDist('manifest.json'), true);
}

function viteDist(string $file): string
{
    return \file_get_contents(__DIR__ . "/../../web/dist/$file");
}
