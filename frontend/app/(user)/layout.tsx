import Link from "next/link";

// Giao diện NGƯỜI DÙNG: Header + Footer. Áp dụng cho "/" và "/user/*".
export default function UserSiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            🛒 E-Shop
          </Link>
          <nav className="space-x-6">
            <Link href="/" className="hover:text-blue-200 transition">Trang chủ</Link>
            <Link href="/user/cart" className="hover:text-blue-200 transition">Giỏ hàng</Link>
            <Link href="/user/login" className="hover:text-blue-200 transition">Đăng nhập</Link>
            <Link href="/user/register" className="hover:text-blue-200 transition">Đăng ký</Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="bg-gray-800 text-white text-center py-6 mt-12">
        <p>&copy; 2026 E-Shop - Bài tập Lập trình Web</p>
      </footer>
    </div>
  );
}
