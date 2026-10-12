import Link from "next/link";
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* THANH SIDEBAR BÊN TRÁI */}
      <aside className="w-64 bg-[#111827] text-white flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <h1 className="text-xl font-bold flex items-center gap-2">
            ⚙️ Admin Panel
          </h1>
        </div>

        {/* MENU ĐIỀU HƯỚNG MỚI */}
        <nav className="flex flex-col space-y-2 mt-4 flex-1 overflow-y-auto">
          <div className="text-gray-400 text-xs uppercase font-bold px-4 mt-4 mb-2">Kho Hàng</div>
          <Link href="/admin" className="block px-4 py-2 hover:bg-gray-800 hover:text-blue-400 transition">
            Sản phẩm & Danh mục
          </Link>

          <div className="text-gray-400 text-xs uppercase font-bold px-4 mt-6 mb-2">Hệ thống</div>
          <Link href="/admin/menus" className="block px-4 py-2 hover:bg-gray-800 hover:text-blue-400 transition">
            Quản lý Menu
          </Link>
          <Link href="/admin/orders" className="block px-4 py-2 hover:bg-gray-800 hover:text-blue-400 transition">
            Quản lý Đơn hàng
          </Link>
          <Link href="/admin/contacts" className="block px-4 py-2 hover:bg-gray-800 hover:text-blue-400 transition">
            Quản lý Liên hệ
          </Link>
        </nav>

        {/* NÚT QUAY VỀ TRANG WEB */}
        <div className="p-4 border-t border-gray-800">
          <Link href="/" className="block text-center text-sm bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 py-2 rounded transition">
            🔙 Quay về Trang web
          </Link>
        </div>
      </aside>
      
      {/* VÙNG NỘI DUNG CHÍNH (Hiển thị các trang con) */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}