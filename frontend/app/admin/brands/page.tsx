"use client";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState("");

  const fetchBrands = () => fetch(`${API_URL}/api/brands`).then(res => res.json()).then(setBrands);
  useEffect(() => { fetchBrands(); }, []);

  const openModal = (brand?: any) => {
    if (brand) { setEditId(brand.id); setName(brand.name); } 
    else { setEditId(null); setName(""); }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API_URL}/api/brands/${editId}` : `${API_URL}/api/brands`;
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
    if (res.ok) { alert("Thành công!"); setIsModalOpen(false); fetchBrands(); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Xóa thương hiệu này?")) return;
    await fetch(`${API_URL}/api/brands/${id}`, { method: "DELETE" });
    fetchBrands();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Thương hiệu</h1>
        <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded font-semibold">
          + Thêm thương hiệu
        </button>
      </div>
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-gray-100 text-gray-700"><tr><th className="p-4 border-b">ID</th><th className="p-4 border-b">Tên</th><th className="p-4 border-b text-center">Thao tác</th></tr></thead>
        <tbody>
          {brands.map(b => (
            <tr key={b.id} className="border-b hover:bg-gray-50">
              <td className="p-4">{b.id}</td><td className="p-4 font-semibold">{b.name}</td>
              <td className="p-4 text-center space-x-4">
                <button onClick={() => openModal(b)} className="text-blue-600 hover:underline">Sửa</button>
                <button onClick={() => handleDelete(b.id)} className="text-red-600 hover:underline">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-96">
            <h2 className="text-xl font-bold mb-6">{editId ? "Sửa" : "Thêm"} Thương hiệu</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" placeholder="Tên thương hiệu..." /></div>
              <div className="flex justify-end space-x-3 mt-6">
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