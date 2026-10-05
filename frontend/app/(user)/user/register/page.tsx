"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, address }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Đăng ký thành công! Đang chuyển hướng...");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.data));
        
        // Sửa đường dẫn chuyển hướng về trang đăng nhập
        setTimeout(() => router.push("/user/login"), 2000); 
      } else {
        setError(data.message || "Lỗi đăng ký, vui lòng kiểm tra lại thông tin.");
      }
    } catch (err) {
      setError("Không thể kết nối đến máy chủ.");
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Tạo tài khoản mới</h1>
        
        {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}
        {success && <div className="mb-4 text-green-500 text-sm text-center">{success}</div>}

        <form className="space-y-4" onSubmit={handleRegister}>
          {/* Các ô input giữ nguyên như cũ */}
          <div><label className="block text-sm mb-1">Họ và tên</label><input type="text" className="w-full border p-2 rounded" required value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><label className="block text-sm mb-1">Email</label><input type="email" className="w-full border p-2 rounded" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div><label className="block text-sm mb-1">Mật khẩu</label><input type="password" className="w-full border p-2 rounded" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <div><label className="block text-sm mb-1">Số điện thoại</label><input type="text" className="w-full border p-2 rounded" required value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
          <div><label className="block text-sm mb-1">Địa chỉ</label><input type="text" className="w-full border p-2 rounded" required value={address} onChange={(e) => setAddress(e.target.value)} /></div>
          
          <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">Đăng ký</button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Đã có tài khoản? 
          {/* Sửa đường dẫn link sang /user/login */}
          <Link href="/user/login" className="text-blue-600 hover:underline"> Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}