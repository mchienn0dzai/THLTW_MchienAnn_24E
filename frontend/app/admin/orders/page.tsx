"use client";
import { useEffect, useState } from "react";
import { API_URL, formatVND } from "@/lib/api";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchOrders = async () => {
    const res = await fetch(`${API_URL}/api/orders`);
    if (res.ok) setOrders(await res.json());
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id: number, status: string) => {
    await fetch(`${API_URL}/api/orders/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  const handleDelete = async (id: number) => {
    if (!confirm(`Xóa đơn hàng #${id}?`)) return;
    await fetch(`${API_URL}/api/orders/${id}`, { method: "DELETE" });
    fetchOrders();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border">
      <h1 className="text-2xl font-bold mb-6">Quản lý Đơn hàng</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4 border-b">Mã ĐH</th>
              <th className="p-4 border-b">Khách hàng</th>
              <th className="p-4 border-b">SĐT & Địa chỉ</th>
              <th className="p-4 border-b">Tổng tiền</th>
              <th className="p-4 border-b">Thanh toán</th>
              <th className="p-4 border-b">Thời gian đặt</th>
              <th className="p-4 border-b">Trạng thái</th>
              <th className="p-4 border-b text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-bold">#{order.id}</td>
                <td className="p-4 font-semibold">
                  {order.name || order.customer_name || order.user?.name || "Khách lẻ"}
                </td>
                <td className="p-4 text-xs">
                  <div className="font-semibold text-sm">{order.phone || order.customer_phone || order.user?.phone}</div>
                  <div className="text-gray-500">{order.address || order.shipping_address || order.user?.address}</div>
                </td>
                <td className="p-4 font-bold text-red-600">{formatVND(order.total_amount || order.total)}</td>
                <td className="p-4">{order.payment_method || "COD"}</td>
                <td className="p-4 text-xs">{new Date(order.created_at).toLocaleString("vi-VN")}</td>
                <td className="p-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="p-1.5 rounded text-xs font-bold border"
                  >
                    <option value="Chờ xác nhận">Chờ xác nhận</option>
                    <option value="Đang giao">Đang giao</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>
                </td>
                <td className="p-4 text-center space-x-2">
                  <button onClick={() => setSelectedOrder(order)} className="text-blue-600 hover:underline font-semibold">Chi tiết</button>
                  <button onClick={() => handleDelete(order.id)} className="text-red-600 hover:underline font-semibold">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL CHI TIẾT ĐƠN HÀNG */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-xl">
            <h2 className="text-xl font-bold mb-4">Chi tiết Đơn hàng #{selectedOrder.id}</h2>
            <div className="text-sm space-y-1 mb-4 bg-gray-50 p-3 rounded border">
              <p><strong>Người nhận:</strong> {selectedOrder.name || selectedOrder.customer_name || selectedOrder.user?.name}</p>
              <p><strong>SĐT:</strong> {selectedOrder.phone || selectedOrder.customer_phone}</p>
              <p><strong>Địa chỉ:</strong> {selectedOrder.address || selectedOrder.shipping_address}</p>
              <p><strong>Phương thức:</strong> {selectedOrder.payment_method || "COD"}</p>
            </div>
            <table className="w-full text-sm border mb-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Sản phẩm</th>
                  <th className="p-2 border">SL</th>
                  <th className="p-2 border">Đơn giá</th>
                  <th className="p-2 border">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {(selectedOrder.items || []).map((item: any, idx: number) => {
                  const qty = item.quantity || item.qty || 1;
                  return (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{item.product?.name || `Sản phẩm #${item.product_id}`}</td>
                      <td className="p-2 text-center">{qty}</td>
                      <td className="p-2">{formatVND(item.price)}</td>
                      <td className="p-2 font-bold text-red-600">{formatVND(item.price * qty)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-red-600">Tổng cộng: {formatVND(selectedOrder.total_amount || selectedOrder.total)}</span>
              <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 bg-gray-800 text-white rounded">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}