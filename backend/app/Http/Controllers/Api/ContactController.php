<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index()
    {
        return response()->json(Contact::latest('id')->get(), 200);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            'phone'   => 'nullable|string|max:30',
            'message' => 'required|string',
        ]);

        // KIỂM TRA NẾU EMAIL HOẶC SĐT ĐÃ BỊ ADMIN KHÓA TRONG MỤC LIÊN HỆ
        $isBlocked = Contact::where('status', 'Đã khóa')
            ->where(function ($q) use ($data) {
                $q->where('email', $data['email']);
                if (!empty($data['phone'])) {
                    $q->orWhere('phone', $data['phone']);
                }
            })->exists();

        if ($isBlocked) {
            return response()->json([
                'message' => 'Email hoặc Số điện thoại của bạn đã bị Quản trị viên chặn gửi thư do spam!'
            ], 403);
        }

        $data['status'] = 'Chưa xử lý';
        return response()->json(Contact::create($data), 201);
    }

    public function update(Request $request, $id)
    {
        $contact = Contact::findOrFail($id);
        $contact->update(['status' => $request->input('status', 'Đã xử lý')]);

        // Nếu khóa 1 thư của email này, đồng bộ khóa các thư cùng email
        if ($request->input('status') === 'Đã khóa') {
            Contact::where('email', $contact->email)->update(['status' => 'Đã khóa']);
        }

        return response()->json(['message' => 'Cập nhật thành công', 'data' => $contact], 200);
    }

    public function destroy($id)
    {
        Contact::destroy($id);
        return response()->json(['message' => 'Đã xóa thư liên hệ'], 200);
    }
}