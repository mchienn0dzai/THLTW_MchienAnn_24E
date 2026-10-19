<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class AdminUserController extends Controller
{
    public function index()
    {
        $users = User::latest('id')->get();
        $allOrders = Order::with(['items.product'])->latest('id')->get();

        $usersWithOrders = $users->map(function ($u) use ($allOrders) {
            $userOrders = $allOrders->filter(function ($o) use ($u) {
                return ($o->user_id && $o->user_id == $u->id)
                    || (!empty($u->email) && ($o->email === $u->email || $o->customer_email === $u->email))
                    || (!empty($u->phone) && ($o->phone === $u->phone || $o->customer_phone === $u->phone));
            })->values();

            $u->orders = $userOrders;
            $u->orders_count = $userOrders->count();
            return $u;
        });

        return response()->json($usersWithOrders, 200);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user, 200);
    }

    public function toggleBlock($id)
    {
        $user = User::findOrFail($id);
        $user->is_blocked = !$user->is_blocked;
        $user->save();

        return response()->json([
            'message' => $user->is_blocked ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản',
            'user'    => $user
        ], 200);
    }

    public function updateProfile(Request $request, $id)
    {
        $user = User::findOrFail($id);
        if ($user->is_blocked) {
            return response()->json(['message' => 'Tài khoản đã bị khóa!'], 403);
        }

        $cols = Schema::getColumnListing('users');
        $updateData = [];
        foreach (['name', 'phone', 'address'] as $field) {
            if ($request->has($field) && in_array($field, $cols)) {
                $updateData[$field] = $request->input($field);
            }
        }
        $user->update($updateData);

        return response()->json([
            'message' => 'Cập nhật hồ sơ thành công',
            'user'    => $user->fresh()
        ], 200);
    }
}