"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatVND, API_URL } from "@/lib/api";

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (!savedUser) {
      alert("Vui lòng đăng nhập để thanh toán!");
      router.push("/user/login");
      return;
    }
    if (savedCart.length === 0) {
      alert("Giỏ hàng trống!");
      router.push("/");
      return;
    }

    setCart(savedCart);
    setUser(savedUser);
  }, [router]);

  const totalAmount = cart.reduce((t, i) => t + Number(i.price) * i.qty, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          user_id: user.id,
          total_amount: totalAmount,
          shipping_address: address,
          phone: phone,
          payment_method: paymentMethod,
          items: cart
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Đặt hàng thành công!");
        localStorage.removeItem("cart"); // Xóa giỏ hàng sau khi đặt thành công
        router.push("/"); // Chuyển về trang chủ hoặc trang lịch sử đơn hàng
      } else {
        alert(data.message || "Đặt hàng thất bại.");
      }
    } catch (error) {
      alert("Lỗi kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  if (!user || cart.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Thanh toán đơn hàng</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form nhập thông tin */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Thông tin giao hàng</h2>
          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Người nhận</label>
              <input type="text" value={user.name} disabled className="w-full border p-2 rounded bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Số điện thoại</label>
              <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500" placeholder="Nhập số điện thoại" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Địa chỉ nhận hàng</label>
              <textarea required value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500" rows={3} placeholder="Nhập địa chỉ chi tiết"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phương thức thanh toán</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full border p-2 rounded">
                <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                <option value="BankTransfer">Chuyển khoản ngân hàng</option>
              </select>
            </div>
            
            <button type="submit" disabled={loading} className="w-full mt-4 bg-red-600 text-white font-bold py-3 rounded hover:bg-red-700 transition">
              {loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
            </button>
          </form>
        </div>

        {/* Tóm tắt đơn hàng */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md border h-fit">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Tóm tắt đơn hàng</h2>
          <div className="space-y-4 mb-4 max-h-80 overflow-y-auto">
            {cart.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-500">SL: {item.qty}</p>
                </div>
                <div className="font-semibold text-gray-700">{formatVND(item.price * item.qty)}</div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 flex justify-between items-center">
            <span className="font-bold text-lg">Tổng cộng:</span>
            <span className="font-bold text-2xl text-red-600">{formatVND(totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}