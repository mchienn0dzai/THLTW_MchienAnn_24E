"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Xóa lỗi cũ trước khi gửi

    try {
      // Gọi API sang Backend Laravel
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Nếu thành công: Lưu Token vào trình duyệt và chuyển về trang chủ
        localStorage.setItem("token", data.token);
        alert("Đăng nhập thành công!");
        router.push("/"); // Chuyển hướng về trang chủ
      } else {
        // Nếu thất bại: Báo lỗi từ backend trả về
        setError(data.message || "Email hoặc mật khẩu không chính xác!");
      }
    } catch (err) {
      console.error("Lỗi chi tiết:", err);
      setError("Không thể kết nối đến máy chủ Backend. Hãy kiểm tra lại!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Đăng Nhập Hệ Thống
        </h2>
        
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Email của bạn
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 text-gray-900 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="nhapemail@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 text-gray-900 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Đăng Nhập
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}