"use client";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

export default function AboutPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/posts`)
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => console.error("Lỗi:", err));
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">Về E-Shop & Tin tức</h1>
      
      {/* Phẩn Giới thiệu tĩnh */}
      <div className="bg-white p-8 rounded-xl shadow-md space-y-6 text-gray-700 leading-relaxed border mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">Tầm nhìn & Sứ mệnh</h2>
        <p>
          Chào mừng bạn đến với <strong>E-Shop</strong> - Nền tảng mua sắm thiết bị công nghệ trực tuyến hàng đầu. 
          Sứ mệnh của E-Shop là kết nối người tiêu dùng Việt Nam với những công nghệ tiên tiến nhất một cách nhanh chóng, an toàn và tiết kiệm.
        </p>
      </div>

      {/* Phần Danh sách bài viết động từ Admin */}
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Tin tức & Thông báo mới nhất</h2>
      
      {loading ? (
        <div className="text-center text-gray-500">Đang tải tin tức...</div>
      ) : (
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border text-center text-gray-500">
              Hiện chưa có bài viết nào từ ban quản trị.
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
                <h3 className="text-xl font-bold text-blue-600 mb-2">{post.title}</h3>
                <p className="text-xs text-gray-400 mb-4">
                  Đăng ngày: {new Date(post.created_at).toLocaleDateString('vi-VN')}
                </p>
                {/* Nội dung giữ nguyên định dạng xuống dòng (whitespace-pre-wrap) */}
                <div className="text-gray-700 whitespace-pre-wrap">{post.content}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}