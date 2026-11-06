"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Lấy đường dẫn hiện tại

  // Hàm tự động đổi màu nếu link trùng với đường dẫn
  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `block px-4 py-2.5 rounded transition font-medium ${
      isActive ? "bg-cyan-700 text-white shadow" : "hover:bg-blue-600 text-gray-300 hover:text-white"
    }`;
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <aside className="w-64 bg-[#1e293b] text-gray-300 flex flex-col flex-shrink-0 shadow-xl">
        <div className="h-16 flex items-center px-6 bg-[#0f172a]">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">E-Shop_Manager</h1>
        </div>

        <nav className="flex flex-col space-y-1 mt-4 flex-1 overflow-y-auto px-2">
          <div className="text-gray-500 text-[11px] uppercase font-bold px-4 mt-2 mb-1">Chức năng hệ thống</div>
          
          <Link href="/admin" className={getLinkClass("/admin")}>📊 Tổng quan</Link>
          <Link href="/admin/orders" className={getLinkClass("/admin/orders")}>📦 Quản lý Đơn hàng</Link>
          <Link href="/admin/products" className={getLinkClass("/admin/products")}>🛍️ Quản lý Sản phẩm</Link>
          <Link href="/admin/categories" className={getLinkClass("/admin/categories")}>📑 Quản lý Danh mục</Link>
          <Link href="/admin/brands" className={getLinkClass("/admin/brands")}>🏷️ Quản lý Thương hiệu</Link>
          <Link href="/admin/posts" className={getLinkClass("/admin/posts")}>📝 Quản lý Bài viết</Link>
          <Link href="/admin/users" className={getLinkClass("/admin/users")}>👥 Quản lý Khách hàng</Link>
          <Link href="/admin/contacts" className={getLinkClass("/admin/contacts")}>✉️ Quản lý Thư liên hệ</Link>
          <Link href="/admin/menus" className={getLinkClass("/admin/menus")}>⚙️ Cấu hình Menu Web</Link>
          <Link href="/admin/trash" className={getLinkClass("/admin/trash") + " text-red-400 hover:text-white hover:bg-red-600"}>🗑️ Thùng rác</Link>
        </nav>

        <div className="p-4 border-t border-gray-700 bg-[#0f172a]">
          <Link href="/" className="block text-center text-sm bg-gray-700 text-white hover:bg-gray-600 py-2 rounded transition">Quay về Website</Link>
        </div>
      </aside>
      
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm h-16 flex items-center px-8 justify-between">
            <div className="text-gray-600 font-medium">Hệ thống Quản trị E-Shop</div>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">A</div>
                <span className="font-semibold text-sm">Administrator</span>
            </div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}