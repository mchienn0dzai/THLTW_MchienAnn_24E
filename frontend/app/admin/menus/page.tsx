"use client";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

export default function AdminMenusPage() {
  const [menus, setMenus] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", link: "", position: 1, is_hidden: false });

  const fetchMenus = async () => {
    const res = await fetch(`${API_URL}/api/menus`);
    if (res.ok) setMenus(await res.json());
  };

  useEffect(() => { fetchMenus(); }, []);

  const openModal = (m?: any) => {
    if (m) {
      setEditId(m.id);
      setFormData({ name: m.name, link: m.link, position: m.position || 1, is_hidden: Boolean(m.is_hidden) });
    } else {
      setEditId(null);
      setFormData({ name: "", link: "/", position: menus.length + 1, is_hidden: false });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API_URL}/api/menus/${editId}` : `${API_URL}/api/menus`;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setIsModalOpen(false);
      fetchMenus();
    } else {
      alert("Lỗi lưu menu!");
    }
  };

  const toggleHide = async (m: any) => {
    await fetch(`${API_URL}/api/menus/${m.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...m, is_hidden: !m.is_hidden }),
    });
    fetchMenus();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa menu này?")) return;
    await fetch(`${API_URL}/api/menus/${id}`, { method: "DELETE" });
    fetchMenus();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cấu hình Menu Website</h1>
        <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700">
          + Thêm Menu mới
        </button>
      </div>

      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-4 border-b">Thứ tự</th>
            <th className="p-4 border-b">Tên Menu</th>
            <th className="p-4 border-b">Đường dẫn (Link)</th>
            <th className="p-4 border-b">Trạng thái</th>
            <th className="p-4 border-b text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {menus.map((m) => (
            <tr key={m.id} className="border-b hover:bg-gray-50">
              <td className="p-4 font-bold">{m.position}</td>
              <td className="p-4 font-semibold">{m.name}</td>
              <td className="p-4 text-blue-600">{m.link}</td>
              <td className="p-4">
                <button
                  onClick={() => toggleHide(m)}
                  className={`px-3 py-1 rounded text-xs font-bold ${m.is_hidden ? "bg-gray-200 text-gray-600" : "bg-green-100 text-green-700"}`}
                >
                  {m.is_hidden ? "Đang ẩn (Bấm để hiện)" : "Hiển thị (Bấm để ẩn)"}
                </button>
              </td>
              <td className="p-4 text-center space-x-3">
                <button onClick={() => openModal(m)} className="text-blue-600 hover:underline font-medium">Sửa</button>
                <button onClick={() => handleDelete(m.id)} className="text-red-600 hover:underline font-medium">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-96">
            <h2 className="text-xl font-bold mb-4">{editId ? "Sửa Menu" : "Thêm Menu mới"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên Menu *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Đường dẫn (VD: /categories) *</label>
                <input required type="text" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Vị trí hiển thị</label>
                <input type="number" value={formData.position} onChange={e => setFormData({ ...formData, position: Number(e.target.value) })} className="w-full border p-2 rounded" />
              </div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={formData.is_hidden} onChange={e => setFormData({ ...formData, is_hidden: e.target.checked })} />
                <span className="text-sm">Ẩn menu này trên trang chủ</span>
              </label>
              <div className="flex justify-end space-x-2 pt-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-semibold">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}