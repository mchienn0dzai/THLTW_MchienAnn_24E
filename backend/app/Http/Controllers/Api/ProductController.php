<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // Lấy danh sách toàn bộ sản phẩm đưa ra trang chủ
    public function index() {
        return response()->json(Product::all(), 200);
    }

    public function store(Request $request) {
        $product = Product::create($request->all());
        return response()->json(['message' => 'Thêm thành công', 'data' => $product], 201);
    }

    public function show($id) {
        return response()->json(Product::find($id), 200);
    }

    public function update(Request $request, $id) {
        $product = Product::find($id);
        if (!$product) return response()->json(['message' => 'Không tìm thấy'], 404);
        
        $product->update($request->all());
        return response()->json(['message' => 'Sửa thành công', 'data' => $product], 200);
    }

    public function destroy($id) {
        $product = Product::find($id);
        if (!$product) return response()->json(['message' => 'Không tìm thấy'], 404);

        $product->delete();
        return response()->json(['message' => 'Đã xóa thành công'], 200);
    }
}