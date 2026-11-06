<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class MenuController extends Controller
{
    public function __construct()
    {
        if (!Schema::hasTable('menus')) {
            Schema::create('menus', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('link');
                $table->integer('position')->default(1);
                $table->boolean('is_hidden')->default(false);
                $table->timestamps();
            });

            DB::table('menus')->insert([
                ['name' => 'Trang chủ', 'link' => '/', 'position' => 1, 'is_hidden' => false, 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Sản phẩm', 'link' => '/categories', 'position' => 2, 'is_hidden' => false, 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Thông tin & Chính sách', 'link' => '/about', 'position' => 3, 'is_hidden' => false, 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Liên hệ', 'link' => '/contact', 'position' => 4, 'is_hidden' => false, 'created_at' => now(), 'updated_at' => now()],
            ]);
        }
    }

    public function index()
    {
        return response()->json(DB::table('menus')->orderBy('position')->orderBy('id')->get(), 200);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'link' => 'required|string|max:255',
            'position' => 'nullable|integer',
            'is_hidden' => 'nullable|boolean',
        ]);

        $id = DB::table('menus')->insertGetId([
            'name' => $data['name'],
            'link' => $data['link'],
            'position' => $data['position'] ?? 1,
            'is_hidden' => $data['is_hidden'] ?? false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(DB::table('menus')->find($id), 201);
    }

    public function update(Request $request, $id)
    {
        $menu = DB::table('menus')->find($id);
        if (!$menu) return response()->json(['message' => 'Không tìm thấy menu'], 404);

        DB::table('menus')->where('id', $id)->update([
            'name' => $request->input('name', $menu->name),
            'link' => $request->input('link', $menu->link),
            'position' => $request->input('position', $menu->position),
            'is_hidden' => $request->has('is_hidden') ? (bool)$request->input('is_hidden') : $menu->is_hidden,
            'updated_at' => now(),
        ]);

        return response()->json(DB::table('menus')->find($id), 200);
    }

    public function destroy($id)
    {
        DB::table('menus')->where('id', $id)->delete();
        return response()->json(['message' => 'Đã xóa menu'], 200);
    }
}