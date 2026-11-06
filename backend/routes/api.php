<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\MenuController;

Route::get('/dashboard', [DashboardController::class, 'index']);

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Upload & Danh sách ảnh trong folder public/images/products
Route::post('/upload-image', [ProductController::class, 'uploadImage']);
Route::get('/product-images', [ProductController::class, 'listFolderImages']);

// Thùng rác (Trash) cho Sản phẩm, Danh mục, Thương hiệu
Route::get('/products/trash', [ProductController::class, 'trash']);
Route::get('/products/trash/list', [ProductController::class, 'trash']);
Route::post('/products/{id}/restore', [ProductController::class, 'restore']);
Route::put('/products/{id}/restore', [ProductController::class, 'restore']);
Route::delete('/products/{id}/force', [ProductController::class, 'forceDelete']);
Route::delete('/products/{id}/force-delete', [ProductController::class, 'forceDelete']);

Route::get('/categories/trash', [CategoryController::class, 'trash']);
Route::get('/categories/trash/list', [CategoryController::class, 'trash']);
Route::post('/categories/{id}/restore', [CategoryController::class, 'restore']);
Route::put('/categories/{id}/restore', [CategoryController::class, 'restore']);
Route::delete('/categories/{id}/force', [CategoryController::class, 'forceDelete']);
Route::delete('/categories/{id}/force-delete', [CategoryController::class, 'forceDelete']);

Route::get('/brands/trash', [BrandController::class, 'trash']);
Route::get('/brands/trash/list', [BrandController::class, 'trash']);
Route::post('/brands/{id}/restore', [BrandController::class, 'restore']);
Route::put('/brands/{id}/restore', [BrandController::class, 'restore']);
Route::delete('/brands/{id}/force', [BrandController::class, 'forceDelete']);
Route::delete('/brands/{id}/force-delete', [BrandController::class, 'forceDelete']);

// CRUD Resources
Route::apiResource('products', ProductController::class);
Route::apiResource('categories', CategoryController::class);
Route::apiResource('brands', BrandController::class);
Route::apiResource('posts', PostController::class);
Route::apiResource('contacts', ContactController::class);
Route::apiResource('menus', MenuController::class);

// Đơn hàng
Route::get('/orders', [OrderController::class, 'index']);
Route::get('/orders/{id}', [OrderController::class, 'show']);
Route::post('/orders', [OrderController::class, 'store']);
Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
Route::put('/orders/{id}', [OrderController::class, 'updateStatus']);
Route::delete('/orders/{id}', [OrderController::class, 'destroy']);

// Quản lý Users & Profile
Route::get('/users', [AdminUserController::class, 'index']);
Route::get('/users/{id}', [AdminUserController::class, 'show']);
Route::put('/users/{id}/block', [AdminUserController::class, 'toggleBlock']);
Route::put('/users/{id}', [AdminUserController::class, 'toggleBlock']);
Route::put('/users/{id}/profile', [AdminUserController::class, 'updateProfile']);