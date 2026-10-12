"use client";
import { useState } from "react";

export default function AdminMenusPage() {
  const [menus] = useState([
    { id: 1, name: "Trang chủ", link: "/", status: true },
    { id: 2, name: "Danh mục", link: "/categories", status: true },
    { id: 3, name: "Thông tin", link: "/about", status: true },
    { id: 4, name: "Liên hệ", link: "/contact", status: true },
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Menu Header</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700">
          + Thêm Menu mới
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto border">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4 border-b">Thứ tự</th>
              <th className="p-4 border-b">Tên hiển thị</th>
              <th className="p-4 border-b">Đường dẫn (Link)</th>
              <th className="p-4 border-b">Trạng thái</th>
              <th className="p-4 border-b text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {menus.map((menu, index) => (
              <tr key={menu.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-semibold">{index + 1}</td>
                <td className="p-4">{menu.name}</td>
                <td className="p-4 text-blue-600">{menu.link}</td>
                <td className="p-4">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Hiển thị</span>
                </td>
                <td className="p-4 text-center space-x-3">
                  <button className="text-blue-600 hover:underline">Sửa</button>
                  <button className="text-red-600 hover:underline">Ẩn</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}