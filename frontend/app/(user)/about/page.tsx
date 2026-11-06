"use client";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

export default function AboutPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/posts`).then((r) => r.json()).then(setPosts).catch(() => {});
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-12">
      {/* 1. TRANG ĐƠN: GIỚI THIỆU */}
      <div className="bg-white p-8 rounded-2xl shadow-md border space-y-4">
        <h1 className="text-3xl font-bold text-blue-600">Về Hệ thống E-Shop</h1>
        <p className="text-gray-700 leading-relaxed">
          <strong>E-Shop</strong> là hệ thống bán lẻ thiết bị công nghệ chính hãng (Điện thoại, Laptop, Máy tính bảng, Phụ kiện) với cam kết chất lượng hàng đầu, giá cả minh bạch và dịch vụ hậu mãi tận tâm.
        </p>
      </div>

      {/* 2. TRANG ĐƠN: CHÍNH SÁCH MUA HÀNG & BẢO HÀNH */}
      <div id="policy" className="bg-white p-8 rounded-2xl shadow-md border space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">🛡️ Chính sách Mua hàng, Bảo hành & Đổi trả</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h3 className="font-bold text-blue-700 text-base mb-2">1. Chính sách Bảo hành</h3>
            <p>Bảo hành chính hãng 12 tháng tại toàn bộ hệ thống. Hỗ trợ 1 đổi 1 trong 30 ngày đầu nếu có lỗi phần cứng từ nhà sản xuất.</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl border border-green-100">
            <h3 className="font-bold text-green-700 text-base mb-2">2. Chính sách Giao hàng</h3>
            <p>Miễn phí giao hàng toàn quốc cho đơn hàng từ 2.000.000đ. Giao nhanh nội thành trong 2 giờ, được đồng kiểm trước khi thanh toán.</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
            <h3 className="font-bold text-orange-700 text-base mb-2">3. Chính sách Thanh toán</h3>
            <p>Hỗ trợ thanh toán tiền mặt khi nhận hàng (COD) hoặc thanh toán chuyển khoản Online qua mã VietQR an toàn, nhanh chóng.</p>
          </div>
        </div>
      </div>

      {/* 3. TIN TỨC & BÀI VIẾT */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📰 Tin tức & Thông báo mới nhất</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-xl shadow-sm border flex flex-col">
              <h3 className="text-xl font-bold text-blue-600 mb-2">{post.title}</h3>
              <p className="text-xs text-gray-400 mb-3">Ngày đăng: {new Date(post.created_at).toLocaleDateString("vi-VN")}</p>
              <p className="text-gray-600 line-clamp-3 mb-4">{post.content}</p>
              <button
                onClick={() => setSelectedPost(post)}
                className="mt-auto text-sm font-bold text-blue-600 hover:underline w-fit"
              >
                Xem chi tiết bài viết &rarr;
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-blue-600 mb-2">{selectedPost.title}</h2>
            <p className="text-xs text-gray-400 mb-4 border-b pb-2">{new Date(selectedPost.created_at).toLocaleString("vi-VN")}</p>
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedPost.content}</div>
            <div className="flex justify-end mt-6">
              <button onClick={() => setSelectedPost(null)} className="px-6 py-2 bg-gray-800 text-white rounded-lg font-semibold">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}