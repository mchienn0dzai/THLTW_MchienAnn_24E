<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'phone'    => 'nullable|string|max:20',
            'address'  => 'nullable|string|max:255',
        ]);

        $user = User::create([
            'name'       => $data['name'],
            'email'      => $data['email'],
            'password'   => Hash::make($data['password']),
            'phone'      => $data['phone'] ?? null,
            'address'    => $data['address'] ?? null,
            // ĐÃ SỬA LỖI Ở ĐÂY: Lưu role là số 0 thay vì chữ 'customer'
            'role'       => 0, 
            'is_blocked' => false,
        ]);

        return response()->json([
            'message' => 'Đăng ký thành công',
            'user'    => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Email hoặc mật khẩu không chính xác!'], 401);
        }

        // KIỂM TRA KHÓA TÀI KHOẢN THẬT SỰ
        if ($user->is_blocked) {
            return response()->json([
                'message' => 'Tài khoản của bạn đã bị Quản trị viên khóa! Vui lòng liên hệ hỗ trợ.'
            ], 403);
        }

        // Đồng bộ phân quyền cho Frontend (nếu role = 1 thì đổi thành chữ 'admin')
        if ($user->role == 1) {
            $user->role = 'admin';
        } else {
            $user->role = 'customer';
        }

        $token = method_exists($user, 'createToken') ? $user->createToken('auth_token')->plainTextToken : 'demo-token-' . $user->id;

        return response()->json([
            'message' => 'Đăng nhập thành công',
            'token'   => $token,
            'user'    => $user,
        ], 200);
    }
}