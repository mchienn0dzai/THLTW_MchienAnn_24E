import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Thanh Sidebar Admin bên trái */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          ⚙️ Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="block p-2 rounded hover:bg-gray-700">Thống kê</Link>
          <Link href="/admin/products" className="block p-2 rounded hover:bg-gray-700">Quản lý Sản phẩm</Link>
          <Link href="/admin/orders" className="block p-2 rounded hover:bg-gray-700">Quản lý Đơn hàng</Link>
          <Link href="/admin/users" className="block p-2 rounded hover:bg-gray-700">Quản lý Khách hàng</Link>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <Link href="/" className="text-sm text-gray-400 hover:text-white">← Quay về Trang web</Link>
        </div>
      </aside>

      {/* Nội dung chính bên phải */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}