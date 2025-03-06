<?php

namespace App\Services;

use App\Models\Quotation;
use Carbon\Carbon;
use Exception;

class QuotationService
{
    private const FIXED_RATE = 3;
    private const AGE_GROUPS = [
        [18, 30, 0.6],
        [31, 40, 0.7],
        [41, 50, 0.8],
        [51, 60, 0.9],
        [61, 70, 1],
    ];

    /**
     * Calculate the total price of the quotation
     * @param string $ages
     * @param string $currencyId
     * @param string $startDate
     * @param string $endDate
     * @return Quotation
     * @throws Exception
     */
    public function calculateTotal(string $ages, string $currencyId, string $startDate, string $endDate): Quotation
    {
        try {
            $agesArray = explode(',', $ages);
            $tripLength = $this->getTripLength($startDate, $endDate);
            $total = $this->calculatePrices($agesArray, $tripLength);

            return Quotation::query()->create([
                'total' => $total,
                'currency_id' => $currencyId,
            ]);
        } catch (\Throwable $th) {
            throw new \RuntimeException($th->getMessage());
        }
    }

    /**
     * Get the length of the trip in days
     * @param string $startDate
     * @param string $endDate
     * @return int
     */
    private function getTripLength(string $startDate, string $endDate): int
    {
        return Carbon::parse($startDate)->diffInDays(Carbon::parse($endDate));
    }

    /**
     * Calculate the total price of the quotation
     * @param array $ages
     * @param int $tripLength
     * @return float
     * @throws Exception
     */
    private function calculatePrices(array $ages, int $tripLength): float
    {
        $total = 0;
        foreach($ages as $age) {
            $total += self::FIXED_RATE * $this->getAgeLoad($age) * $tripLength;
        }
        return $total;
    }

    /**
     * Get the load for the given age
     * @param int $age
     * @return float
     * @throws Exception
     */
    private function getAgeLoad(int $age): float {
        foreach (self::AGE_GROUPS as [$minAge, $maxAge, $load]) {
            if ($age >= $minAge && $age <= $maxAge) {
                return $load;
            }
        }

        throw new \Exception("Invalid age: $age");
    }
}
