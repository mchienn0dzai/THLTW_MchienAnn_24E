import Link from "next/link";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Thanh Menu Khách hàng */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">🛒 E-Shop</Link>
          <nav className="space-x-6">
            <Link href="/" className="hover:text-blue-200">Trang chủ</Link>
            <Link href="/cart" className="hover:text-blue-200 font-semibold border border-white px-3 py-1 rounded">
              Giỏ hàng (0)
            </Link>
            <Link href="/login" className="hover:text-blue-200">Đăng nhập</Link>
          </nav>
        </div>
      </header>

      {/* Nội dung chính thay đổi theo từng trang */}
      <main className="flex-grow max-w-7xl mx-auto w-full p-4">
        {children}
      </main>

      {/* Chân trang */}
      <footer className="bg-gray-800 text-white text-center p-4">
        © 2026 Bản quyền thuộc về Minh Chiến
      </footer>
    </div>
  );
}