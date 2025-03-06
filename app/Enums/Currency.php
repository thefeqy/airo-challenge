<?php

namespace App\Enums;

enum Currency: string
{
    case EUR = 'EUR';
    case GBP = 'GBP';
    case USD = 'USD';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
