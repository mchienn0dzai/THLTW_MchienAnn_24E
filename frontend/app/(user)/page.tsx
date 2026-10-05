"use client";
import { useEffect, useState } from "react";

// Định nghĩa kiểu dữ liệu sản phẩm
interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  // Gọi API lấy dữ liệu từ Backend Laravel
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Lỗi kết nối Backend:", err));
  }, []);

  // Hàm xử lý khi bấm nút "Thêm vào giỏ hàng"
  const addToCart = (product: Product) => {
    // 1. Lấy giỏ hàng hiện tại (nếu có)
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    
    // 2. Kiểm tra xem mặt hàng này đã có trong giỏ chưa
    const existingItem = cart.find((item: any) => item.id === product.id);
    if (existingItem) {
      existingItem.qty += 1; // Có rồi thì tăng số lượng
    } else {
      cart.push({ ...product, qty: 1 }); // Chưa có thì thêm mới
    }

    // 3. Lưu lại vào bộ nhớ
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Thông báo cho người dùng
    alert(`Đã thêm ${product.name} vào giỏ hàng thành công!`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Sản phẩm nổi bật</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow-md border hover:shadow-lg transition">
            {/* Khung chứa ảnh */}
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded mb-4 overflow-hidden">
              <span className="text-gray-400 italic">{product.image}</span>
            </div>
            
            <h2 className="text-lg font-bold text-gray-800 line-clamp-2">{product.name}</h2>
            <p className="text-red-600 font-bold text-xl my-3">
              {Number(product.price).toLocaleString("vi-VN")} đ
            </p>
            
            <button 
              onClick={() => addToCart(product)}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
            >
              Thêm vào giỏ hàng 🛒
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}