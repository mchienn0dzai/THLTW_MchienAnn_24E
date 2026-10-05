<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class BrandController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Brand::withCount('products')->orderBy('name')->get(), 200);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'   => ['required', 'string', 'max:255'],
            'slug'   => ['nullable', 'string', 'max:255', 'unique:brands,slug'],
            'image'  => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'boolean'],
        ]);

        $base = Str::slug($data['slug'] ?? $data['name']) ?: 'thuong-hieu';
        $slug = $base;
        $i = 2;
        while (Brand::where('slug', $slug)->exists()) {
            $slug = $base . '-' . $i++;
        }
        $data['slug']   = $slug;
        $data['status'] = $data['status'] ?? true;

        return response()->json(['message' => 'Thêm thương hiệu thành công', 'data' => Brand::create($data)], 201);
    }

    public function show($id): JsonResponse
    {
        $brand = Brand::find($id);
        return $brand
            ? response()->json($brand, 200)
            : response()->json(['message' => 'Không tìm thấy'], 404);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $brand = Brand::find($id);
        if (!$brand) {
            return response()->json(['message' => 'Không tìm thấy'], 404);
        }

        $data = $request->validate([
            'name'   => ['sometimes', 'required', 'string', 'max:255'],
            'slug'   => ['nullable', 'string', 'max:255', Rule::unique('brands', 'slug')->ignore($brand->id)],
            'image'  => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'boolean'],
        ]);

        $brand->update($data);
        return response()->json(['message' => 'Sửa thương hiệu thành công', 'data' => $brand], 200);
    }

    public function destroy($id): JsonResponse
    {
        $brand = Brand::find($id);
        if (!$brand) {
            return response()->json(['message' => 'Không tìm thấy'], 404);
        }
        if ($brand->products()->exists()) {
            return response()->json(['message' => 'Thương hiệu đang có sản phẩm, không thể xoá.'], 409);
        }
        $brand->delete();
        return response()->json(['message' => 'Đã xóa thương hiệu'], 200);
    }
}
