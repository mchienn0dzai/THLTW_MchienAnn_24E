"use client";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    const res = await fetch(`${API_URL}/api/categories`);
    setCategories(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const openModal = (cat?: any) => {
    if (cat) {
      setEditId(cat.id);
      setName(cat.name);
    } else {
      setEditId(null);
      setName("");
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API_URL}/api/categories/${editId}` : `${API_URL}/api/categories`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });

    if (res.ok) {
      alert(editId ? "Sửa thành công!" : "Thêm thành công!");
      setIsModalOpen(false);
      fetchCategories();
    } else {
      alert("Thao tác thất bại!");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Đưa danh mục này vào thùng rác?")) return;
    await fetch(`${API_URL}/api/categories/${id}`, { method: "DELETE" });
    fetchCategories(); 
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Danh mục</h1>
        <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition">
          + Thêm danh mục mới
        </button>
      </div>

      {loading ? <div className="text-gray-500">Đang tải...</div> : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto border">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr><th className="p-4 border-b">ID</th><th className="p-4 border-b">Tên danh mục</th><th className="p-4 border-b text-center">Thao tác</th></tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{c.id}</td><td className="p-4 font-semibold">{c.name}</td>
                  <td className="p-4 text-center space-x-3">
                    <button onClick={() => openModal(c)} className="text-blue-600 hover:underline">Sửa</button>
                    <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:underline">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-96">
            <h2 className="text-xl font-bold mb-6">{editId ? "Sửa Danh mục" : "Thêm Danh mục"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên danh mục *</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded font-semibold hover:bg-gray-300">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}