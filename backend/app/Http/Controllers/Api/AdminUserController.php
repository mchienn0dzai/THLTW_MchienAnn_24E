<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\User;

class AdminUserController extends Controller {
    public function index() { return response()->json(User::orderBy('id', 'desc')->get()); }
    public function toggleBlock($id) {
        $user = User::findOrFail($id);
        $user->is_blocked = !$user->is_blocked;
        $user->save();
        return response()->json(['message' => 'Thành công', 'is_blocked' => $user->is_blocked]);
    }
}