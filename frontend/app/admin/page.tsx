"use client";
import { useCallback, useEffect, useState } from "react";
import { API_URL, Brand, Category, Product, finalPrice, formatVND, imageUrl } from "@/lib/api";

const emptyForm = {
  name: "",
  category_id: "",
  brand_id: "",
  price: "",
  sale_price: "",
  stock_qty: "0",
  image: "",
  description: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const loadProducts = useCallback(() => {
    fetch(`${API_URL}/api/products`)
      .then((r) => r.json())
      .then((d) => setProducts(Array.isArray(d) ? d : []))
      .catch(() => setError("Không kết nối được backend (php artisan serve)."));
  }, []);

  useEffect(() => {
    loadProducts();
    fetch(`${API_URL}/api/categories`).then((r) => r.json()).then(setCategories).catch(() => {});
    fetch(`${API_URL}/api/brands`).then((r) => r.json()).then(setBrands).catch(() => {});
  }, [loadProducts]);

  const set = (k: keyof typeof emptyForm, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const openAdd = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      category_id: categories[0] ? String(categories[0].id) : "",
      brand_id: brands[0] ? String(brands[0].id) : "",
    });
    setError("");
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      category_id: String(p.category_id),
      brand_id: String(p.brand_id),
      price: String(p.price),
      sale_price: p.sale_price ? String(p.sale_price) : "",
      stock_qty: String(p.stock_qty),
      image: p.image ?? "",
      description: p.description ?? "",
    });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const payload = {
      name: form.name,
      category_id: Number(form.category_id),
      brand_id: Number(form.brand_id),
      price: Number(form.price),
      sale_price: form.sale_price ? Number(form.sale_price) : null,
      stock_qty: Number(form.stock_qty || 0),
      image: form.image || null,
      description: form.description || null,
    };

    try {
      const res = await fetch(
        editingId ? `${API_URL}/api/products/${editingId}` : `${API_URL}/api/products`,
        {
          method: editingId ? "PUT" : "POST",
          // Accept: application/json để Laravel trả lỗi validate dạng JSON (422) thay vì redirect
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setShowForm(false);
        loadProducts();
      } else if (data.errors) {
        setError(Object.values(data.errors).flat().join(" | "));
      } else {
        setError(data.message || "Có lỗi xảy ra khi lưu vào CSDL.");
      }
    } catch {
      setError("Lỗi kết nối đến máy chủ Backend.");
    }
  };

  const handleDelete = async (p: Product) => {
    if (!confirm(`Xóa sản phẩm "${p.name}"?`)) return;
    const res = await fetch(`${API_URL}/api/products/${p.id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });
    if (res.ok) loadProducts();
    else alert("Không xóa được sản phẩm.");
  };

  const inputCls = "w-full border p-2 rounded mt-1";

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Sản phẩm</h1>
        <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700">
          + Thêm sản phẩm mới
        </button>
      </div>

      {error && !showForm && <div className="mb-4 text-red-600 bg-red-50 p-3 rounded">{error}</div>}

      <div className="bg-white rounded-lg shadow overflow-x-auto border">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-3 px-4 font-semibold text-gray-600">ID</th>
              <th className="py-3 px-4 font-semibold text-gray-600">Ảnh</th>
              <th className="py-3 px-4 font-semibold text-gray-600">Tên sản phẩm</th>
              <th className="py-3 px-4 font-semibold text-gray-600">Danh mục</th>
              <th className="py-3 px-4 font-semibold text-gray-600">Thương hiệu</th>
              <th className="py-3 px-4 font-semibold text-gray-600">Giá bán</th>
              <th className="py-3 px-4 font-semibold text-gray-600">Kho</th>
              <th className="py-3 px-4 font-semibold text-gray-600 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">Chưa có sản phẩm nào trong kho.</td>
              </tr>
            ) : (
              products.map((p) => {
                const img = imageUrl(p.image);
                return (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{p.id}</td>
                    <td className="py-3 px-4">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt={p.name} className="w-14 h-10 object-cover rounded" />
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium">{p.name}</td>
                    <td className="py-3 px-4">{p.category?.name}</td>
                    <td className="py-3 px-4">{p.brand?.name}</td>
                    <td className="py-3 px-4 text-red-600 font-semibold">{formatVND(finalPrice(p))}</td>
                    <td className="py-3 px-4">{p.stock_qty}</td>
                    <td className="py-3 px-4 text-center space-x-3">
                      <button onClick={() => openEdit(p)} className="text-blue-500 hover:underline">Sửa</button>
                      <button onClick={() => handleDelete(p)} className="text-red-500 hover:underline">Xóa</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {editingId ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
            </h2>
            {error && <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                <input required value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} placeholder="Ví dụ: iPhone 15 Pro Max" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Danh mục</label>
                  <select required value={form.category_id} onChange={(e) => set("category_id", e.target.value)} className={inputCls}>
                    <option value="" disabled>-- Chọn --</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Thương hiệu</label>
                  <select required value={form.brand_id} onChange={(e) => set("brand_id", e.target.value)} className={inputCls}>
                    <option value="" disabled>-- Chọn --</option>
                    {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Giá gốc (VNĐ)</label>
                  <input type="number" min={0} required value={form.price} onChange={(e) => set("price", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Giá khuyến mãi</label>
                  <input type="number" min={0} value={form.sale_price} onChange={(e) => set("sale_price", e.target.value)} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tồn kho</label>
                  <input type="number" min={0} value={form.stock_qty} onChange={(e) => set("stock_qty", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ảnh (tên file hoặc URL)</label>
                  <input value={form.image} onChange={(e) => set("image", e.target.value)} className={inputCls} placeholder="iphone-15.svg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} className={inputCls} />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Hủy bỏ</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Lưu Sản Phẩm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
