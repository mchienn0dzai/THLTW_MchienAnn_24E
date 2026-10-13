<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['category:id,name,slug', 'brand:id,name,slug'])
            ->latest('id');

        if ($request->filled('category_id')) $query->where('category_id', $request->category_id);
        if ($request->filled('brand_id')) $query->where('brand_id', $request->brand_id);
        if ($request->filled('search')) $query->where('name', 'like', '%' . $request->search . '%');

        return response()->json($query->get(), 200);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'brand_id'    => ['required', 'integer', 'exists:brands,id'],
            'name'        => ['required', 'string', 'max:255'],
            'slug'        => ['nullable', 'string', 'max:255', 'unique:products,slug'],
            'image'       => ['nullable', 'string', 'max:255'],
            'price'       => ['required', 'numeric', 'min:0'],
            'sale_price'  => ['nullable', 'numeric', 'min:0', 'lte:price'],
            'stock_qty'   => ['nullable', 'integer', 'min:0'],
            'description' => ['nullable', 'string'],
            'status'      => ['nullable', 'boolean'],
        ]);

        $data['slug']      = $this->uniqueSlug($data['slug'] ?? $data['name']);
        $data['stock_qty'] = $data['stock_qty'] ?? 0;
        $data['status']    = $data['status'] ?? true;

        $product = Product::create($data)->load(['category:id,name,slug', 'brand:id,name,slug']);

        return response()->json(['message' => 'Thêm thành công', 'data' => $product], 201);
    }

    public function show($id): JsonResponse
    {
        // Đã xóa 'details' khỏi lệnh truy vấn để tránh lỗi sập Backend
        $product = Product::with(['category', 'brand'])->find($id);
        
        if (!$product) {
            return response()->json(['message' => 'Không tìm thấy'], 404);
        }
        return response()->json($product, 200);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $product = Product::find($id);
        if (!$product) return response()->json(['message' => 'Không tìm thấy'], 404);

        $data = $request->validate([
            'category_id' => ['sometimes', 'required', 'integer', 'exists:categories,id'],
            'brand_id'    => ['sometimes', 'required', 'integer', 'exists:brands,id'],
            'name'        => ['sometimes', 'required', 'string', 'max:255'],
            'slug'        => ['nullable', 'string', 'max:255', Rule::unique('products', 'slug')->ignore($product->id)],
            'image'       => ['nullable', 'string', 'max:255'],
            'price'       => ['sometimes', 'required', 'numeric', 'min:0'],
            'sale_price'  => ['nullable', 'numeric', 'min:0'],
            'stock_qty'   => ['nullable', 'integer', 'min:0'],
            'description' => ['nullable', 'string'],
            'status'      => ['nullable', 'boolean'],
        ]);

        if (isset($data['name']) && empty($data['slug']) && $data['name'] !== $product->name) {
            $data['slug'] = $this->uniqueSlug($data['name'], $product->id);
        }

        $product->update($data);

        return response()->json([
            'message' => 'Sửa thành công',
            'data'    => $product->fresh(['category:id,name,slug', 'brand:id,name,slug']),
        ], 200);
    }

    public function destroy($id): JsonResponse
    {
        $product = Product::find($id);
        if (!$product) return response()->json(['message' => 'Không tìm thấy'], 404);

        $product->delete(); 
        return response()->json(['message' => 'Đã đưa sản phẩm vào thùng rác'], 200);
    }

    // --- CÁC HÀM CHO THÙNG RÁC ---
    public function trash(): JsonResponse
    {
        $products = Product::onlyTrashed()->with(['category', 'brand'])->orderBy('deleted_at', 'desc')->get();
        return response()->json($products, 200);
    }

    public function restore($id): JsonResponse
    {
        $product = Product::onlyTrashed()->find($id);
        if (!$product) return response()->json(['message' => 'Không tìm thấy'], 404);
        
        $product->restore();
        return response()->json(['message' => 'Khôi phục sản phẩm thành công'], 200);
    }

    public function forceDelete($id): JsonResponse
    {
        $product = Product::onlyTrashed()->find($id);
        if (!$product) return response()->json(['message' => 'Không tìm thấy'], 404);
        
        $product->forceDelete();
        return response()->json(['message' => 'Đã xóa vĩnh viễn'], 200);
    }

    private function uniqueSlug(string $source, ?int $ignoreId = null): string
    {
        $base = Str::slug($source) ?: 'san-pham';
        $slug = $base;
        $i = 2;
        while (Product::where('slug', $slug)
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->exists()) {
            $slug = $base . '-' . $i++;
        }
        return $slug;
    }
}