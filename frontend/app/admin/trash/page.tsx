"use client";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

export default function AdminTrashPage() {
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTrash = async (type: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/${type}/trash`);
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu thùng rác:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrash(activeTab);
  }, [activeTab]);

  const handleAction = async (id: number, action: "restore" | "force") => {
    const method = action === "restore" ? "POST" : "DELETE";
    const confirmMsg = action === "restore" ? "Khôi phục mục này?" : "Xóa VĨNH VIỄN mục này? (Không thể hoàn tác)";
    
    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`${API_URL}/api/${activeTab}/${id}/${action}`, { method });
      if (res.ok) {
        alert(action === "restore" ? "Khôi phục thành công!" : "Đã xóa vĩnh viễn!");
        fetchTrash(activeTab); // Tải lại danh sách
      } else {
        const data = await res.json();
        alert(data.message || "Thao tác thất bại.");
      }
    } catch (error) {
      alert("Lỗi kết nối máy chủ.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Thùng rác</h1>

      {/* Chuyển tab */}
      <div className="flex space-x-4 mb-6 border-b pb-4">
        <button 
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 font-semibold rounded ${activeTab === "products" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          Sản phẩm đã xóa
        </button>
        <button 
          onClick={() => setActiveTab("categories")}
          className={`px-4 py-2 font-semibold rounded ${activeTab === "categories" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          Danh mục đã xóa
        </button>
      </div>

      {loading ? (
        <div>Đang tải dữ liệu...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto border">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4 border-b">ID</th>
                <th className="p-4 border-b">Tên</th>
                <th className="p-4 border-b">Ngày xóa</th>
                <th className="p-4 border-b text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">Thùng rác trống.</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-semibold">{item.id}</td>
                    <td className="p-4 font-medium text-gray-800">{item.name}</td>
                    <td className="p-4 text-gray-500">{new Date(item.deleted_at).toLocaleString('vi-VN')}</td>
                    <td className="p-4 text-center space-x-3">
                      <button onClick={() => handleAction(item.id, "restore")} className="text-green-600 font-semibold hover:underline">
                        Khôi phục
                      </button>
                      <button onClick={() => handleAction(item.id, "force")} className="text-red-600 font-semibold hover:underline">
                        Xóa vĩnh viễn
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}