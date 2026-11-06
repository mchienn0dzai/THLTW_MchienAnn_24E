"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Đăng nhập thất bại!");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token || "");

      // Phân quyền điều hướng theo sơ đồ Giảng viên: Admin -> /admin, User -> /user/profile
      if (data.user.role === "admin" || data.user.email?.includes("admin")) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/user/profile";
      }
    } catch {
      setError("Lỗi kết nối máy chủ!");
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg border w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Đăng nhập Tài khoản</h1>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm font-semibold">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-2.5 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu *</label>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-2.5 rounded-lg" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700">
            Đăng nhập
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Chưa có tài khoản? <Link href="/user/register" className="text-blue-600 font-semibold hover:underline">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}