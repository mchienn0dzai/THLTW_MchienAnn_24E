<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

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

    protected $casts = [
        'price'      => 'float',
        'sale_price' => 'float',
        'stock_qty'  => 'integer',
        'status'     => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function details(): HasMany
    {
        return $this->hasMany(ProductDetail::class);
    }
}
