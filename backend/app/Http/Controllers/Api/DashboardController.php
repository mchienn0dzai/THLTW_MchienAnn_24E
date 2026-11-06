<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        // Đếm tổng số user (loại trừ admin nếu admin có role = 1, giả sử thế)
        $totalUsers = User::count();
        
        // Đếm tổng số sản phẩm
        $totalProducts = Product::count();
        
        // Đếm số đơn hàng mới (Chờ xác nhận)
        $newOrders = Order::where('status', 'Chờ xác nhận')->count();
        
        // Tính tổng doanh thu (Chỉ tính các đơn đã Hoàn thành)
        $revenue = Order::where('status', 'Hoàn thành')->sum('total_amount');

        return response()->json([
            'total_users' => $totalUsers,
            'total_products' => $totalProducts,
            'new_orders' => $newOrders,
            'revenue' => (float) $revenue
        ], 200);
    }
}