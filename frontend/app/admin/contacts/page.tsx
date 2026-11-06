"use client";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [viewContact, setViewContact] = useState<any>(null);

  const fetchContacts = async () => {
    const res = await fetch(`${API_URL}/api/contacts`);
    if (res.ok) setContacts(await res.json());
  };

  useEffect(() => { fetchContacts(); }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`${API_URL}/api/contacts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchContacts();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Xóa thư liên hệ này?")) return;
    await fetch(`${API_URL}/api/contacts/${id}`, { method: "DELETE" });
    fetchContacts();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border">
      <h1 className="text-2xl font-bold mb-6">Quản lý Thư liên hệ</h1>
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-4 border-b">ID</th>
            <th className="p-4 border-b">Người gửi</th>
            <th className="p-4 border-b">Email / SĐT</th>
            <th className="p-4 border-b">Nội dung</th>
            <th className="p-4 border-b">Trạng thái / Khóa</th>
            <th className="p-4 border-b text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr key={c.id} className="border-b hover:bg-gray-50">
              <td className="p-4">{c.id}</td>
              <td className="p-4 font-semibold">{c.name}</td>
              <td className="p-4">
                <div>{c.email}</div>
                <div className="text-xs text-gray-500">{c.phone}</div>
              </td>
              <td className="p-4 max-w-xs truncate">{c.message}</td>
              <td className="p-4">
                <select
                  value={c.status || "Chưa xử lý"}
                  onChange={(e) => updateStatus(c.id, e.target.value)}
                  className={`border p-1.5 rounded text-xs font-bold ${c.status === "Đã khóa" ? "bg-red-100 text-red-700" : c.status === "Đã xử lý" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                >
                  <option value="Chưa xử lý">Chưa xử lý</option>
                  <option value="Đã xử lý">Đã xử lý</option>
                  <option value="Đã khóa">Đã khóa (Chặn gửi thư)</option>
                </select>
              </td>
              <td className="p-4 text-center space-x-3">
                <button onClick={() => setViewContact(c)} className="text-blue-600 hover:underline font-semibold">Chi tiết</button>
                <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:underline font-semibold">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {viewContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-2">Chi tiết Thư liên hệ #{viewContact.id}</h2>
            <p className="text-sm text-gray-600 mb-1"><strong>Người gửi:</strong> {viewContact.name}</p>
            <p className="text-sm text-gray-600 mb-1"><strong>Email:</strong> {viewContact.email}</p>
            <p className="text-sm text-gray-600 mb-4"><strong>SĐT:</strong> {viewContact.phone || "Không có"}</p>
            <div className="bg-gray-50 p-4 rounded border text-gray-800 whitespace-pre-wrap">{viewContact.message}</div>
            <div className="flex justify-end mt-4">
              <button onClick={() => setViewContact(null)} className="px-4 py-2 bg-gray-800 text-white rounded">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}