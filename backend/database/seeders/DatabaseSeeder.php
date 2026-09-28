<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        // 1. Dữ liệu Tài khoản (Admin & Khách)
        DB::table('users')->insert([
            ['name' => 'Quản trị viên', 'email' => 'admin@gmail.com', 'password' => Hash::make('123456'), 'role' => 1, 'phone' => '0999999999', 'address' => 'Hà Nội', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Trần Minh Chiến', 'email' => 'chien@example.com', 'password' => Hash::make('123456'), 'role' => 0, 'phone' => '0888888888', 'address' => 'TP.HCM', 'created_at' => $now, 'updated_at' => $now]
        ]);

        // 2. Dữ liệu Danh mục & Thương hiệu
        DB::table('categories')->insert([
            ['id' => 1, 'parent_id' => null, 'name' => 'Điện thoại', 'slug' => 'dien-thoai', 'sort_order' => 1, 'status' => 1, 'created_at' => $now, 'updated_at' => $now]
        ]);
        DB::table('brands')->insert([
            ['id' => 1, 'name' => 'Apple', 'slug' => 'apple', 'image' => null, 'status' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 2, 'name' => 'Samsung', 'slug' => 'samsung', 'image' => null, 'status' => 1, 'created_at' => $now, 'updated_at' => $now]
        ]);

        // 3. Dữ liệu Sản phẩm
        DB::table('products')->insert([
            ['id' => 1, 'category_id' => 1, 'brand_id' => 1, 'name' => 'iPhone 15 Pro Max', 'slug' => 'iphone-15-pro-max', 'image' => 'iphone15.jpg', 'price' => 30000000, 'sale_price' => 28990000, 'stock_qty' => 50, 'description' => 'Điện thoại Apple cao cấp nhất', 'status' => 1, 'created_at' => $now, 'updated_at' => $now]
        ]);

        // 4. Dữ liệu Phân loại (Chi tiết màu sắc/dung lượng)
        DB::table('product_details')->insert([
            ['product_id' => 1, 'color' => 'Titan Tự nhiên', 'storage' => '256GB', 'stock' => 30, 'created_at' => $now, 'updated_at' => $now],
            ['product_id' => 1, 'color' => 'Titan Xanh', 'storage' => '512GB', 'stock' => 20, 'created_at' => $now, 'updated_at' => $now]
        ]);

        // 5. Dữ liệu Mã khuyến mãi
        DB::table('discounts')->insert([
            ['code' => 'WELCOME2026', 'discount_percent' => 10, 'min_order_value' => 5000000, 'start_date' => $now, 'end_date' => $now->copy()->addMonths(1), 'usage_limit' => 100, 'status' => 1, 'created_at' => $now, 'updated_at' => $now]
        ]);
    }
}