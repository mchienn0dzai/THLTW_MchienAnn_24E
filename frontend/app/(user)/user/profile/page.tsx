"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL, formatVND } from "@/lib/api";

export default function UserProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (!saved) {
      router.push("/user/login");
      return;
    }
    const u = JSON.parse(saved);
    setUser(u);
    setFormData({ name: u.name || "", phone: u.phone || "", address: u.address || "" });

    fetch(`${API_URL}/api/orders`)
      .then((r) => r.json())
      .then((allOrders) => {
        if (Array.isArray(allOrders)) {
          const myOrders = allOrders.filter(
            (o: any) =>
              o.user_id === u.id ||
              (u.email && (o.email === u.email || o.customer_email === u.email)) ||
              (u.phone && (o.phone === u.phone || o.customer_phone === u.phone)) ||
              o.name === u.name ||
              o.customer_name === u.name
          );
          setOrders(myOrders);
        }
      });
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const res = await fetch(`${API_URL}/api/users/${user.id}/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      alert("Cập nhật thông tin cá nhân thành công!");
    } else {
      alert(data.message || "Lỗi cập nhật!");
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl space-y-8">
      {/* THÔNG TIN CÁ NHÂN (PROFILE) */}
      <div className="bg-white p-6 rounded-2xl shadow-md border">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">👤 Hồ sơ cá nhân</h1>
        <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Họ và tên</label>
            <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border p-2 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email (Không đổi)</label>
            <input disabled type="email" value={user.email} className="w-full border p-2 rounded-lg bg-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Số điện thoại</label>
            <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full border p-2 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Địa chỉ giao hàng mặc định</label>
            <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full border p-2 rounded-lg" />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>

      {/* DANH SÁCH ĐƠN HÀNG ĐÃ ĐẶT */}
      <div className="bg-white p-6 rounded-2xl shadow-md border">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📦 Danh sách Đơn hàng của tôi ({orders.length})</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="border rounded-xl p-4 hover:shadow-sm">
                <div className="flex flex-wrap justify-between items-center border-b pb-2 mb-3">
                  <div>
                    <span className="font-bold text-blue-600 mr-3">Đơn hàng #{o.id}</span>
                    <span className="text-xs text-gray-500">Ngày đặt: {new Date(o.created_at).toLocaleString("vi-VN")}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">{o.status}</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Địa chỉ nhận: {o.address || o.shipping_address} | Thanh toán: <strong>{o.payment_method || "COD"}</strong>
                </div>
                {o.items && o.items.length > 0 && (
                  <div className="bg-gray-50 p-3 rounded text-xs space-y-1 mb-2">
                    {o.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between">
                        <span>• {item.product?.name || `Sản phẩm #${item.product_id}`} (x{item.quantity || item.qty || 1})</span>
                        <span className="font-semibold">{formatVND(item.price)}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-right font-bold text-red-600">
                  Tổng thanh toán: {formatVND(o.total_amount || o.total)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}