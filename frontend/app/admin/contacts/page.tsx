"use client";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/contacts`);
      setContacts(await res.json());
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "Chưa xử lý" ? "Đã xử lý" : "Chưa xử lý";
    try {
      await fetch(`${API_URL}/api/contacts/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchContacts(); // Cập nhật lại UI
    } catch (error) {
      alert("Lỗi cập nhật.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý Liên hệ & Khiếu nại</h1>
      
      {loading ? <div>Đang tải dữ liệu...</div> : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto border">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4 border-b">Ngày gửi</th>
                <th className="p-4 border-b">Họ tên</th>
                <th className="p-4 border-b">Email</th>
                <th className="p-4 border-b w-1/3">Nội dung</th>
                <th className="p-4 border-b">Trạng thái</th>
                <th className="p-4 border-b text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Chưa có liên hệ nào.</td></tr>
              ) : (
                contacts.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-gray-500">{new Date(c.created_at).toLocaleString('vi-VN')}</td>
                    <td className="p-4 font-semibold">{c.name}</td>
                    <td className="p-4 text-blue-600">{c.email}</td>
                    <td className="p-4 text-gray-700">{c.message}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${c.status === "Đã xử lý" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleStatus(c.id, c.status)} className="text-blue-600 hover:underline font-medium">
                        Đổi trạng thái
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}