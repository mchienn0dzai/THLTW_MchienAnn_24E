"use client";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewPost, setViewPost] = useState<any>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: "", content: "" });

  const fetchPosts = () => fetch(`${API_URL}/api/posts`).then(r => r.json()).then(setPosts);
  useEffect(() => { fetchPosts(); }, []);

  const openModal = (post?: any) => {
    setEditId(post ? post.id : null);
    setFormData(post ? { title: post.title, content: post.content } : { title: "", content: "" });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API_URL}/api/posts/${editId}` : `${API_URL}/api/posts`;
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
    if (res.ok) { setIsModalOpen(false); fetchPosts(); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Xóa bài viết này?")) return;
    await fetch(`${API_URL}/api/posts/${id}`, { method: "DELETE" });
    fetchPosts();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Bài viết</h1>
        <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded font-semibold">+ Viết bài mới</button>
      </div>
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-4 border-b">ID</th>
            <th className="p-4 border-b">Tiêu đề</th>
            <th className="p-4 border-b">Tóm tắt nội dung</th>
            <th className="p-4 border-b text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(p => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="p-4">{p.id}</td>
              <td className="p-4 font-semibold">{p.title}</td>
              <td className="p-4 text-gray-500 max-w-md truncate">{p.content}</td>
              <td className="p-4 text-center space-x-3">
                <button onClick={() => setViewPost(p)} className="text-green-600 hover:underline font-semibold">Xem chi tiết</button>
                <button onClick={() => openModal(p)} className="text-blue-600 hover:underline font-semibold">Sửa</button>
                <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline font-semibold">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL XEM CHI TIẾT BÀI VIẾT */}
      {viewPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-blue-600 mb-2">{viewPost.title}</h2>
            <p className="text-xs text-gray-400 mb-4 border-b pb-2">
              Đăng lúc: {viewPost.created_at ? new Date(viewPost.created_at).toLocaleString("vi-VN") : "Mới đây"}
            </p>
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">{viewPost.content}</div>
            <div className="flex justify-end mt-6">
              <button onClick={() => setViewPost(null)} className="px-5 py-2 bg-gray-800 text-white rounded-lg font-semibold">Đóng</button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">{editId ? "Sửa Bài viết" : "Đăng Bài viết"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full border p-2 rounded" placeholder="Tiêu đề bài viết..." />
              <textarea required rows={7} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="w-full border p-2 rounded" placeholder="Nội dung chi tiết..." />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}