<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::withCount('products')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return response()->json($categories, 200);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'parent_id'  => ['nullable', 'integer', 'exists:categories,id'],
            'name'       => ['required', 'string', 'max:255'],
            'slug'       => ['nullable', 'string', 'max:255', 'unique:categories,slug'],
            'sort_order' => ['nullable', 'integer'],
            'status'     => ['nullable', 'boolean'],
        ]);

        $data['slug']       = $this->uniqueSlug($data['slug'] ?? $data['name']);
        $data['sort_order'] = $data['sort_order'] ?? 0;
        $data['status']     = $data['status'] ?? true;

        $category = Category::create($data);

        return response()->json(['message' => 'Thêm danh mục thành công', 'data' => $category], 201);
    }

    public function show($id): JsonResponse
    {
        $category = Category::with('products')->find($id);
        if (!$category) {
            return response()->json(['message' => 'Không tìm thấy'], 404);
        }
        return response()->json($category, 200);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['message' => 'Không tìm thấy'], 404);
        }

        $data = $request->validate([
            'parent_id'  => ['nullable', 'integer', 'exists:categories,id', Rule::notIn([$category->id])],
            'name'       => ['sometimes', 'required', 'string', 'max:255'],
            'slug'       => ['nullable', 'string', 'max:255', Rule::unique('categories', 'slug')->ignore($category->id)],
            'sort_order' => ['nullable', 'integer'],
            'status'     => ['nullable', 'boolean'],
        ]);

        $category->update($data);

        return response()->json(['message' => 'Sửa danh mục thành công', 'data' => $category], 200);
    }

    public function destroy($id): JsonResponse
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['message' => 'Không tìm thấy'], 404);
        }

        // Migration đặt products.category_id ON DELETE CASCADE nên xoá danh mục sẽ xoá luôn sản phẩm.
        if ($category->products()->exists()) {
            return response()->json([
                'message' => 'Danh mục đang có sản phẩm, hãy chuyển hoặc xoá sản phẩm trước.'
            ], 409);
        }

        $category->delete();
        return response()->json(['message' => 'Đã xóa danh mục'], 200);
    }

    private function uniqueSlug(string $source): string
    {
        $base = Str::slug($source) ?: 'danh-muc';
        $slug = $base;
        $i = 2;
        while (Category::where('slug', $slug)->exists()) {
            $slug = $base . '-' . $i++;
        }
        return $slug;
    }
}
