"use client";
import { useEffect, useState } from "react";
import { API_URL, formatVND, imageUrl } from "@/lib/api";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  
  // Đã bổ sung thêm trường sale_price vào state
  const [formData, setFormData] = useState({
    name: "", category_id: "", brand_id: "", price: "", sale_price: "", stock_qty: "", image: ""
  });

  const fetchData = async () => {
    setLoading(true);
    const [resProds, resCats, resBrnds] = await Promise.all([
      fetch(`${API_URL}/api/products`), fetch(`${API_URL}/api/categories`), fetch(`${API_URL}/api/brands`)
    ]);
    setProducts(await resProds.json());
    setCategories(await resCats.json());
    setBrands(await resBrnds.json());
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
        sale_price: prod.sale_price || "", // Lấy giá giảm nếu có
        stock_qty: prod.stock_qty, 
        image: prod.image || ""
      });
    } else {
      setEditId(null);
      setFormData({ name: "", category_id: "", brand_id: "", price: "", sale_price: "", stock_qty: "", image: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // KIỂM TRA LOGIC GIÁ: Giá giảm phải nhỏ hơn Giá gốc
    if (formData.sale_price && Number(formData.sale_price) >= Number(formData.price)) {
      alert("❌ LỖI: Giá sau khi giảm phải NHỎ HƠN Giá gốc!");
      return; // Chặn không cho gửi API
    }

    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API_URL}/api/products/${editId}` : `${API_URL}/api/products`;

    // Chuyển đổi dữ liệu trước khi gửi để tránh lỗi nếu sale_price để trống
    const payload = {
      ...formData,
      sale_price: formData.sale_price === "" ? null : formData.sale_price
    };

    const res = await fetch(url, {
      method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
    });
    
    if (res.ok) {
      alert(editId ? "Sửa thành công!" : "Thêm thành công!");
      setIsModalOpen(false);
      fetchData();
    } else { alert("Thao tác thất bại. Vui lòng kiểm tra lại thông tin!"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Đưa sản phẩm này vào thùng rác?")) return;
    await fetch(`${API_URL}/api/products/${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Sản phẩm</h1>
        <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition">
          + Thêm sản phẩm mới
        </button>
      </div>

      {loading ? <div className="text-gray-500">Đang tải...</div> : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto border">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4 border-b">ID</th>
                <th className="p-4 border-b">Ảnh</th>
                <th className="p-4 border-b">Tên sản phẩm</th>
                <th className="p-4 border-b">Giá gốc</th>
                <th className="p-4 border-b text-red-600">Giá khuyến mãi</th>
                <th className="p-4 border-b">Kho</th>
                <th className="p-4 border-b text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const imgSrc = imageUrl(p.image);
                return (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{p.id}</td>
                    <td className="p-4">{imgSrc ? <img src={imgSrc} alt={p.name} className="w-12 h-12 object-contain bg-gray-100 rounded" /> : <div className="w-12 h-12 bg-gray-200 rounded text-[10px] flex justify-center items-center">Trống</div>}</td>
                    <td className="p-4 font-semibold">{p.name}</td>
                    <td className="p-4 font-medium">{formatVND(p.price)}</td>
                    <td className="p-4 font-bold text-red-600">{p.sale_price ? formatVND(p.sale_price) : "-"}</td>
                    <td className="p-4">{p.stock_qty}</td>
                    <td className="p-4 text-center space-x-3">
                      <button onClick={() => openModal(p)} className="text-blue-600 hover:underline">Sửa</button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">Xóa</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL THÊM/SỬA SẢN PHẨM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-6">{editId ? "Sửa Sản phẩm" : "Thêm Sản phẩm"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div><label className="block text-sm font-medium mb-1">Tên sản phẩm *</label><input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" /></div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Danh mục *</label>
                  <select required value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500">
                    <option value="">-- Chọn Danh mục --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Thương hiệu *</label>
                  <select required value={formData.brand_id} onChange={e => setFormData({...formData, brand_id: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500">
                    <option value="">-- Chọn Thương hiệu --</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>

                {/* Bổ sung ô nhập Giá khuyến mãi bên cạnh Giá gốc */}
                <div>
                  <label className="block text-sm font-medium mb-1">Giá gốc (VNĐ) *</label>
                  <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-red-600">Giá khuyến mãi (VNĐ)</label>
                  <input type="number" min="0" value={formData.sale_price} onChange={e => setFormData({...formData, sale_price: e.target.value})} placeholder="Bỏ trống nếu không giảm" className="w-full border p-2 rounded focus:ring-2 focus:ring-red-500" />
                </div>

                <div><label className="block text-sm font-medium mb-1">Số lượng kho</label><input type="number" min="0" value={formData.stock_qty} onChange={e => setFormData({...formData, stock_qty: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-sm font-medium mb-1">Link Ảnh (Tùy chọn)</label><input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" /></div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded font-semibold hover:bg-gray-300">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700">Lưu sản phẩm</button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}