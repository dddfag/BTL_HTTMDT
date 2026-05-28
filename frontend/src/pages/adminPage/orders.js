import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  MdShoppingCart,
  MdDeliveryDining,
  MdPayment,
  MdEdit,
  MdSearch,
} from "react-icons/md";

export const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deliveryFilter, setDeliveryFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newDeliveryStatus, setNewDeliveryStatus] = useState("");
  const [newPaymentStatus, setNewPaymentStatus] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchTerm, deliveryFilter, paymentFilter, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("UserData")) || {};
      const LoginToken = userData?.loginToken || userData?.verificationToken || "";
      
      console.log("=== Fetching Orders ===");
      console.log("LoginToken:", LoginToken ? LoginToken.substring(0, 20) + "..." : "NO TOKEN");
      
      if (!LoginToken) {
        toast.error("Vui lòng đăng nhập lại");
        setLoading(false);
        return;
      }
      
      const headers = { Authorization: `Bearer ${LoginToken}` };

      const response = await axios.get("http://localhost:5000/api/v1/admin/getAllOrders", {
        headers,
      });

      console.log("Orders response:", response.data);
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error.response?.status, error.response?.data);
      toast.error(error.response?.data?.message || "Không thể tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Search filter by email or user name
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Delivery status filter
    if (deliveryFilter !== "all") {
      filtered = filtered.filter((order) => order.deliveryStatus === deliveryFilter);
    }

    // Payment status filter
    if (paymentFilter !== "all") {
      filtered = filtered.filter((order) => order.paymentStatus === paymentFilter);
    }

    setFilteredOrders(filtered);
  };

  const handleUpdateClick = (order) => {
    setSelectedOrder(order);
    setNewDeliveryStatus(order.deliveryStatus);
    setNewPaymentStatus(order.paymentStatus);
    setIsUpdateModalOpen(true);
  };

  const updateOrderStatus = async () => {
    if (!selectedOrder) return;

    try {
      setUpdatingStatus(true);
      const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || "";
      const headers = { Authorization: `Bearer ${LoginToken}` };

      await axios.patch(
        "http://localhost:5000/api/v1/admin/updateOrderStatus",
        {
          userEmail: selectedOrder.userEmail,
          orderId: selectedOrder._id,
          deliveryStatus: newDeliveryStatus,
          paymentStatus: newPaymentStatus,
        },
        { headers }
      );

      // Update local state
      const updatedOrders = orders.map((order) =>
        order._id === selectedOrder._id
          ? {
              ...order,
              deliveryStatus: newDeliveryStatus,
              paymentStatus: newPaymentStatus,
            }
          : order
      );
      setOrders(updatedOrders);

      toast.success("Cập nhật trạng thái đơn hàng thành công");
      setIsUpdateModalOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái đơn hàng");
      console.error(error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "paid":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "Chờ xử lý",
      delivered: "Đã giao",
      cancelled: "Đã hủy",
      paid: "Đã thanh toán",
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-lightestPrimaryColor to-lightestSecondaryColor">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-16 h-16 border-4 border-primaryColor border-t-secondaryColor rounded-full animate-spin mb-4"></div>
          </div>
          <p className="text-2xl font-RobotoSlab font-bold text-secondaryColor">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-lightestPrimaryColor via-white to-lightestSecondaryColor px-4 md:px-8 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-RobotoSlab font-bold text-secondaryColor mb-3">Quản lý đơn hàng</h1>
        <p className="text-lg text-gray-600 font-OpenSans">Xem và quản lý tất cả đơn hàng của khách hàng</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          icon={<MdShoppingCart className="w-8 h-8" />}
          title="Tổng đơn hàng"
          value={orders.length}
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          icon={<MdDeliveryDining className="w-8 h-8" />}
          title="Chờ giao hàng"
          value={orders.filter((o) => o.deliveryStatus === "pending").length}
          gradient="from-yellow-500 to-yellow-600"
        />
        <StatCard
          icon={<MdDeliveryDining className="w-8 h-8" />}
          title="Đã giao hàng"
          value={orders.filter((o) => o.deliveryStatus === "delivered").length}
          gradient="from-green-500 to-green-600"
        />
        <StatCard
          icon={<MdPayment className="w-8 h-8" />}
          title="Đã thanh toán"
          value={orders.filter((o) => o.paymentStatus === "paid").length}
          gradient="from-purple-500 to-purple-600"
        />
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-neutralColor mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-RobotoCondensed font-bold text-secondaryColor mb-3">
              Tìm kiếm đơn hàng
            </label>
            <div className="relative">
              <MdSearch className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm email, tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-neutralColor rounded-lg font-OpenSans text-secondaryColor placeholder-gray-400 focus:outline-none focus:border-primaryColor focus:ring-2 focus:ring-primaryColor focus:ring-opacity-50 transition-all"
              />
            </div>
          </div>

          {/* Delivery Status Filter */}
          <div>
            <label className="block text-sm font-RobotoCondensed font-bold text-secondaryColor mb-3">
              Lọc theo trạng thái giao hàng
            </label>
            <select
              value={deliveryFilter}
              onChange={(e) => setDeliveryFilter(e.target.value)}
              className="w-full px-4 py-3 border-2 border-neutralColor rounded-lg font-OpenSans text-secondaryColor focus:outline-none focus:border-primaryColor focus:ring-2 focus:ring-primaryColor focus:ring-opacity-50 transition-all"
            >
              <option value="all">Tất cả trạng thái giao hàng</option>
              <option value="pending">Chờ giao hàng</option>
              <option value="delivered">Đã giao hàng</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <label className="block text-sm font-RobotoCondensed font-bold text-secondaryColor mb-3">
              Lọc theo trạng thái thanh toán
            </label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-4 py-3 border-2 border-neutralColor rounded-lg font-OpenSans text-secondaryColor focus:outline-none focus:border-primaryColor focus:ring-2 focus:ring-primaryColor focus:ring-opacity-50 transition-all"
            >
              <option value="all">Tất cả trạng thái thanh toán</option>
              <option value="pending">Chờ thanh toán</option>
              <option value="paid">Đã thanh toán</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-neutralColor">
        <div className="mb-8">
          <h2 className="text-2xl font-RobotoSlab font-bold text-secondaryColor mb-2">
            Danh sách đơn hàng ({filteredOrders.length})
          </h2>
          <p className="text-gray-600 font-OpenSans">
            Hiển thị {filteredOrders.length} của {orders.length} đơn hàng
          </p>
        </div>

        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-secondaryColor to-blue-900 text-white">
                <tr>
                  <th className="px-6 py-4 font-RobotoCondensed font-bold">ID Đơn Hàng</th>
                  <th className="px-6 py-4 font-RobotoCondensed font-bold">Email</th>
                  <th className="px-6 py-4 font-RobotoCondensed font-bold">Tên</th>
                  <th className="px-6 py-4 font-RobotoCondensed font-bold">Số lượng SP</th>
                  <th className="px-6 py-4 font-RobotoCondensed font-bold text-right">Tổng tiền</th>
                  <th className="px-6 py-4 font-RobotoCondensed font-bold">Giao hàng</th>
                  <th className="px-6 py-4 font-RobotoCondensed font-bold">Thanh toán</th>
                  <th className="px-6 py-4 font-RobotoCondensed font-bold">Ngày</th>
                  <th className="px-6 py-4 font-RobotoCondensed font-bold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-neutralColor hover:bg-lightestPrimaryColor transition-colors"
                  >
                    <td className="px-6 py-4 font-RobotoCondensed font-bold text-secondaryColor truncate max-w-[150px]" title={order._id}>
                      {order._id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 font-OpenSans text-gray-600">{order.userEmail}</td>
                    <td className="px-6 py-4 font-RobotoCondensed text-secondaryColor">{order.fullName}</td>
                    <td className="px-6 py-4 text-center font-RobotoCondensed">{order.productCount}</td>
                    <td className="px-6 py-4 text-right font-bold text-primaryColor">
                      {order.totalAmount.toLocaleString()} VND
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-RobotoCondensed font-bold ${getStatusColor(order.deliveryStatus)}`}>
                        {getStatusLabel(order.deliveryStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-RobotoCondensed font-bold ${getStatusColor(order.paymentStatus)}`}>
                        {getStatusLabel(order.paymentStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-OpenSans text-sm">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleUpdateClick(order)}
                        className="text-blue-600 hover:text-blue-800 font-bold transition-colors flex items-center gap-1"
                      >
                        <MdEdit className="w-5 h-5" />
                        Cập nhật
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 font-OpenSans text-lg">Không tìm thấy đơn hàng</p>
          </div>
        )}
      </div>

      {/* Update Status Modal */}
      {isUpdateModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-primaryColor to-darkPrimaryColor text-white p-8 flex justify-between items-center">
              <h3 className="text-2xl font-RobotoSlab font-bold">Cập nhật trạng thái đơn hàng</h3>
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="text-2xl font-bold hover:opacity-80 transition-opacity"
              >
                ✕
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Email: {selectedOrder.userEmail}</p>
                <p className="text-lg font-bold text-secondaryColor">{selectedOrder.fullName}</p>
              </div>

              <div>
                <label className="block text-sm font-RobotoCondensed font-bold text-secondaryColor mb-3">
                  Trạng thái giao hàng
                </label>
                <select
                  value={newDeliveryStatus}
                  onChange={(e) => setNewDeliveryStatus(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-neutralColor rounded-lg font-OpenSans text-secondaryColor focus:outline-none focus:border-primaryColor focus:ring-2 focus:ring-primaryColor focus:ring-opacity-50 transition-all"
                >
                  <option value="pending">Chờ giao hàng</option>
                  <option value="delivered">Đã giao hàng</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-RobotoCondensed font-bold text-secondaryColor mb-3">
                  Trạng thái thanh toán
                </label>
                <select
                  value={newPaymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-neutralColor rounded-lg font-OpenSans text-secondaryColor focus:outline-none focus:border-primaryColor focus:ring-2 focus:ring-primaryColor focus:ring-opacity-50 transition-all"
                >
                  <option value="pending">Chờ thanh toán</option>
                  <option value="paid">Đã thanh toán</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-RobotoCondensed font-bold py-3 px-6 rounded-lg transition-all"
                >
                  Hủy
                </button>
                <button
                  onClick={updateOrderStatus}
                  disabled={updatingStatus}
                  className="flex-1 bg-gradient-to-r from-primaryColor to-darkPrimaryColor hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-white font-RobotoCondensed font-bold py-3 px-6 rounded-lg transition-all"
                >
                  {updatingStatus ? "Đang cập nhật..." : "Cập nhật"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, gradient }) => (
  <div className={`bg-gradient-to-br ${gradient} rounded-xl shadow-xl p-6 text-white hover:shadow-2xl transition-shadow duration-300 border border-opacity-20 border-white`}>
    <div className="flex items-center justify-between mb-4">
      <div className="opacity-90">{icon}</div>
    </div>
    <p className="text-sm font-OpenSans opacity-90 mb-2">{title}</p>
    <p className="text-4xl font-RobotoSlab font-bold">{value}</p>
  </div>
);
