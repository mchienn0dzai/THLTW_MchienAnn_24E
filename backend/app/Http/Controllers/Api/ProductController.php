<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['category:id,name,slug', 'brand:id,name,slug'])->latest('id');

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
            'name'        => ['required', 'string', 'max:255'], // Cho phép trùng tên
            'image'       => ['required', 'string', 'max:255'], // Bắt buộc phải có đường dẫn ảnh
            'price'       => ['required', 'numeric', 'min:0'],
            'sale_price'  => ['nullable', 'numeric', 'min:0'],
            'stock_qty'   => ['nullable', 'integer', 'min:0'],
            'description' => ['nullable', 'string'],
            'status'      => ['nullable', 'boolean'],
        ]);

        if (!empty($data['sale_price']) && (float)$data['sale_price'] >= (float)$data['price']) {
            return response()->json(['message' => 'Giá giảm phải nhỏ hơn giá gốc!'], 422);
        }

        $data['slug']      = $this->uniqueSlug($data['name']);
        $data['stock_qty'] = $data['stock_qty'] ?? 10;
        $data['status']    = $data['status'] ?? true;

        $product = Product::create($data)->load(['category:id,name,slug', 'brand:id,name,slug']);
        return response()->json(['message' => 'Thêm thành công', 'data' => $product], 201);
    }

    public function show($id): JsonResponse
    {
        $product = Product::with(['category', 'brand'])->find($id);
        if (!$product) return response()->json(['message' => 'Không tìm thấy'], 404);
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
            'image'       => ['required', 'string', 'max:255'], // Không được để trống ảnh
            'price'       => ['sometimes', 'required', 'numeric', 'min:0'],
            'sale_price'  => ['nullable', 'numeric', 'min:0'],
            'stock_qty'   => ['nullable', 'integer', 'min:0'],
            'description' => ['nullable', 'string'],
            'status'      => ['nullable', 'boolean'],
        ]);

        $price = $data['price'] ?? $product->price;
        if (!empty($data['sale_price']) && (float)$data['sale_price'] >= (float)$price) {
            return response()->json(['message' => 'Giá giảm phải nhỏ hơn giá gốc!'], 422);
        }

        if (isset($data['name']) && $data['name'] !== $product->name) {
            $data['slug'] = $this->uniqueSlug($data['name'], $product->id);
        }

        $product->update($data);
        return response()->json(['message' => 'Sửa thành công', 'data' => $product->fresh(['category', 'brand'])], 200);
    }

    public function destroy($id): JsonResponse
    {
        $product = Product::find($id);
        if (!$product) return response()->json(['message' => 'Không tìm thấy'], 404);
        $product->delete();
        return response()->json(['message' => 'Đã đưa sản phẩm vào thùng rác'], 200);
    }

    public function trash(): JsonResponse
    {
        return response()->json(Product::onlyTrashed()->with(['category', 'brand'])->orderBy('deleted_at', 'desc')->get(), 200);
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

    // Upload file ảnh trực tiếp vào folder backend/public/images/products
    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate(['image' => 'required|file|mimes:jpeg,png,jpg,gif,svg,webp|max:5120']);
        $file = $request->file('image');
        $dir = public_path('images/products');
        if (!File::exists($dir)) {
            File::makeDirectory($dir, 0755, true);
        }
        $filename = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '-' . time() . '.' . $file->getClientOriginalExtension();
        $file->move($dir, $filename);

        return response()->json([
            'path' => '/images/products/' . $filename
        ], 200);
    }

    // Lấy danh sách ảnh có sẵn trong folder backend/public/images/products
    public function listFolderImages(): JsonResponse
    {
        $dir = public_path('images/products');
        if (!File::exists($dir)) return response()->json([], 200);
        $files = File::files($dir);
        $paths = [];
        foreach ($files as $file) {
            $paths[] = '/images/products/' . $file->getFilename();
        }
        return response()->json($paths, 200);
    }

    private function uniqueSlug(string $source, ?int $ignoreId = null): string
    {
        $base = Str::slug($source) ?: 'san-pham';
        $slug = $base;
        $i = 2;
        while (Product::withTrashed()->where('slug', $slug)
            ->when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))
            ->exists()) {
            $slug = $base . '-' . $i++;
        }
        return $slug;
    }
}