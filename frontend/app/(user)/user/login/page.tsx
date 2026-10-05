"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.data));
        
        if (data.data.role === 1) {
          router.push("/admin");
        } else {
          router.push("/"); // Chuyển về trang chủ
        }
      } else {
        setError(data.message || "Đăng nhập thất bại.");
      }
    } catch (err) {
      setError("Không thể kết nối đến máy chủ.");
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Đăng nhập hệ thống</h1>
        
        {error && <div className="mb-4 text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div><label className="block text-sm mb-1">Email</label><input type="email" className="w-full border p-2 rounded" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div><label className="block text-sm mb-1">Mật khẩu</label><input type="password" className="w-full border p-2 rounded" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Đăng nhập</button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Chưa có tài khoản? 
          {/* Sửa đường dẫn link sang /user/register */}
          <Link href="/user/register" className="text-blue-600 hover:underline"> Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}