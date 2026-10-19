"use client";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState("");

  const fetchCategories = async () => {
    const res = await fetch(`${API_URL}/api/categories`);
    if (res.ok) setCategories(await res.json());
  };

  useEffect(() => { fetchCategories(); }, []);

  const openModal = (cat?: any) => {
    setEditId(cat ? cat.id : null);
    setName(cat ? cat.name : "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API_URL}/api/categories/${editId}` : `${API_URL}/api/categories`;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      setIsModalOpen(false);
      fetchCategories();
    }
  };

  const handleDelete = async (cat: any) => {
    if (cat.products_count > 0) {
      alert(`❌ Không thể xóa! Danh mục "${cat.name}" đang chứa ${cat.products_count} sản phẩm (tránh lỗi đơn hàng của khách).`);
      return;
    }
    if (!confirm(`Đưa danh mục "${cat.name}" vào thùng rác?`)) return;
    const res = await fetch(`${API_URL}/api/categories/${cat.id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Không thể xóa danh mục này!");
    } else {
      fetchCategories();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Danh mục</h1>
        <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded font-semibold">
          + Thêm danh mục mới
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md border overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4 border-b">ID</th>
              <th className="p-4 border-b">Tên danh mục</th>
              <th className="p-4 border-b">Slug</th>
              <th className="p-4 border-b">Số sản phẩm</th>
              <th className="p-4 border-b text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{c.id}</td>
                <td className="p-4 font-semibold">{c.name}</td>
                <td className="p-4 text-gray-500">{c.slug}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold ${c.products_count > 0 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                    {c.products_count || 0} sản phẩm
                  </span>
                </td>
                <td className="p-4 text-center space-x-3">
                  <button onClick={() => openModal(c)} className="text-blue-600 hover:underline font-medium">Sửa</button>
                  <button onClick={() => handleDelete(c)} className="text-red-600 hover:underline font-medium">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-96">
            <h2 className="text-xl font-bold mb-4">{editId ? "Sửa Danh mục" : "Thêm Danh mục"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Tên danh mục..." className="w-full border p-2 rounded" />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}