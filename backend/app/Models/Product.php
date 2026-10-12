<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes; // Bật tính năng Thùng rác

    protected $fillable = [
        'category_id', 'brand_id', 'name', 'slug', 
        'image', 'price', 'sale_price', 'stock_qty', 
        'description', 'status'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }
}