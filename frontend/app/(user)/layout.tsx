"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [menus, setMenus] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/menus`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setMenus(data.filter((m) => !m.is_hidden));
      })
      .catch(() => {});

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    router.push("/user/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-blue-600 text-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
          <Link href="/" className="text-2xl font-extrabold flex items-center gap-2">
            🛒 E-Shop
          </Link>

          <nav className="flex flex-wrap items-center gap-6 font-medium text-sm md:text-base">
            {menus.length > 0 ? (
              menus.map((m) => (
                <Link key={m.id} href={m.link} className="hover:text-yellow-300 transition">
                  {m.name}
                </Link>
              ))
            ) : (
              <>
                <Link href="/" className="hover:text-yellow-300">Trang chủ</Link>
                <Link href="/categories" className="hover:text-yellow-300">Danh mục</Link>
                <Link href="/about" className="hover:text-yellow-300">Thông tin & Chính sách</Link>
                <Link href="/contact" className="hover:text-yellow-300">Liên hệ</Link>
              </>
            )}
            <Link href="/user/cart" className="hover:text-yellow-300 font-bold">🛍️ Giỏ hàng</Link>
          </nav>

          <div className="flex items-center gap-3 text-sm">
            {user ? (
              <>
                <Link href="/user/profile" className="bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded-lg font-semibold">
                  👤 {user.name} (Đơn hàng)
                </Link>
                {(user.role === "admin" || user.email?.includes("admin")) && (
                  <Link href="/admin" className="bg-yellow-400 text-gray-900 px-3 py-1.5 rounded-lg font-bold">
                    ⚙️ Quản trị
                  </Link>
                )}
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg font-semibold">
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link href="/user/login" className="hover:underline font-semibold">Đăng nhập</Link>
                <Link href="/user/register" className="bg-white text-blue-600 px-4 py-1.5 rounded-lg font-bold hover:bg-gray-100">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <h3 className="text-white font-bold text-lg mb-2">🛒 E-Shop Công Nghệ</h3>
            <p>Hệ thống bán lẻ điện thoại, laptop, phụ kiện chính hãng giá tốt nhất.</p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-2">Chính sách & Hỗ trợ</h3>
            <ul className="space-y-1">
              <li><Link href="/about" className="hover:underline">Giới thiệu & Tin tức</Link></li>
              <li><Link href="/about#policy" className="hover:underline">Chính sách mua hàng & Bảo hành</Link></li>
              <li><Link href="/contact" className="hover:underline">Gửi liên hệ hỗ trợ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-2">Hotline liên hệ</h3>
            <p>📞 1900 1234 (8:00 - 21:00)</p>
            <p>✉️ support@eshop.vn</p>
          </div>
        </div>
      </footer>
    </div>
  );
}