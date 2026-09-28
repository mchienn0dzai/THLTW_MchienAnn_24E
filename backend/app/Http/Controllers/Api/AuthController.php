<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;

class AuthController extends Controller
{
    // API Đăng ký tài khoản
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password), // Mã hóa mật khẩu
            'phone'    => $request->phone,
            'address'  => $request->address,
            'role'     => 0 // Mặc định 0 là Khách hàng
        ]);

        // Tạo token đăng nhập
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Đăng ký tài khoản thành công!',
            'data'    => $user,
            'token'   => $token
        ], 201);
    }

    // API Đăng nhập
    public function login(LoginRequest $request)
    {
        // 1. Tìm user theo email
        $user = User::where('email', $request->email)->first();

        // 2. Kiểm tra user có tồn tại và mật khẩu có khớp không
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email hoặc mật khẩu không chính xác!'
            ], 401);
        }

        // 3. Xóa token cũ (nếu muốn mỗi tài khoản chỉ đăng nhập 1 thiết bị)
        $user->tokens()->delete(); 

        // 4. Tạo token mới
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Đăng nhập thành công!',
            'data'    => $user,
            'token'   => $token
        ], 200);
    }

    // API Đăng xuất (Cần gửi kèm Token)
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        
        return response()->json([
            'message' => 'Đã đăng xuất thành công!'
        ], 200);
    }
}