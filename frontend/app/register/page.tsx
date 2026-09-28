"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Xóa lỗi cũ trước khi gửi

    try {
      // Gọi API sang Backend Laravel
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Nếu thành công: Lưu Token và chuyển về trang chủ
        localStorage.setItem("token", data.token);
        alert("Đăng ký thành công!");
        router.push("/");
      } else {
        // Xử lý báo lỗi chi tiết từ Laravel (ví dụ: trùng email)
        if (data.errors) {
          const firstError = Object.values(data.errors)[0] as string[];
          setError(firstError[0]);
        } else {
          setError(data.message || "Đăng ký thất bại. Vui lòng kiểm tra lại!");
        }
      }
    } catch {
      setError("Không thể kết nối đến máy chủ Backend. Hãy kiểm tra lại!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-10 bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Đăng Ký Tài Khoản
        </h2>

        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Họ và tên</label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-2 text-gray-900 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập họ và tên"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 text-gray-900 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="nhapemail@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Mật khẩu (ít nhất 6 ký tự)</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="w-full px-4 py-2 text-gray-900 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Số điện thoại (Tùy chọn)</label>
            <input
              type="text"
              name="phone"
              className="w-full px-4 py-2 text-gray-900 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="0912345678"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Địa chỉ giao hàng (Tùy chọn)</label>
            <input
              type="text"
              name="address"
              className="w-full px-4 py-2 text-gray-900 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Số nhà, Tên đường..."
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none"
          >
            Đăng Ký
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}