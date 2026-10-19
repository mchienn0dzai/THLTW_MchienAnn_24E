"use client";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

export default function AdminTrashPage() {
  const [tab, setTab] = useState<"products" | "categories" | "brands">("products");
  const [items, setItems] = useState<any[]>([]);

  const fetchTrash = async () => {
    const res = await fetch(`${API_URL}/api/${tab}/trash`);
    if (res.ok) setItems(await res.json());
  };

  useEffect(() => { fetchTrash(); }, [tab]);

  const handleRestore = async (id: number) => {
    await fetch(`${API_URL}/api/${tab}/${id}/restore`, { method: "POST" });
    fetchTrash();
  };

  const handleForceDelete = async (id: number) => {
    if (!confirm("Xóa vĩnh viễn mục này khỏi Cơ sở dữ liệu?")) return;
    const res = await fetch(`${API_URL}/api/${tab}/${id}/force`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) alert(data.message || "Lỗi xóa!");
    fetchTrash();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border">
      <h1 className="text-2xl font-bold mb-6">🗑️ Thùng rác hệ thống</h1>

      <div className="flex space-x-3 mb-6 border-b pb-3">
        <button onClick={() => setTab("products")} className={`px-4 py-2 rounded-lg font-semibold ${tab === "products" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
          Sản phẩm đã xóa
        </button>
        <button onClick={() => setTab("categories")} className={`px-4 py-2 rounded-lg font-semibold ${tab === "categories" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
          Danh mục đã xóa
        </button>
        <button onClick={() => setTab("brands")} className={`px-4 py-2 rounded-lg font-semibold ${tab === "brands" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
          Thương hiệu đã xóa
        </button>
      </div>

      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-4 border-b">ID</th>
            <th className="p-4 border-b">Tên</th>
            <th className="p-4 border-b">Thời gian xóa</th>
            <th className="p-4 border-b text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr><td colSpan={4} className="p-8 text-center text-gray-500">Thùng rác trống.</td></tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{item.id}</td>
                <td className="p-4 font-semibold">{item.name}</td>
                <td className="p-4 text-gray-500">{new Date(item.deleted_at).toLocaleString("vi-VN")}</td>
                <td className="p-4 text-center space-x-3">
                  <button onClick={() => handleRestore(item.id)} className="bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold">Khôi phục</button>
                  <button onClick={() => handleForceDelete(item.id)} className="bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold">Xóa vĩnh viễn</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}