"use client";
import { useEffect, useState } from "react";
import { API_URL, formatVND } from "@/lib/api";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/orders`);
      setOrders(await res.json());
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        alert("Cập nhật trạng thái thành công!");
        fetchOrders(); 
      } else {
        alert("Cập nhật thất bại!");
      }
    } catch (error) {
      alert("Lỗi kết nối máy chủ.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Quản lý Đơn hàng</h1>
      
      {loading ? (
        <div className="text-gray-500 font-semibold">Đang tải danh sách đơn hàng...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4 border-b">Mã ĐH</th>
                <th className="p-4 border-b">Khách hàng</th>
                <th className="p-4 border-b">SĐT & Địa chỉ</th>
                <th className="p-4 border-b">Tổng tiền</th>
                <th className="p-4 border-b">Thanh toán</th>
                <th className="p-4 border-b text-blue-600">Thời gian đặt</th>
                <th className="p-4 border-b">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">Chưa có đơn hàng nào.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-semibold text-gray-500">#{order.id}</td>
                    
                    {/* Quét tự động Tên khách hàng */}
                    <td className="p-4 font-semibold">
                      {order.name || order.customer_name || order.fullname || order.user?.name || "Khách Vãng Lai"}
                    </td>

                    {/* Quét tự động SĐT & Địa chỉ */}
                    <td className="p-4 text-gray-600">
                      <div className="font-medium text-gray-800">
                        {order.phone || order.phone_number || order.customer_phone || order.user?.phone || "Chưa có SĐT"}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {order.address || order.shipping_address || order.delivery_address || order.customer_address || order.user?.address || "Chưa có địa chỉ"}
                      </div>
                    </td>
                    
                    {/* Quét tự động Tổng tiền và Phương thức thanh toán */}
                    <td className="p-4 font-bold text-red-600">{formatVND(order.total_amount || order.total)}</td>
                    <td className="p-4 text-gray-600">{order.payment_method || order.payment || order.pay_method || "COD"}</td>
                    
                    <td className="p-4 font-medium text-gray-600">
                      {new Date(order.created_at).toLocaleString('vi-VN', {
                        hour: '2-digit', minute: '2-digit',
                        day: '2-digit', month: '2-digit', year: 'numeric'
                      })}
                    </td>

                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`p-2 rounded text-sm font-semibold border outline-none cursor-pointer transition
                          ${order.status === 'Chờ xác nhận' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                          ${order.status === 'Đang giao' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                          ${order.status === 'Hoàn thành' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                          ${order.status === 'Đã hủy' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                        `}
                      >
                        <option value="Chờ xác nhận">Chờ xác nhận</option>
                        <option value="Đang giao">Đang giao</option>
                        <option value="Hoàn thành">Hoàn thành</option>
                        <option value="Đã hủy">Đã hủy</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}