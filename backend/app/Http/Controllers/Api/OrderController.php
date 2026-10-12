<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // 1. Hàm xử lý đặt hàng từ Frontend
    public function checkout(Request $request)
    {
        // Nhận dữ liệu từ Frontend gửi lên
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'total_amount' => 'required|numeric',
            'shipping_address' => 'required|string',
            'phone' => 'required|string|max:20',
            'payment_method' => 'required|string',
            'items' => 'required|array', // Mảng giỏ hàng
        ]);

        DB::beginTransaction();
        try {
            // 1. Tạo đơn hàng (Order)
            $order = Order::create([
                'user_id' => $validated['user_id'],
                'total_amount' => $validated['total_amount'],
                'shipping_address' => $validated['shipping_address'],
                'phone' => $validated['phone'],
                'payment_method' => $validated['payment_method'],
                'status' => 'Chờ xác nhận',
            ]);

            // 2. Tạo các chi tiết đơn hàng (Order Items)
            foreach ($validated['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['id'],
                    'qty' => $item['qty'],
                    'price' => $item['price'],
                ]);
            }

            DB::commit();
            return response()->json(['message' => 'Đặt hàng thành công!', 'order' => $order], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Lỗi đặt hàng: ' . $e->getMessage()], 500);
        }
    }

    // 2. Hàm lấy danh sách toàn bộ đơn hàng cho Admin
    public function index()
    {
        // Kéo theo dữ liệu bảng users và items (kèm products) để hiển thị chi tiết
        $orders = Order::with(['user', 'items.product'])
                        ->orderBy('created_at', 'desc')
                        ->get();
                        
        return response()->json($orders);
    }

    // 3. Hàm cập nhật trạng thái đơn hàng cho Admin
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string'
        ]);

        try {
            $order = Order::findOrFail($id);
            $order->status = $request->status;
            $order->save();

            return response()->json(['message' => 'Cập nhật trạng thái thành công', 'order' => $order]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi cập nhật: ' . $e->getMessage()], 500);
        }
    }
}