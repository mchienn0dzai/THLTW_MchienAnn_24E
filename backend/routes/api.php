<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;

// --- Xác thực ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', fn (\Illuminate\Http\Request $r) => $r->user());
});

// --- CÁC ROUTE CHO THÙNG RÁC (Bắt buộc phải đặt trước apiResource để không bị trùng với {id}) ---
Route::get('/categories/trash', [CategoryController::class, 'trash']);
Route::post('/categories/{id}/restore', [CategoryController::class, 'restore']);
Route::delete('/categories/{id}/force', [CategoryController::class, 'forceDelete']);

Route::get('/products/trash', [ProductController::class, 'trash']);
Route::post('/products/{id}/restore', [ProductController::class, 'restore']);
Route::delete('/products/{id}/force', [ProductController::class, 'forceDelete']);

// --- Sản phẩm / Danh mục / Thương hiệu ---
// apiResource đã gồm index, store, show, update, destroy nên không cần khai báo lặp lại.
Route::apiResource('products', ProductController::class);
Route::apiResource('categories', CategoryController::class);
Route::apiResource('brands', BrandController::class);

// --- Đơn hàng ---
Route::post('/checkout', [OrderController::class, 'checkout']);
Route::get('/orders', [OrderController::class, 'index']);

use App\Http\Controllers\Api\DashboardController;
Route::get('/dashboard', [DashboardController::class, 'index']);
Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);

use App\Http\Controllers\Api\ContactController;
Route::post('/contacts', [ContactController::class, 'store']);
Route::get('/contacts', [ContactController::class, 'index']);
Route::put('/contacts/{id}/status', [ContactController::class, 'updateStatus']);

use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\AdminUserController;

Route::apiResource('posts', PostController::class);
Route::get('/admin/users', [AdminUserController::class, 'index']);
Route::put('/admin/users/{id}/block', [AdminUserController::class, 'toggleBlock']);