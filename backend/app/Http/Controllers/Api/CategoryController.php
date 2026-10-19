<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(Category::withCount('products')->latest('id')->get(), 200);
    }

    public function store(Request $request)
    {
        $data = $request->validate(['name' => 'required|string|max:255']);
        $slug = Str::slug($data['name']) ?: 'danh-muc';
        $i = 2;
        while (Category::withTrashed()->where('slug', $slug)->exists()) {
            $slug = Str::slug($data['name']) . '-' . $i++;
        }
        $cat = Category::create(['name' => $data['name'], 'slug' => $slug]);
        return response()->json($cat, 201);
    }

    public function update(Request $request, $id)
    {
        $cat = Category::findOrFail($id);
        $data = $request->validate(['name' => 'required|string|max:255']);
        $cat->update(['name' => $data['name']]);
        return response()->json($cat, 200);
    }

    public function destroy($id)
    {
        $cat = Category::find($id);
        if (!$cat) return response()->json(['message' => 'Không tìm thấy danh mục'], 404);

        $productCount = Product::withTrashed()->where('category_id', $id)->count();
        if ($productCount > 0) {
            return response()->json([
                'message' => "Không thể xóa! Danh mục này đang chứa {$productCount} sản phẩm (liên quan đến đơn hàng)."
            ], 400);
        }

        $cat->delete();
        return response()->json(['message' => 'Đã đưa danh mục vào thùng rác'], 200);
    }

    public function trash()
    {
        return response()->json(Category::onlyTrashed()->orderBy('deleted_at', 'desc')->get(), 200);
    }

    public function restore($id)
    {
        $cat = Category::onlyTrashed()->find($id);
        if (!$cat) return response()->json(['message' => 'Không tìm thấy'], 404);
        $cat->restore();
        return response()->json(['message' => 'Khôi phục danh mục thành công'], 200);
    }

    public function forceDelete($id)
    {
        $cat = Category::onlyTrashed()->find($id);
        if (!$cat) return response()->json(['message' => 'Không tìm thấy'], 404);
        $productCount = Product::withTrashed()->where('category_id', $id)->count();
        if ($productCount > 0) {
            return response()->json(['message' => 'Không thể xóa vĩnh viễn vì vẫn còn sản phẩm thuộc danh mục này!'], 400);
        }
        $cat->forceDelete();
        return response()->json(['message' => 'Đã xóa vĩnh viễn danh mục'], 200);
    }
}