"use client";
import { useEffect, useState } from "react";
import { API_URL, formatVND, imageUrl } from "@/lib/api";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [folderImages, setFolderImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Bộ lọc tìm kiếm theo Danh mục cha & Thương hiệu
  const [filterCat, setFilterCat] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", category_id: "", brand_id: "", price: "", sale_price: "", stock_qty: "10", image: "", description: ""
  });

  const fetchData = async () => {
    setLoading(true);
    const [resProds, resCats, resBrnds, resImgs] = await Promise.all([
      fetch(`${API_URL}/api/products`),
      fetch(`${API_URL}/api/categories`),
      fetch(`${API_URL}/api/brands`),
      fetch(`${API_URL}/api/product-images`),
    ]);
    setProducts(await resProds.json());
    setCategories(await resCats.json());
    setBrands(await resBrnds.json());
    if (resImgs.ok) setFolderImages(await resImgs.json());
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openModal = (prod?: any) => {
    if (prod) {
      setEditId(prod.id);
      setFormData({
        name: prod.name,
        category_id: prod.category_id,
        brand_id: prod.brand_id,
        price: prod.price,
        sale_price: prod.sale_price || "",
        stock_qty: prod.stock_qty ?? 10,
        image: prod.image || "",
        description: prod.description || "",
      });
    } else {
      setEditId(null);
      setFormData({
        name: "",
        category_id: filterCat !== "all" ? filterCat : "",
        brand_id: filterBrand !== "all" ? filterBrand : "",
        price: "",
        sale_price: "",
        stock_qty: "10",
        image: "",
        description: "",
      });
    }
    setIsModalOpen(true);
  };

  // Xử lý chọn file từ máy tính -> tự động lưu vào folder /images/products/
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const body = new FormData();
    body.append("image", file);
    try {
      const res = await fetch(`${API_URL}/api/upload-image`, { method: "POST", body });
      const data = await res.json();
      if (res.ok && data.path) {
        setFormData((prev) => ({ ...prev, image: data.path }));
        fetchData();
      } else {
        alert("Lỗi tải ảnh lên folder!");
      }
    } catch {
      alert("Không thể tải ảnh!");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image.trim()) {
      alert("❌ Bắt buộc phải chọn ảnh sản phẩm (không được để trống ảnh)!");
      return;
    }
    if (formData.sale_price && Number(formData.sale_price) >= Number(formData.price)) {
      alert("❌ Giá khuyến mãi phải NHỎ HƠN Giá gốc!");
      return;
    }

    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API_URL}/api/products/${editId}` : `${API_URL}/api/products`;
    const payload = { ...formData, sale_price: formData.sale_price === "" ? null : formData.sale_price };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (res.ok) {
      alert(editId ? "Cập nhật thành công!" : "Thêm sản phẩm thành công!");
      setIsModalOpen(false);
      fetchData();
    } else {
      alert(result.message || "Lỗi lưu sản phẩm!");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Đưa sản phẩm này vào thùng rác?")) return;
    await fetch(`${API_URL}/api/products/${id}`, { method: "DELETE" });
    fetchData();
  };

  const filteredProducts = products.filter((p) => {
    const matchCat = filterCat === "all" || String(p.category_id) === String(filterCat);
    const matchBrand = filterBrand === "all" || String(p.brand_id) === String(filterBrand);
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchBrand && matchSearch;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Quản lý Sản phẩm ({filteredProducts.length})</h1>
        <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
          + Thêm sản phẩm mới
        </button>
      </div>

      {/* THANH THƯ MỤC CHA (DANH MỤC) & LỌC THƯƠNG HIỆU */}
      <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase mb-2">📁 Thư mục Danh mục sản phẩm:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterCat("all")}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition ${filterCat === "all" ? "bg-blue-600 text-white border-blue-600" : "bg-gray-50 hover:bg-gray-100"}`}
            >
              Tất cả ({products.length})
            </button>
            {categories.map((c) => {
              const count = products.filter((p) => p.category_id === c.id).length;
              return (
                <button
                  key={c.id}
                  onClick={() => setFilterCat(String(c.id))}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition ${filterCat === String(c.id) ? "bg-blue-600 text-white border-blue-600" : "bg-gray-50 hover:bg-gray-100"}`}
                >
                  📁 {c.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-2 border-t">
          <div className="flex-1 min-w-[220px]">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm tên sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border p-2 rounded-lg text-sm"
            />
          </div>
          <div>
            <select
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className="border p-2 rounded-lg text-sm font-medium bg-white"
            >
              <option value="all">🏷️ Tất cả Thương hiệu</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>Thương hiệu: {b.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? <div className="text-gray-500">Đang tải...</div> : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto border">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4 border-b">ID</th>
                <th className="p-4 border-b">Ảnh</th>
                <th className="p-4 border-b">Tên sản phẩm</th>
                <th className="p-4 border-b">Danh mục / Hãng</th>
                <th className="p-4 border-b">Giá gốc</th>
                <th className="p-4 border-b text-red-600">Giá giảm</th>
                <th className="p-4 border-b">Kho</th>
                <th className="p-4 border-b text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                const imgSrc = imageUrl(p.image);
                return (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{p.id}</td>
                    <td className="p-4">
                      {imgSrc ? <img src={imgSrc} alt={p.name} className="w-12 h-12 object-contain bg-gray-50 rounded border" /> : <div className="w-12 h-12 bg-gray-200 rounded text-[10px] flex justify-center items-center">Trống</div>}
                    </td>
                    <td className="p-4 font-semibold">{p.name}</td>
                    <td className="p-4 text-xs text-gray-600">
                      <div className="font-semibold text-blue-600">{p.category?.name}</div>
                      <div>{p.brand?.name}</div>
                    </td>
                    <td className="p-4 font-medium">{formatVND(p.price)}</td>
                    <td className="p-4 font-bold text-red-600">{p.sale_price ? formatVND(p.sale_price) : "-"}</td>
                    <td className="p-4">{p.stock_qty}</td>
                    <td className="p-4 text-center space-x-3">
                      <button onClick={() => openModal(p)} className="text-blue-600 hover:underline font-semibold">Sửa</button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline font-semibold">Xóa</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editId ? "Sửa Sản phẩm" : "Thêm Sản phẩm mới"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên sản phẩm * (Cho phép trùng tên)</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border p-2 rounded" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Danh mục *</label>
                  <select required value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })} className="w-full border p-2 rounded">
                    <option value="">-- Chọn Danh mục --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Thương hiệu *</label>
                  <select required value={formData.brand_id} onChange={e => setFormData({ ...formData, brand_id: e.target.value })} className="w-full border p-2 rounded">
                    <option value="">-- Chọn Thương hiệu --</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Giá gốc (VNĐ) *</label>
                  <input required type="number" min="0" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-red-600">Giá khuyến mãi (Nhỏ hơn giá gốc)</label>
                  <input type="number" min="0" value={formData.sale_price} onChange={e => setFormData({ ...formData, sale_price: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Số lượng kho *</label>
                  <input required type="number" min="0" value={formData.stock_qty} onChange={e => setFormData({ ...formData, stock_qty: e.target.value })} className="w-full border p-2 rounded" />
                </div>
              </div>

              {/* CHỌN ẢNH LƯU VÀO FOLDER /images/products/ - BẮT BUỘC */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-3">
                <label className="block text-sm font-bold text-blue-800">Hình ảnh sản phẩm * (Bắt buộc có đường dẫn trong folder)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-gray-600 block mb-1">Cách 1: Chọn file ảnh từ máy (Tự lưu vào folder)</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="text-xs w-full bg-white p-1.5 border rounded" />
                    {uploading && <span className="text-xs text-blue-600">Đang tải ảnh vào folder...</span>}
                  </div>
                  <div>
                    <span className="text-xs text-gray-600 block mb-1">Cách 2: Chọn ảnh có sẵn trong folder `/images/products`</span>
                    <select
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full border p-2 rounded text-xs bg-white"
                    >
                      <option value="">-- Chọn ảnh trong folder --</option>
                      {folderImages.map((img) => (
                        <option key={img} value={img}>{img}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-600 block mb-1">Đường dẫn ảnh đã chọn *:</span>
                  <input
                    required
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/images/products/ten-anh.svg"
                    className="w-full border p-2 rounded text-sm bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mô tả sản phẩm</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full border p-2 rounded" />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded font-semibold">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-semibold">Lưu sản phẩm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}