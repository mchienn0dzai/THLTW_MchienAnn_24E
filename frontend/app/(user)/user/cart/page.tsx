"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatVND, imageUrl } from "@/lib/api";

interface CartItem {
  id: number;
  name: string;
  image?: string | null;
  price: number | string;
  qty: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      // Chỉ load giỏ hàng nếu đã đăng nhập
      const saved = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(saved.map((i: CartItem & { quantity?: number }) => ({ ...i, qty: i.qty ?? i.quantity ?? 1 })));
    } else {
      setIsLoggedIn(false);
    }
    setIsAuthReady(true);
  }, []);

  const save = (items: CartItem[]) => {
    setCart(items);
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const changeQty = (id: number, delta: number) =>
    save(cart.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)));

  const removeFromCart = (id: number) => save(cart.filter((i) => i.id !== id));

  const totalAmount = cart.reduce((t, i) => t + Number(i.price) * i.qty, 0);

  // Đợi kiểm tra auth xong (tránh nhấp nháy UI)
  if (!isAuthReady) return null; 

  // Xử lý khi chưa đăng nhập
  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="bg-white p-8 rounded-lg shadow-md text-center w-full max-w-lg border">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Bạn chưa đăng nhập!</h1>
          <p className="text-gray-600 mb-8">Vui lòng đăng nhập hệ thống để xem giỏ hàng và tiến hành đặt hàng.</p>
          <Link href="/user/login" className="bg-blue-600 text-white font-bold py-3 px-8 rounded hover:bg-blue-700 transition">
            Đến trang đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  // UI Giỏ hàng (Khi đã đăng nhập)
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-5xl mx-auto mt-6">
      <h1 className="text-2xl font-bold border-b pb-4 mb-4">Giỏ hàng của bạn</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500 py-8 text-center">
          Giỏ hàng đang trống.{" "}
          <Link href="/" className="text-blue-600 font-semibold underline hover:text-blue-800">
            Tiếp tục mua sắm
          </Link>
        </p>
      ) : (
        <>
          {cart.map((item) => {
            const img = imageUrl(item.image);
            return (
              <div key={item.id} className="flex justify-between items-center border-b py-4">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex items-center justify-center text-xs text-gray-400">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      "No image"
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">{item.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => changeQty(item.id, -1)} className="w-7 h-7 border rounded hover:bg-gray-100">−</button>
                      <span className="w-8 text-center">{item.qty}</span>
                      <button onClick={() => changeQty(item.id, 1)} className="w-7 h-7 border rounded hover:bg-gray-100">+</button>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-red-600 font-bold text-lg">{formatVND(Number(item.price) * item.qty)}</div>
                  <button onClick={() => removeFromCart(item.id)} className="text-sm text-gray-400 hover:text-red-500 underline mt-1">
                    Xóa
                  </button>
                </div>
              </div>
            );
          })}

          <div className="text-right mt-8 pt-4 border-t">
            <p className="text-xl font-semibold">
              Tổng thanh toán: <span className="text-red-600 text-2xl ml-2">{formatVND(totalAmount)}</span>
            </p>
            <Link href="/user/checkout" className="inline-block mt-6 bg-red-600 text-white font-bold px-8 py-3 rounded hover:bg-red-700 transition">
              Tiến hành Đặt hàng
            </Link>
          </div>
        </>
      )}
    </div>
  );
}