<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades;
use Illuminate\Support\ServiceProvider;
use Neon2\JobBoard;
use Neon2\Payment\PaymentGate;
use Neon2\Payment\PaymentService;
use Neon2\Payment\PaymentStatus;
use Neon2\Payment\Provider\Stripe;
use Neon2\Payment\Provider\StripeWebhook;
use Neon2\Payment\Provider\TestPaymentProvider;
use Neon2\Payment\Provider\TestPaymentWebhook;

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/../../app/vendor/autoload.php';

class CustomServiceProvider extends ServiceProvider {
    public function register(): void {}

    public function boot(): void {
        $gate = new PaymentGate();
        $jobBoardGate = new \Neon2\JobBoard\JobBoardGate();
        $planBundle = new JobBoard\PlanBundleGate();
        $jobBoardView = new \Neon2\JobBoardView($jobBoardGate, $planBundle);
        $board = new JobBoard($gate, $jobBoardGate, $planBundle, testMode:true);
        if ($board->testMode()) {
            $paymentProvider = new TestPaymentProvider();
            $paymentWebhook = new TestPaymentWebhook($paymentProvider);
        } else {
            $paymentProvider = new Stripe('sk_test_51RBWn0Rf5n1iRahJzOJ6tJvWNO6fwKBaN7O2uVdhSGxVFVAsCeBTDgL13UWJ3VEGGLJc1ntyC5oDq5QQbVByEY8j00aluGGN0L');
            $paymentWebhook = new StripeWebhook('whsec_W5t2VrjF8hVHk3Fp6bM4scZ5HyX9y4xB');
        }
        $paymentService = new PaymentService($gate, $paymentProvider);

        Facades\Route::post('/neon2/job-offers', function () use ($board) {
            $createdJobOffer = $board->addJobOffer(request()->get('jobOfferTitle'), request()->get('jobOfferPlan'));
            return response()->json($createdJobOffer, status:201);
        });
        Facades\Route::post('/neon2/job-offers/payment', function () use ($paymentService) {
            $payment = $paymentService->preparePayment(request()->get('userId'), 2000, request()->get('paymentId'));
            return response()->json([
                'providerReady' => $payment->providerReady,
                'paymentId'     => $payment->paymentId,
                'paymentToken'  => $payment->paymentToken,
            ], status:201);
        });
        Facades\Route::patch('/neon2/job-offers', function () use ($jobBoardGate) {
            $jobBoardGate->editJobOffer(request()->get('jobOfferId'), request()->get('jobOfferTitle'));
            return response()->json([], status:201);
        });
        Facades\Route::post('/neon2/job-offers/redeem-bundle', function () use ($board) {
            $board->publishJobOfferUsingBundle(request()->get('jobOfferId'), request()->get('userId'));
            return response()->json([], status:201);
        });
        Facades\Route::post('/neon2/webhook', function () use ($paymentWebhook, $board) {
            $paymentUpdate = $paymentWebhook->acceptPaymentUpdate(
                \file_get_contents('php://input'),
                $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '');
            if ($paymentUpdate) {
                $board->paymentUpdate($paymentUpdate);
            }
        });
        Facades\Route::get('/neon2/status', function () use ($gate) {
            $status = $gate->readPaymentStatus(request()->query->get('paymentId'));
            return response()->json(match ($status) {
                PaymentStatus::Completed => 'paymentComplete',
                PaymentStatus::Failed    => 'paymentFailed',
                PaymentStatus::Awaiting  => 'awaitingPayment',
            });
        });
        Facades\Route::get('/', function () use ($board, $jobBoardView) {
            return $jobBoardView->jobBoardView(
                $board->testMode(),
                request()->query->get('userId') ?? 1);
        });
        Facades\Route::get('/neon2/static/assets/{assetName}', function (string $assetName) {
            $asset = \realPath(__DIR__ . "/../../web/dist/assets/$assetName");
            if (file_exists($asset)) {
                return response()->file($asset);
            }
            abort(404);
        });
    }
}

Application::configure(__DIR__ . DIRECTORY_SEPARATOR . 'laravel')
    ->withProviders([CustomServiceProvider::class])
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
    ->create()
    ->handleRequest(Request::capture());
