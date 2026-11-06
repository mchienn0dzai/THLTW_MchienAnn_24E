export default function UserLayout({ children }: { children: React.ReactNode }) {
  // Header/Footer đã nằm ở app/layout.tsx, ở đây chỉ bọc nội dung để không bị lặp menu.
  return <div className="max-w-7xl mx-auto w-full p-4">{children}</div>;
}
