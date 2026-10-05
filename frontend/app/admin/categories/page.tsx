"use client";
import { useCallback, useEffect, useState } from "react";
import { API_URL, Category } from "@/lib/api";

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(() => {
    fetch(`${API_URL}/api/categories`)
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => setError("Không kết nối được backend (php artisan serve)."));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch(`${API_URL}/api/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setName("");
      load();
    } else {
      setError(data.errors ? Object.values(data.errors).flat().join(" | ") : data.message || "Lỗi khi thêm danh mục.");
    }
  };

  const remove = async (c: Category) => {
    if (!confirm(`Xóa danh mục "${c.name}"?`)) return;
    const res = await fetch(`${API_URL}/api/categories/${c.id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) load();
    else alert(data.message || "Không xóa được danh mục.");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Danh mục</h1>

      <form onSubmit={add} className="flex gap-3 mb-6">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên danh mục mới, ví dụ: Máy ảnh"
          className="border p-2 rounded w-72"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700">+ Thêm danh mục</button>
      </form>

      {error && <div className="mb-4 text-red-600 bg-red-50 p-3 rounded">{error}</div>}

      <div className="bg-white rounded-lg shadow overflow-hidden border max-w-2xl">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Tên danh mục</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4">Số SP</th>
              <th className="py-3 px-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{c.id}</td>
                <td className="py-3 px-4 font-medium">{c.name}</td>
                <td className="py-3 px-4 text-gray-500">{c.slug}</td>
                <td className="py-3 px-4">{c.products_count ?? 0}</td>
                <td className="py-3 px-4 text-center">
                  <button onClick={() => remove(c)} className="text-red-500 hover:underline">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
