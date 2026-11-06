<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PostController extends Controller {
    public function index() { return response()->json(Post::latest()->get(), 200); }
    
    public function store(Request $request) {
        $data = $request->validate(['title' => 'required', 'content' => 'required']);
        $data['slug'] = Str::slug($data['title']) . '-' . time();
        return response()->json(Post::create($data), 201);
    }

    public function update(Request $request, $id) {
        $post = Post::findOrFail($id);
        $data = $request->validate(['title' => 'required', 'content' => 'required']);
        $post->update($data);
        return response()->json(['message' => 'Sửa thành công'], 200);
    }

    public function destroy($id) { 
        Post::destroy($id); 
        return response()->json(['message' => 'Xóa thành công']); 
    }
}