"use client";
import { useState } from "react";
import { API_URL } from "@/lib/api";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Cảm ơn bạn! Yêu cầu của bạn đã được gửi đến Admin.");
        setFormData({ name: "", email: "", message: "" }); // Reset form
      } else {
        alert("Gửi thất bại, vui lòng thử lại.");
      }
    } catch (error) {
      alert("Lỗi kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">Liên Hệ Với Chúng Tôi</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-xl shadow-md border">
          <h2 className="text-2xl font-semibold mb-6">Gửi tin nhắn</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Họ và tên</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nhập họ tên của bạn" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nhập địa chỉ email" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nội dung</label>
              <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nhập khiếu nại, góp ý hoặc yêu cầu..."></textarea>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
              {loading ? "Đang gửi..." : "Gửi thông tin"}
            </button>
          </form>
        </div>
        <div className="bg-gray-50 p-8 rounded-xl shadow-md border flex flex-col justify-center space-y-6">
          <div><h3 className="text-xl font-bold text-gray-800 mb-2">📍 Địa chỉ</h3><p className="text-gray-600">123 Đường Công Nghệ, Quận 1, TP. Hồ Chí Minh</p></div>
          <div><h3 className="text-xl font-bold text-gray-800 mb-2">📞 Điện thoại</h3><p className="text-gray-600">1900 1234 (Hỗ trợ 24/7)</p></div>
          <div><h3 className="text-xl font-bold text-gray-800 mb-2">✉️ Email</h3><p className="text-gray-600">support@eshop.com</p></div>
          <div><h3 className="text-xl font-bold text-gray-800 mb-2">⏰ Giờ làm việc</h3><p className="text-gray-600">Thứ 2 - Thứ 7: 08:00 - 20:00<br/>Chủ nhật: Nghỉ</p></div>
        </div>
      </div>
    </div>
  );
}