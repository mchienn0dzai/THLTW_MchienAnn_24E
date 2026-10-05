import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin - E-Shop",
};

// Giao diện QUẢN TRỊ: sidebar riêng, KHÔNG dùng header/footer của trang người dùng.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">⚙️ Admin Panel</div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="block p-2 rounded hover:bg-gray-700">Quản lý Sản phẩm</Link>
          <Link href="/admin/categories" className="block p-2 rounded hover:bg-gray-700">Quản lý Danh mục</Link>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <Link href="/" className="text-sm text-gray-400 hover:text-white">← Quay về Trang web</Link>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-x-auto">{children}</main>
    </div>
  );
}
