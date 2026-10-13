"use client";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    const res = await fetch(`${API_URL}/api/admin/users`);
    setUsers(await res.json());
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleBlock = async (id: number) => {
    if (!confirm("Thay đổi trạng thái tài khoản này?")) return;
    await fetch(`${API_URL}/api/admin/users/${id}/block`, { method: "PUT" });
    fetchUsers();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Quản lý Khách hàng</h1>
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-4 border-b">ID</th>
            <th className="p-4 border-b">Họ và Tên</th>
            <th className="p-4 border-b">Email</th>
            <th className="p-4 border-b">Trạng thái</th>
            <th className="p-4 border-b text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-b hover:bg-gray-50">
              <td className="p-4 text-gray-500">{u.id}</td>
              <td className="p-4 font-semibold">{u.name}</td>
              <td className="p-4 text-blue-600">{u.email}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded text-xs font-bold ${u.is_blocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                  {u.is_blocked ? "Đã khóa" : "Hoạt động"}
                </span>
              </td>
              <td className="p-4 text-center">
                <button onClick={() => toggleBlock(u.id)} className="text-blue-600 font-medium hover:underline border border-blue-200 px-3 py-1 rounded hover:bg-blue-50">
                  {u.is_blocked ? "🔓 Mở khóa" : "🔒 Khóa tài khoản"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}