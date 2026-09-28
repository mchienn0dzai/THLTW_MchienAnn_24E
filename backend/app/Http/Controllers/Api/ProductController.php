<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // 1. Xem danh sách sản phẩm (READ)
    public function index() {
        return response()->json(Product::all(), 200);
    }

    // 2. Thêm sản phẩm mới (CREATE)
    public function store(Request $request) {
        $product = Product::create($request->all());
        return response()->json(['message' => 'Thêm thành công', 'data' => $product], 201);
    }

    // 3. Xem chi tiết 1 sản phẩm
    public function show($id) {
        return response()->json(Product::find($id), 200);
    }

    // 4. Sửa sản phẩm (UPDATE)
    public function update(Request $request, $id) {
        $product = Product::find($id);
        if (!$product) return response()->json(['message' => 'Không tìm thấy'], 404);
        
        $product->update($request->all());
        return response()->json(['message' => 'Sửa thành công', 'data' => $product], 200);
    }

    // 5. Xóa sản phẩm (DELETE)
    public function destroy($id) {
        $product = Product::find($id);
        if (!$product) return response()->json(['message' => 'Không tìm thấy'], 404);

        $product->delete();
        return response()->json(['message' => 'Đã xóa thành công'], 200);
    }
}