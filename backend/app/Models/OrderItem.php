<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'product_detail_id',
        'qty',
        'price',
    ];

    // Chi tiết đơn hàng thuộc về một sản phẩm
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}