<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    // Khai báo danh sách các cột CẤP PHÉP cho việc thêm/sửa hàng loạt
    protected $fillable = [
        'category_id',
        'brand_id',
        'name',
        'slug',
        'image',
        'price',
        'sale_price',
        'stock_qty',
        'description',
        'status',
    ];
}