<?php
namespace Neon2\Laravel;

use Illuminate\Support\Facades;
use Illuminate\Support\ServiceProvider;
use Neon2\JobBoardInteractor;

class RouteServiceProvider extends ServiceProvider {
    public function boot(): void {
        Facades\Route::post('/neon2/job-offers', function (JobBoardInteractor $listener) {
            $createdJobOffer = $listener->createJobOffer(
                request()->get('jobOfferTitle'),
                request()->get('jobOfferPlan'),
                request()->get('jobOfferDescription'));
            return response()->json($createdJobOffer, status:201);
        });
        Facades\Route::post('/neon2/job-offers/payment', function (JobBoardInteractor $listener) {
            $preparedPayment = $listener->preparePayment(
                request()->get('userId'),
                request()->get('paymentId'),
                2000);
            return response()->json($preparedPayment, status:201);
        });
        Facades\Route::patch('/neon2/job-offers', function (JobBoardInteractor $listener) {
            $listener->updateJobOffer(
                request()->get('jobOfferId'),
                request()->get('jobOfferTitle'));
            return response()->json([], status:201);
        });
        Facades\Route::post('/neon2/job-offers/redeem-bundle', function (JobBoardInteractor $listener) {
            $listener->redeemBundle(
                request()->get('jobOfferId'),
                request()->get('userId'));
            return response()->json([], status:201);
        });
        Facades\Route::post('/neon2/webhook', function (JobBoardInteractor $listener) {
            $listener->paymentWebhook(
                \file_get_contents('php://input'),
                $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '');
        });
        Facades\Route::get('/neon2/status', function (JobBoardInteractor $listener) {
            $status = $listener->paymentStatus(request()->query->get('paymentId'));
            return response()->json($status);
        });
    }
}
