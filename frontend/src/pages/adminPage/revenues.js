import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { formatPriceVND } from "../../utils/priceFormatter";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MdTrendingUp, MdShoppingCart, MdLocalShipping, MdPayment } from "react-icons/md";

const RevenueManagement = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [trendsData, setTrendsData] = useState([]);
  const [paymentMethodData, setPaymentMethodData] = useState([]);
  const [salesReport, setSalesReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [filterStatus, setFilterStatus] = useState("all");
  const [period, setPeriod] = useState("monthly");

  const COLORS = ["#fca311", "#14213d", "#fcaa23", "#82ca9d", "#8dd1e1", "#d084d0"];

  useEffect(() => {
    fetchRevenueData();
  }, [period, filterStatus]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || "";
      
      if (!LoginToken) {
        toast.error("Token quản trị viên không được tìm thấy. Vui lòng đăng nhập lại.");
        return;
      }

      const headers = { Authorization: `Bearer ${LoginToken}` };

      const [dashboard, trends, payment, report] = await Promise.all([
        axios.get("http://localhost:5000/api/v1/revenue/dashboard", { headers }),
        axios.get(`http://localhost:5000/api/v1/revenue/trends?period=${period}`, { headers }),
        axios.get("http://localhost:5000/api/v1/revenue/payment-methods", { headers }),
        axios.get(`http://localhost:5000/api/v1/revenue/report?status=${filterStatus}&limit=10`, {
          headers,
        }),
      ]);

      setDashboardData(dashboard.data);
      setTrendsData(trends.data);
      setPaymentMethodData(payment.data);
      setSalesReport(report.data.orders);
    } catch (error) {
      toast.error("Không thể tải dữ liệu doanh thu");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-lightestPrimaryColor to-lightestSecondaryColor">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-16 h-16 border-4 border-primaryColor border-t-secondaryColor rounded-full animate-spin mb-4"></div>
          </div>
          <p className="text-2xl font-RobotoSlab font-bold text-secondaryColor">Đang tải dữ liệu doanh thu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-lightestPrimaryColor via-white to-lightestSecondaryColor px-4 md:px-8 py-8">
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-RobotoSlab font-bold text-secondaryColor mb-3">
          Phân tích doanh thu
        </h1>
        <p className="text-lg text-gray-600 font-OpenSans">Thông tin chi tiết toàn diện về doanh số và doanh thu kinh doanh của bạn</p>
      </div>

      {/* Dashboard Metrics */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <MetricCard
            icon={<MdTrendingUp className="w-8 h-8" />}
            title="Tổng doanh thu"
            value={formatPriceVND(dashboardData.totalRevenue)}
            subtext="Lợi nhuận suốt đời"
            gradient="from-blue-500 to-blue-600"
          />
          <MetricCard
            icon={<MdShoppingCart className="w-8 h-8" />}
            title="Đơn hàng"
            value={dashboardData.totalOrders}
            subtext="Tổng cộng đặt"
            gradient="from-green-500 to-green-600"
          />
          <MetricCard
            icon={<MdPayment className="w-8 h-8" />}
            title="Đơn hàng trung bình"
            value={formatPriceVND(dashboardData.averageOrderValue)}
            subtext="Trên mỗi giao dịch"
            gradient="from-primaryColor to-darkPrimaryColor"
          />
          <MetricCard
            icon={<MdLocalShipping className="w-8 h-8" />}
            title="Đã giao"
            value={dashboardData.deliveredOrders}
            subtext="Hoàn thành"
            gradient="from-indigo-500 to-indigo-600"
          />
          <MetricCard
            icon={<MdPayment className="w-8 h-8" />}
            title="Đã thanh toán"
            value={dashboardData.paidOrders}
            subtext="Thanh toán nhận được"
            gradient="from-yellow-500 to-yellow-600"
          />
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="flex gap-3 flex-wrap bg-white rounded-xl p-2 shadow-lg border border-neutralColor">
          {["overview", "trends", "payment", "report"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-RobotoCondensed font-bold rounded-lg transition-all duration-300 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-primaryColor to-darkPrimaryColor text-white shadow-lg"
                  : "bg-white text-secondaryColor hover:bg-neutralColor"
              }`}
            >
              {tab === "overview" && "Tổng quan"}
              {tab === "trends" && "Xu hướng"}
              {tab === "payment" && "Thanh toán"}
              {tab === "report" && "Báo cáo"}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-neutralColor">
{/* Tab Content */}
<div className="bg-white rounded-2xl shadow-2xl p-8 border border-neutralColor">

  {/* Overview Tab */}
  {activeTab === "overview" && dashboardData && (
    <div>
      <h2 className="text-2xl font-RobotoSlab font-bold text-secondaryColor mb-8">
        Tổng quan dashboard
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Payment Status */}
        <div className="bg-gradient-to-br from-lightestPrimaryColor to-white p-6 rounded-xl border border-neutralColor">
          <h3 className="text-xl font-RobotoCondensed font-bold mb-6 text-secondaryColor">
            Trạng thái thanh toán
          </h3>

          <ResponsiveContainer width="100%" height={380}>
            <PieChart margin={{ top: 30, right: 30, bottom: 30, left: 30 }}>
              <Pie
                data={[
                  {
                    name: "Đã thanh toán",
                    value: dashboardData.paidOrders,
                  },
                  {
                    name: "Chờ xử lý",
                    value: dashboardData.pendingOrders,
                  },
                  {
                    name: "Đã hủy",
                    value: dashboardData.cancelledOrders,
                  },
                ]}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#10b981" />
                <Cell fill="#f59e0b" />
                <Cell fill="#ef4444" />
              </Pie>

              <Tooltip formatter={(value) => [value, "Đơn hàng"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Delivery Status */}
        <div className="bg-gradient-to-br from-lightestSecondaryColor to-white p-6 rounded-xl border border-neutralColor">
          <h3 className="text-xl font-RobotoCondensed font-bold mb-6 text-secondaryColor">
            Trạng thái giao hàng
          </h3>

          <ResponsiveContainer width="100%" height={380}>
            <PieChart margin={{ top: 30, right: 30, bottom: 30, left: 30 }}>
              <Pie
                data={[
                  {
                    name: "Đã giao",
                    value: dashboardData.deliveredOrders,
                  },
                  {
                    name: "Chờ xử lý",
                    value:
                      dashboardData.totalOrders -
                      dashboardData.deliveredOrders,
                  },
                ]}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#10b981" />
                <Cell fill="#94a3b8" />
              </Pie>

              <Tooltip formatter={(value) => [value, "Đơn hàng"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  )}
</div>

        {/* Trends Tab */}
        {activeTab === "trends" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-RobotoSlab font-bold text-secondaryColor">Revenue Trends</h2>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-4 py-2 border-2 border-primaryColor rounded-lg font-RobotoCondensed text-secondaryColor focus:outline-none focus:ring-2 focus:ring-primaryColor"
              >
                <option value="monthly">Monthly</option>
                <option value="daily">Daily</option>
              </select>
            </div>
            <div className="bg-gradient-to-br from-lightestPrimaryColor to-lightestSecondaryColor p-6 rounded-xl border border-neutralColor">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trendsData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fca311" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#fca311" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="date" stroke="#14213d" />
                  <YAxis stroke="#14213d" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#fff", 
                      border: "2px solid #fca311",
                      borderRadius: "8px"
                    }}
                    formatter={(value, name) => {
                      if (name === "Revenue") {
                        return [formatPriceVND(value), name];
                      }
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#fca311"
                    strokeWidth={3}
                    name="Revenue"
                    dot={{ fill: "#fca311", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Payment Methods Tab */}
        {activeTab === "payment" && (
          <div>
            <h2 className="text-2xl font-RobotoSlab font-bold text-secondaryColor mb-8">Payment Methods</h2>
            
            {/* Chart */}
            <div className="bg-gradient-to-br from-lightestPrimaryColor to-white p-6 rounded-xl border border-neutralColor mb-8">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ method, count }) => `${method}: ${count}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {paymentMethodData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, "Orders"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gradient-to-r from-primaryColor to-darkPrimaryColor text-white">
                  <tr>
                    <th className="px-6 py-4 font-RobotoCondensed font-bold">Payment Method</th>
                    <th className="px-6 py-4 font-RobotoCondensed font-bold text-right">Orders</th>
                    <th className="px-6 py-4 font-RobotoCondensed font-bold text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentMethodData.map((method, idx) => (
                    <tr 
                      key={idx} 
                      className="border-b border-neutralColor hover:bg-lightestPrimaryColor transition-colors"
                    >
                      <td className="px-6 py-4 font-RobotoCondensed font-bold text-secondaryColor capitalize">
                        {method.method}
                      </td>
                      <td className="px-6 py-4 font-RobotoCondensed text-right text-secondaryColor">
                        {method.count}
                      </td>
                      <td className="px-6 py-4 font-RobotoCondensed font-bold text-right text-primaryColor">
                        {formatPriceVND(method.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sales Report Tab */}
        {activeTab === "report" && (
          <div>
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
              <h2 className="text-2xl font-RobotoSlab font-bold text-secondaryColor">Recent Orders</h2>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border-2 border-primaryColor rounded-lg font-RobotoCondensed text-secondaryColor focus:outline-none focus:ring-2 focus:ring-primaryColor"
              >
                <option value="all">All Orders</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gradient-to-r from-secondaryColor to-blue-900 text-white">
                  <tr>
                    <th className="px-6 py-4 font-RobotoCondensed font-bold">#</th>
                    <th className="px-6 py-4 font-RobotoCondensed font-bold">Customer</th>
                    <th className="px-6 py-4 font-RobotoCondensed font-bold text-right">Amount</th>
                    <th className="px-6 py-4 font-RobotoCondensed font-bold">Payment</th>
                    <th className="px-6 py-4 font-RobotoCondensed font-bold">Delivery</th>
                    <th className="px-6 py-4 font-RobotoCondensed font-bold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {salesReport.map((order, idx) => (
                    <tr 
                      key={idx} 
                      className="border-b border-neutralColor hover:bg-lightestPrimaryColor transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-sm font-bold text-gray-500">{idx + 1}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-RobotoCondensed font-bold text-secondaryColor">{order.username}</p>
                          <p className="text-sm text-gray-500 font-OpenSans">{order.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-RobotoCondensed font-bold text-right text-primaryColor">
                        {formatPriceVND(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-RobotoCondensed font-bold ${
                            order.paymentStatus === "paid"
                              ? "bg-green-100 text-green-800"
                              : order.paymentStatus === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-RobotoCondensed font-bold ${
                            order.deliveryStatus === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.deliveryStatus === "pending"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.deliveryStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-OpenSans">
                        {order.date ? new Date(order.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }) : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Metric Card Component
const MetricCard = ({ icon, title, value, subtext, gradient }) => (
  <div className={`bg-gradient-to-br ${gradient} rounded-xl shadow-xl p-6 text-white hover:shadow-2xl transition-shadow duration-300 border border-opacity-20 border-white`}>
    <div className="flex items-center justify-between mb-4">
      <div className="opacity-90">{icon}</div>
    </div>
    <p className="text-sm font-OpenSans opacity-90 mb-2">{title}</p>
    <p className="text-4xl font-RobotoSlab font-bold mb-2">{value}</p>
    <p className="text-xs font-OpenSans opacity-75">{subtext}</p>
  </div>
);

export default RevenueManagement;
