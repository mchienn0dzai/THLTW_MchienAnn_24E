<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['items.product', 'user'])->latest('id')->get();
        return response()->json($orders, 200);
    }

    public function show($id)
    {
        $order = Order::with(['items.product', 'user'])->findOrFail($id);
        return response()->json($order, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'    => 'required|string|max:255',
            'phone'   => 'required|string|max:30',
            'address' => 'required|string|max:500',
            'items'   => 'required|array|min:1',
        ]);

        // Kiểm tra nếu user bị khóa thì không cho đặt hàng
        if ($request->filled('user_id')) {
            $u = User::find($request->user_id);
            if ($u && $u->is_blocked) {
                return response()->json(['message' => 'Tài khoản của bạn đã bị khóa, không thể đặt hàng!'], 403);
            }
        }
        if ($request->filled('email')) {
            $uByEmail = User::where('email', $request->email)->first();
            if ($uByEmail && $uByEmail->is_blocked) {
                return response()->json(['message' => 'Tài khoản gắn với email này đã bị khóa!'], 403);
            }
        }

        $cols = Schema::getColumnListing('orders');
        $orderData = [];

        $map = [
            'user_id'          => $request->user_id,
            'name'             => $request->name,
            'customer_name'    => $request->name,
            'email'            => $request->email ?? '',
            'customer_email'   => $request->email ?? '',
            'phone'            => $request->phone,
            'customer_phone'   => $request->phone,
            'address'          => $request->address,
            'shipping_address' => $request->address,
            'payment_method'   => $request->payment_method ?? 'COD',
            'total_amount'     => $request->total_amount ?? 0,
            'total'            => $request->total_amount ?? 0,
            'status'           => 'Chờ xác nhận',
            'note'             => $request->note ?? ($request->email ? 'Email: ' . $request->email : null),
        ];

        foreach ($map as $col => $val) {
            if (in_array($col, $cols) && $val !== null) {
                $orderData[$col] = $val;
            }
        }
        $orderData['created_at'] = now();
        $orderData['updated_at'] = now();

        $orderId = DB::table('orders')->insertGetId($orderData);

        $itemCols = Schema::getColumnListing('order_items');
        foreach ($request->items as $item) {
            $itemData = ['order_id' => $orderId, 'product_id' => $item['id'] ?? $item['product_id']];
            if (in_array('quantity', $itemCols)) $itemData['quantity'] = $item['qty'] ?? $item['quantity'] ?? 1;
            if (in_array('qty', $itemCols)) $itemData['qty'] = $item['qty'] ?? $item['quantity'] ?? 1;
            if (in_array('price', $itemCols)) $itemData['price'] = $item['price'] ?? 0;
            if (in_array('created_at', $itemCols)) $itemData['created_at'] = now();
            if (in_array('updated_at', $itemCols)) $itemData['updated_at'] = now();
            DB::table('order_items')->insert($itemData);
        }

        return response()->json([
            'message' => 'Đặt hàng thành công!',
            'order'   => Order::with(['items.product'])->find($orderId)
        ], 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $order->status = $request->input('status', $order->status);
        $order->save();
        return response()->json(['message' => 'Cập nhật trạng thái thành công', 'order' => $order], 200);
    }

    public function destroy($id)
    {
        DB::table('order_items')->where('order_id', $id)->delete();
        DB::table('orders')->where('id', $id)->delete();
        return response()->json(['message' => 'Đã xóa đơn hàng thành công'], 200);
    }
}