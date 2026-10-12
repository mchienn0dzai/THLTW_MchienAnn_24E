"use client";
import { useEffect, useState } from "react";
import { API_URL, formatVND } from "@/lib/api";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mảng các trạng thái đơn hàng
  const statuses = ["Chờ xác nhận", "Đang xử lý", "Đang giao hàng", "Hoàn thành", "Đã hủy"];

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/orders`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Lỗi lấy danh sách đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        alert("Cập nhật trạng thái thành công!");
        // Cập nhật lại state để UI đổi ngay lập tức
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      } else {
        alert("Cập nhật thất bại.");
      }
    } catch (error) {
      alert("Lỗi kết nối máy chủ.");
    }
  };

  if (loading) return <div className="p-6">Đang tải danh sách đơn hàng...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Đơn hàng</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto border">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4 border-b">Mã ĐH</th>
              <th className="p-4 border-b">Khách hàng</th>
              <th className="p-4 border-b">SĐT & Địa chỉ</th>
              <th className="p-4 border-b">Tổng tiền</th>
              <th className="p-4 border-b">Thanh toán</th>
              <th className="p-4 border-b">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">Chưa có đơn hàng nào.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-semibold">#{order.id}</td>
                  <td className="p-4">
                    {order.user?.name || "Khách ẩn danh"}
                  </td>
                  <td className="p-4">
                    <div>{order.phone}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]" title={order.shipping_address}>
                      {order.shipping_address}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-red-600">{formatVND(order.total_amount)}</td>
                  <td className="p-4">{order.payment_method}</td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`border p-1 rounded text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-400
                        ${order.status === 'Chờ xác nhận' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : ''}
                        ${order.status === 'Đang xử lý' ? 'bg-blue-100 text-blue-800 border-blue-300' : ''}
                        ${order.status === 'Đang giao hàng' ? 'bg-purple-100 text-purple-800 border-purple-300' : ''}
                        ${order.status === 'Hoàn thành' ? 'bg-green-100 text-green-800 border-green-300' : ''}
                        ${order.status === 'Đã hủy' ? 'bg-red-100 text-red-800 border-red-300' : ''}
                      `}
                    >
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}