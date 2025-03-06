<?php

use App\Http\Controllers\Api\QuotationCalculatorController;
use Illuminate\Support\Facades\Route;

Route::post('/quotation', QuotationCalculatorController::class)
    ->name('quotation')
    ->middleware('auth:sanctum');
