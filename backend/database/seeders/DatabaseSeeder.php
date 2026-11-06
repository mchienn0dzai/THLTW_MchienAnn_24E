<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductDetail;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Seeder có thể chạy lại nhiều lần (dùng updateOrCreate theo slug/email), không bị lỗi trùng dữ liệu.
 *   php artisan migrate:fresh --seed     (xoá sạch rồi tạo lại)
 *   php artisan db:seed                  (chạy lại, không nhân đôi dữ liệu)
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Tài khoản (Admin & Khách)
        User::updateOrCreate(['email' => 'admin@gmail.com'], [
            'name' => 'Quản trị viên', 'password' => Hash::make('123456'),
            'role' => 1, 'phone' => '0999999999', 'address' => 'Hà Nội',
        ]);
        User::updateOrCreate(['email' => 'chien@example.com'], [
            'name' => 'Trần Minh Chiến', 'password' => Hash::make('123456'),
            'role' => 0, 'phone' => '0888888888', 'address' => 'TP.HCM',
        ]);

        // 2. Danh mục
        $categories = [
            1 => 'Điện thoại',
            2 => 'Máy tính bảng',
            3 => 'Laptop',
            4 => 'Tai nghe',
            5 => 'Đồng hồ thông minh',
            6 => 'Phụ kiện',
        ];
        $categoryIds = [];
        $order = 1;
        foreach ($categories as $key => $name) {
            $c = Category::updateOrCreate(
                ['slug' => \Illuminate\Support\Str::slug($name)],
                ['parent_id' => null, 'name' => $name, 'sort_order' => $order++, 'status' => 1]
            );
            $categoryIds[$key] = $c->id;
        }

        // 3. Thương hiệu
        $brands = [
            1 => 'Apple',
            2 => 'Samsung',
            3 => 'Xiaomi',
            4 => 'OPPO',
            5 => 'Sony',
            6 => 'Dell',
            7 => 'ASUS',
            8 => 'Logitech',
        ];
        $brandIds = [];
        foreach ($brands as $key => $name) {
            $b = Brand::updateOrCreate(
                ['slug' => \Illuminate\Support\Str::slug($name)],
                ['name' => $name, 'image' => null, 'status' => 1]
            );
            $brandIds[$key] = $b->id;
        }

        // 4. Sản phẩm: [mã danh mục, mã thương hiệu, tên, giá, giá khuyến mãi, tồn kho, mô tả]
        $products = [
            [1, 1, 'iPhone 15 Pro Max', 30000000, 28990000, 50, 'Điện thoại Apple cao cấp nhất, khung titan, chip A17 Pro.'],
            [1, 1, 'iPhone 15', 22990000, 21490000, 80, 'iPhone 15 với Dynamic Island, camera chính 48MP.'],
            [1, 2, 'Samsung Galaxy S24 Ultra', 33990000, 29990000, 40, 'Galaxy S24 Ultra, bút S Pen, camera 200MP, Galaxy AI.'],
            [1, 2, 'Samsung Galaxy A55 5G', 9990000, 8990000, 120, 'Galaxy A55 5G, màn hình Super AMOLED 120Hz, pin 5000mAh.'],
            [1, 3, 'Xiaomi 14', 22990000, 20990000, 60, 'Xiaomi 14 camera Leica, chip Snapdragon 8 Gen 3.'],
            [1, 4, 'OPPO Reno11 F 5G', 8990000, null, 90, 'OPPO Reno11 F 5G thiết kế mỏng nhẹ, sạc nhanh 67W.'],
            [2, 1, 'iPad Air M2 11 inch', 16990000, 15990000, 35, 'iPad Air chip M2, hỗ trợ Apple Pencil Pro.'],
            [2, 1, 'iPad Gen 10', 10990000, 9990000, 55, 'iPad thế hệ 10, màn hình Liquid Retina 10.9 inch.'],
            [2, 2, 'Samsung Galaxy Tab S9', 20990000, 18990000, 25, 'Galaxy Tab S9, màn hình Dynamic AMOLED 2X, chống nước IP68.'],
            [2, 3, 'Xiaomi Pad 6', 8990000, 7990000, 45, 'Xiaomi Pad 6 màn hình 144Hz, Snapdragon 870.'],
            [3, 1, 'MacBook Air M3 13 inch', 27990000, 26490000, 30, 'MacBook Air M3 mỏng nhẹ, pin đến 18 giờ.'],
            [3, 6, 'Dell XPS 13 Plus', 42990000, 39990000, 15, 'Dell XPS 13 Plus thiết kế tối giản, màn hình OLED 3.5K.'],
            [3, 7, 'ASUS Vivobook 15', 15990000, 13990000, 70, 'ASUS Vivobook 15, Core i5 thế hệ 13, RAM 16GB, SSD 512GB.'],
            [3, 7, 'ASUS ROG Strix G16', 38990000, 35990000, 20, 'Laptop gaming ASUS ROG Strix G16, RTX 4060, màn hình 165Hz.'],
            [4, 1, 'AirPods Pro 2', 6190000, 5490000, 100, 'AirPods Pro 2 chống ồn chủ động, cổng sạc USB-C.'],
            [4, 5, 'Sony WH-1000XM5', 8990000, 7490000, 40, 'Tai nghe chụp tai Sony WH-1000XM5 chống ồn hàng đầu.'],
            [4, 2, 'Samsung Galaxy Buds2 Pro', 4990000, 3490000, 85, 'Galaxy Buds2 Pro âm thanh Hi-Fi 24bit, chống ồn thông minh.'],
            [5, 1, 'Apple Watch Series 9', 10990000, 9990000, 45, 'Apple Watch Series 9 chip S9, màn hình sáng 2000 nit.'],
            [5, 2, 'Samsung Galaxy Watch6', 6990000, 5990000, 50, 'Galaxy Watch6 theo dõi sức khoẻ, giấc ngủ toàn diện.'],
            [5, 3, 'Xiaomi Smart Band 8', 990000, null, 200, 'Xiaomi Smart Band 8 màn hình AMOLED 1.62 inch, pin 16 ngày.'],
            [6, 8, 'Chuột Logitech MX Master 3S', 2490000, 2190000, 75, 'Chuột không dây Logitech MX Master 3S, cuộn MagSpeed.'],
            [6, 8, 'Bàn phím Logitech MX Keys S', 2690000, null, 60, 'Bàn phím không dây Logitech MX Keys S, đèn nền thông minh.'],
            [6, 1, 'Sạc nhanh Apple 20W USB-C', 590000, 490000, 300, 'Củ sạc nhanh Apple 20W cho iPhone và iPad.'],
            [6, 3, 'Pin dự phòng Xiaomi 20000mAh', 690000, 590000, 150, 'Pin sạc dự phòng Xiaomi 20000mAh hỗ trợ sạc nhanh 22.5W.'],
        ];
        foreach ($products as [$cat, $brand, $name, $price, $sale, $stock, $desc]) {
            $slug = \Illuminate\Support\Str::slug($name);
            Product::updateOrCreate(['slug' => $slug], [
                'category_id' => $categoryIds[$cat],
                'brand_id'    => $brandIds[$brand],
                'name'        => $name,
                'image'       => $slug . '.svg',   // file nằm ở backend/public/images/products/
                'price'       => $price,
                'sale_price'  => $sale,
                'stock_qty'   => $stock,
                'description' => $desc,
                'status'      => 1,
            ]);
        }

        // 5. Phân loại màu/dung lượng cho iPhone 15 Pro Max
        $iphone = Product::where('slug', 'iphone-15-pro-max')->first();
        if ($iphone) {
            ProductDetail::updateOrCreate(
                ['product_id' => $iphone->id, 'color' => 'Titan Tự nhiên', 'storage' => '256GB'], ['stock' => 30]
            );
            ProductDetail::updateOrCreate(
                ['product_id' => $iphone->id, 'color' => 'Titan Xanh', 'storage' => '512GB'], ['stock' => 20]
            );
        }

        // 6. Mã khuyến mãi
        \App\Models\Discount::updateOrCreate(['code' => 'WELCOME2026'], [
            'discount_percent' => 10, 'min_order_value' => 5000000,
            'start_date' => now(), 'end_date' => now()->addMonths(1),
            'usage_limit' => 100, 'status' => 1,
        ]);
    }
}
