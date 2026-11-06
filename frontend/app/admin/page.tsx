"use client";
import { useEffect, useState } from "react";
import { API_URL, formatVND } from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_users: 0,
    total_products: 0,
    new_orders: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/api/dashboard`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Lỗi tải dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-gray-500 font-semibold">Đang tải dữ liệu tổng quan...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Tổng quan (Dashboard)</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card Tổng thành viên */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <p className="text-gray-500 text-sm font-medium mb-2">Tổng thành viên</p>
          <p className="text-4xl font-bold text-gray-800">{stats.total_users}</p>
        </div>

        {/* Card Tổng sản phẩm */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <p className="text-gray-500 text-sm font-medium mb-2">Tổng sản phẩm</p>
          <p className="text-4xl font-bold text-gray-800">{stats.total_products}</p>
        </div>

        {/* Card Đơn hàng mới */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <p className="text-gray-500 text-sm font-medium mb-2">Đơn hàng mới</p>
          <p className="text-4xl font-bold text-gray-800">{stats.new_orders}</p>
        </div>

        {/* Card Doanh thu */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <p className="text-gray-500 text-sm font-medium mb-2">Doanh thu</p>
          <p className="text-3xl font-bold text-green-600">{formatVND(stats.revenue)}</p>
        </div>
      </div>
    </div>
  );
}