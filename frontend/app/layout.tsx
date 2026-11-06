import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-Shop Cửa hàng điện thoại",
};

// Root layout CHỈ chứa <html> và <body>.
// Giao diện người dùng nằm ở app/(user)/layout.tsx, giao diện admin nằm ở app/admin/layout.tsx.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-gray-50`}>{children}</body>
    </html>
  );
}
