"use client";
import { useEffect, useState } from "react";
import { API_URL, formatVND } from "@/lib/api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const fetchUsers = async () => {
    const res = await fetch(`${API_URL}/api/users`);
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
      if (selectedUser) {
        const updated = data.find((u: any) => u.id === selectedUser.id);
        if (updated) setSelectedUser(updated);
      }
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleBlock = async (id: number) => {
    const res = await fetch(`${API_URL}/api/users/${id}/block`, { method: "PUT" });
    if (res.ok) fetchUsers();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6 border">
        <h1 className="text-2xl font-bold mb-6">Quản lý Khách hàng</h1>
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4 border-b">ID</th>
              <th className="p-4 border-b">Họ tên</th>
              <th className="p-4 border-b">Email / SĐT</th>
              <th className="p-4 border-b">Số đơn đã đặt</th>
              <th className="p-4 border-b">Trạng thái</th>
              <th className="p-4 border-b text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{u.id}</td>
                <td className="p-4 font-semibold">{u.name}</td>
                <td className="p-4">
                  <div>{u.email}</div>
                  <div className="text-xs text-gray-500">{u.phone || "Chưa cập nhật SĐT"}</div>
                </td>
                <td className="p-4 font-bold text-blue-600">{u.orders_count || 0} đơn</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold ${u.is_blocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {u.is_blocked ? "Đã bị Khóa (Chặn Login)" : "Đang hoạt động"}
                  </span>
                </td>
                <td className="p-4 text-center space-x-2">
                  <button
                    onClick={() => setSelectedUser(u)}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-blue-700"
                  >
                    Chi tiết & Đơn hàng
                  </button>
                  <button
                    onClick={() => toggleBlock(u.id)}
                    className={`px-3 py-1.5 rounded text-xs font-semibold text-white ${u.is_blocked ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
                  >
                    {u.is_blocked ? "Mở khóa" : "Khóa TK"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* KHUNG CHI TIẾT USER & DANH SÁCH ĐƠN HÀNG CỦA USER NGAY TRÊN CÙNG 1 TRANG */}
      {selectedUser && (
        <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-blue-500">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="text-xl font-bold text-blue-700">
              👤 Chi tiết khách hàng: {selectedUser.name} (#{selectedUser.id})
            </h2>
            <button onClick={() => setSelectedUser(null)} className="text-gray-500 hover:text-red-600 font-bold">✕ Đóng</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded-lg text-sm">
            <div><strong>Email:</strong> {selectedUser.email}</div>
            <div><strong>Số điện thoại:</strong> {selectedUser.phone || "Chưa có"}</div>
            <div><strong>Địa chỉ:</strong> {selectedUser.address || "Chưa có"}</div>
          </div>

          <h3 className="font-bold text-gray-800 mb-3">📦 Danh sách đơn hàng của {selectedUser.name} ({selectedUser.orders?.length || 0} đơn):</h3>
          {(!selectedUser.orders || selectedUser.orders.length === 0) ? (
            <p className="text-gray-500 text-sm italic">Khách hàng này chưa có đơn hàng nào.</p>
          ) : (
            <table className="w-full text-left text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border-b">Mã ĐH</th>
                  <th className="p-3 border-b">Ngày đặt</th>
                  <th className="p-3 border-b">Địa chỉ nhận</th>
                  <th className="p-3 border-b">Tổng tiền</th>
                  <th className="p-3 border-b">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {selectedUser.orders.map((o: any) => (
                  <tr key={o.id} className="border-b">
                    <td className="p-3 font-bold">#{o.id}</td>
                    <td className="p-3">{new Date(o.created_at).toLocaleString("vi-VN")}</td>
                    <td className="p-3">{o.address || o.shipping_address}</td>
                    <td className="p-3 font-bold text-red-600">{formatVND(o.total_amount || o.total)}</td>
                    <td className="p-3 font-semibold">{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}