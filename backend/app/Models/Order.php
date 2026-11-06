<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'discount_id',
        'total_amount',
        'shipping_address',
        'phone',
        'payment_method',
        'status',
    ];

    // Một đơn hàng có nhiều chi tiết đơn hàng
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Đơn hàng thuộc về một người dùng
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}