<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    protected $fillable = [
        'code', 'discount_percent', 'min_order_value',
        'start_date', 'end_date', 'usage_limit', 'status',
    ];
}
