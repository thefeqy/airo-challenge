<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\QuotationCalculatorRequest;
use App\Http\Resources\QuotationResource;
use App\Services\QuotationService;
use Illuminate\Http\Request;

class QuotationCalculatorController extends Controller
{

    public function __construct(public readonly QuotationService $service)
    {
    }

    public function __invoke(QuotationCalculatorRequest $request)
    {
        try {
            $quotation = $this->service->calculateTotal(
                ages: $request->age,
                currencyId: $request->currency_id,
                startDate: $request->start_date,
                endDate: $request->end_date
            );

            return response()->json(new QuotationResource($quotation), 201);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th->getMessage()], 500);
        }
    }
}
