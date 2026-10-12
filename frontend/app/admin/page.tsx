"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL, formatVND, imageUrl } from "@/lib/api";

export default function AdminUnifiedPage() {
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu cho cả 2 tab
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resProds, resCats] = await Promise.all([
        fetch(`${API_URL}/api/products`),
        fetch(`${API_URL}/api/categories`)
      ]);
      setProducts(await resProds.json());
      setCategories(await resCats.json());
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Hàm xử lý Xóa (Đưa vào thùng rác)
  const handleDelete = async (id: number, type: "products" | "categories") => {
    if (!confirm("Bạn có chắc chắn muốn xóa mục này (có thể khôi phục trong thùng rác)?")) return;
    try {
      const res = await fetch(`${API_URL}/api/${type}/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Đã đưa vào thùng rác!");
        fetchData(); // Tải lại bảng
      } else {
        const data = await res.json();
        alert(data.message || "Xóa thất bại!");
      }
    } catch (error) {
      alert("Lỗi kết nối máy chủ.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Kho hàng</h1>
        <div className="flex space-x-3">
          <Link href="/admin/trash" className="bg-gray-500 text-white px-4 py-2 rounded font-semibold hover:bg-gray-600 transition flex items-center">
            🗑️ Thùng rác
          </Link>
          {activeTab === "products" ? (
            <button className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition">
              + Thêm sản phẩm mới
            </button>
          ) : (
            <button className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition">
              + Thêm danh mục mới
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b pb-4">
        <button 
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 font-semibold rounded transition ${activeTab === "products" ? "bg-blue-600 text-white shadow" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
        >
          Sản phẩm
        </button>
        <button 
          onClick={() => setActiveTab("categories")}
          className={`px-4 py-2 font-semibold rounded transition ${activeTab === "categories" ? "bg-blue-600 text-white shadow" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
        >
          Danh mục Sản phẩm
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500 font-semibold">Đang tải dữ liệu...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto border">
          {/* BẢNG SẢN PHẨM */}
          {activeTab === "products" && (
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-4 border-b">ID</th>
                  <th className="p-4 border-b">Ảnh</th>
                  <th className="p-4 border-b">Tên sản phẩm</th>
                  <th className="p-4 border-b">Danh mục</th>
                  <th className="p-4 border-b">Thương hiệu</th>
                  <th className="p-4 border-b">Giá bán</th>
                  <th className="p-4 border-b">Kho</th>
                  <th className="p-4 border-b text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{p.id}</td>
                    <td className="p-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imageUrl(p.image) || ""} alt={p.name} className="w-12 h-12 object-contain bg-gray-100 rounded" />
                    </td>
                    <td className="p-4 font-semibold">{p.name}</td>
                    <td className="p-4">{p.category?.name}</td>
                    <td className="p-4">{p.brand?.name}</td>
                    <td className="p-4 font-bold text-red-600">{formatVND(p.price)}</td>
                    <td className="p-4">{p.stock_qty}</td>
                    <td className="p-4 text-center space-x-3">
                      <button className="text-blue-600 hover:underline">Sửa</button>
                      <button onClick={() => handleDelete(p.id, "products")} className="text-red-600 hover:underline">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* BẢNG DANH MỤC */}
          {activeTab === "categories" && (
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-4 border-b">ID</th>
                  <th className="p-4 border-b">Tên danh mục</th>
                  <th className="p-4 border-b">Slug</th>
                  <th className="p-4 border-b">Số SP</th>
                  <th className="p-4 border-b text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{c.id}</td>
                    <td className="p-4 font-semibold">{c.name}</td>
                    <td className="p-4 text-gray-500">{c.slug}</td>
                    <td className="p-4">{c.products_count || 0}</td>
                    <td className="p-4 text-center space-x-3">
                      <button className="text-blue-600 hover:underline">Sửa</button>
                      <button onClick={() => handleDelete(c.id, "categories")} className="text-red-600 hover:underline">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}