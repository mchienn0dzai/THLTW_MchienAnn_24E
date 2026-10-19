<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class BrandController extends Controller
{
    public function __construct()
    {
        if (Schema::hasTable('brands') && !Schema::hasColumn('brands', 'deleted_at')) {
            Schema::table('brands', function (Blueprint $table) {
                $table->softDeletes();
            });
        }
    }

    public function index()
    {
        return response()->json(Brand::withCount('products')->latest('id')->get(), 200);
    }

    public function store(Request $request)
    {
        $data = $request->validate(['name' => 'required|string|max:255']);
        $slug = Str::slug($data['name']) ?: 'thuong-hieu';
        $i = 2;
        while (Brand::withTrashed()->where('slug', $slug)->exists()) {
            $slug = Str::slug($data['name']) . '-' . $i++;
        }
        $brand = Brand::create(['name' => $data['name'], 'slug' => $slug]);
        return response()->json($brand, 201);
    }

    public function update(Request $request, $id)
    {
        $brand = Brand::findOrFail($id);
        $data = $request->validate(['name' => 'required|string|max:255']);
        $brand->update(['name' => $data['name']]);
        return response()->json($brand, 200);
    }

    public function destroy($id)
    {
        $brand = Brand::find($id);
        if (!$brand) return response()->json(['message' => 'Không tìm thấy'], 404);
        $brand->delete();
        return response()->json(['message' => 'Đã đưa thương hiệu vào thùng rác'], 200);
    }

    public function trash()
    {
        return response()->json(Brand::onlyTrashed()->orderBy('deleted_at', 'desc')->get(), 200);
    }

    public function restore($id)
    {
        $brand = Brand::onlyTrashed()->find($id);
        if (!$brand) return response()->json(['message' => 'Không tìm thấy'], 404);
        $brand->restore();
        return response()->json(['message' => 'Đã khôi phục thương hiệu'], 200);
    }

    public function forceDelete($id)
    {
        $brand = Brand::onlyTrashed()->find($id);
        if (!$brand) return response()->json(['message' => 'Không tìm thấy'], 404);
        $brand->forceDelete();
        return response()->json(['message' => 'Đã xóa vĩnh viễn thương hiệu'], 200);
    }
}