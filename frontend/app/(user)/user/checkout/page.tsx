"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL, formatVND } from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    payment_method: "COD",
  });

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);
      setFormData((prev) => ({
        ...prev,
        name: u.name || "",
        email: u.email || "",
        phone: u.phone || "",
        address: u.address || "",
      }));
    }
  }, []);

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Giỏ hàng trống!");

    const res = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        ...formData,
        user_id: user?.id || null,
        total_amount: totalAmount,
        items: cart,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert(`🎉 Đặt hàng thành công! Thông tin xác nhận đơn hàng đã được ghi nhận cho email: ${formData.email}`);
      localStorage.removeItem("cart");
      router.push(user ? "/user/profile" : "/");
    } else {
      alert(data.message || "Đặt hàng thất bại!");
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">Thanh toán Đơn hàng</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md border space-y-4">
          <h2 className="text-xl font-bold border-b pb-2">Thông tin người nhận</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Họ và tên *</label>
            <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border p-2.5 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email nhận hóa đơn điện tử *</label>
            <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="example@gmail.com" className="w-full border p-2.5 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Số điện thoại *</label>
            <input required type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full border p-2.5 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Địa chỉ giao hàng *</label>
            <input required type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full border p-2.5 rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phương thức thanh toán *</label>
            <select value={formData.payment_method} onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })} className="w-full border p-2.5 rounded-lg font-semibold">
              <option value="COD">Thanh toán khi nhận hàng (COD)</option>
              <option value="ONLINE_QR">Thanh toán Online (Chuyển khoản VietQR / VNPAY)</option>
            </select>
          </div>

          {/* HIỂN THỊ MÃ QR KHI CHỌN THANH TOÁN ONLINE */}
          {formData.payment_method === "ONLINE_QR" && (
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-center space-y-2">
              <p className="font-bold text-blue-800 text-sm">Quét mã VietQR để thanh toán Online</p>
              <img
                src={`https://img.vietqr.io/image/MB-0399069615-compact2.png?amount=${totalAmount}&addInfo=ESHOP%20THANH%20TOAN`}
                alt="VietQR"
                className="w-48 mx-auto rounded-lg border shadow-sm"
              />
              <p className="text-xs text-gray-600">Số tiền: <strong className="text-red-600">{formatVND(totalAmount)}</strong></p>
            </div>
          )}

          <button type="submit" className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-blue-700">
            XÁC NHẬN ĐẶT HÀNG
          </button>
        </form>

        <div className="bg-white p-6 rounded-2xl shadow-md border h-fit">
          <h2 className="text-xl font-bold border-b pb-2 mb-4">Đơn hàng của bạn ({cart.length} món)</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-2 text-sm">
                <div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-xs text-gray-500">Số lượng: {item.qty}</div>
                </div>
                <div className="font-bold text-red-600">{formatVND(item.price * item.qty)}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center text-xl font-extrabold text-red-600 pt-4 border-t mt-4">
            <span>Tổng thanh toán:</span>
            <span>{formatVND(totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}