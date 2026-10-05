"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);

  // Lấy dữ liệu giỏ hàng ngay khi vừa mở trang
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  // Tính tổng tiền
  const totalAmount = cart.reduce((total, item) => total + Number(item.price) * item.qty, 0);

  // Hàm xóa sản phẩm khỏi giỏ
  const removeFromCart = (id: number) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold border-b pb-4 mb-4">Giỏ hàng của bạn</h1>
      
      {cart.length === 0 ? (
        <p className="text-gray-500 py-8 text-center">
          Giỏ hàng đang trống. <Link href="/" className="text-blue-600 font-semibold underline hover:text-blue-800">Tiếp tục mua sắm</Link>
        </p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b py-4">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                  {item.image}
                </div>
                <div>
                  <h2 className="font-semibold text-lg">{item.name}</h2>
                  <p className="text-gray-500">Số lượng: x{item.qty}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-red-600 font-bold text-lg">
                  {(Number(item.price) * item.qty).toLocaleString("vi-VN")} đ
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)} 
                  className="text-sm text-gray-400 hover:text-red-500 underline mt-1"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}

          <div className="text-right mt-8 pt-4 border-t">
            <p className="text-xl font-semibold">
              Tổng thanh toán: <span className="text-red-600 text-2xl ml-2">{totalAmount.toLocaleString("vi-VN")} đ</span>
            </p>
            <button className="mt-6 bg-red-600 text-white font-bold px-8 py-3 rounded hover:bg-red-700 transition">
              Tiến hành Đặt hàng
            </button>
          </div>
        </>
      )}
    </div>
  );
}