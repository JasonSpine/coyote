<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades;
use Neon2\Invoice;
use Neon2\JobBoardInteractor;
use Neon2\Laravel\RouteServiceProvider;

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/../../app/vendor/autoload.php';

$application = Application::configure(__DIR__ . '/laravel')
    ->withProviders([RouteServiceProvider::class])
    ->withRouting(function () {
        Facades\Route::get('/', function (JobBoardInteractor $interactor) {
            return $interactor->jobBoardView(
                request()->query->get('userId'),
                'user@email.com',
                'csrf-token');
        });
        Facades\Route::get('/neon2/static/assets/{assetName}', function (string $assetName) {
            $asset = \realPath(__DIR__ . "/../../web/dist/assets/$assetName");
            if (file_exists($asset)) {
                return response()->file($asset);
            }
            abort(404);
        });
    })
    ->booted(fn() => Facades\Config::set('app.debug', true))
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
    ->create();
$application->instance(JobBoardInteractor::class,
    new Neon2\JobBoardInteractor(
        countryGate:new Invoice\TestCountryGate(),
        stripeSecrets:null,
        testMode:true));
$application->handleRequest(Request::capture());
