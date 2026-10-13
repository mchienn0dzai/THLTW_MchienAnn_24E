<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller {
    // Frontend User gửi liên hệ
    public function store(Request $request) {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'message' => 'required|string',
        ]);
        $contact = Contact::create($data);
        return response()->json(['message' => 'Gửi thành công', 'data' => $contact], 201);
    }

    // Admin lấy danh sách liên hệ
    public function index() {
        return response()->json(Contact::orderBy('created_at', 'desc')->get(), 200);
    }

    // Admin cập nhật trạng thái đã xử lý
    public function updateStatus(Request $request, $id) {
        $contact = Contact::findOrFail($id);
        $contact->status = $request->status;
        $contact->save();
        return response()->json(['message' => 'Cập nhật thành công'], 200);
    }
}