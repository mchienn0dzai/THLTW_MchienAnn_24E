"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

// Giao diện NGƯỜI DÙNG: Header + Footer. Áp dụng cho "/" và "/user/*".
export default function UserSiteLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Kiểm tra trạng thái đăng nhập mỗi khi đường dẫn thay đổi hoặc load lại trang
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/user/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            🛒 E-Shop
          </Link>
          <nav className="space-x-6 flex items-center">
            <Link href="/" className="hover:text-blue-200 transition">Trang chủ</Link>
            <Link href="/categories" className="hover:text-blue-200 transition">Danh mục</Link>
            <Link href="/about" className="hover:text-blue-200 transition">Thông tin</Link>
            <Link href="/contact" className="hover:text-blue-200 transition">Liên hệ</Link>
            <Link href="/user/cart" className="hover:text-blue-200 transition">Giỏ hàng</Link>
            
            {/* Phân luồng UI: Nếu có user thì hiện tên & nút Đăng xuất, nếu không thì hiện Đăng nhập/Đăng ký */}
            <span className="border-l border-white/50 pl-6 space-x-4 flex items-center">
              {user ? (
                <>
                  <span className="font-semibold text-yellow-300">Chào, {user.name}</span>
                  <button onClick={handleLogout} className="text-sm bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition">Đăng xuất</button>
                </>
              ) : (
                <>
                  <Link href="/user/login" className="hover:text-blue-200 transition">Đăng nhập</Link>
                  <Link href="/user/register" className="hover:text-blue-200 transition bg-white text-blue-600 px-4 py-2 rounded font-semibold hover:bg-blue-50">Đăng ký</Link>
                </>
              )}
            </span>
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