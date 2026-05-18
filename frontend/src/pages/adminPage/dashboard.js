import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  MdVisibility, 
  MdShoppingCart, 
  MdAttachMoney, 
  MdPeople,
  MdVerified,
  MdTrendingUp,
  MdPending,
  MdCheckCircle
} from "react-icons/md";

export const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalVisits: 0,
    totalOrders: 0,
    totalSales: 0,
    totalUsers: 0,
    verifiedUsers: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || "";
      const headers = { Authorization: `Bearer ${LoginToken}` };

      // Fetch revenue data
      const revenueRes = await axios.get("http://localhost:5000/api/v1/revenue/dashboard", { headers });
      
      // Fetch all users for user count
      const usersRes = await axios.get("http://localhost:5000/api/v1/auth/getAllUsers", { headers });

      const allUsers = usersRes.data || [];
      const verifiedCount = allUsers.filter(u => u.verificationStatus === "verified").length;
      const totalUsersCount = allUsers.length;

      // Get recent users (last 5)
      const recent = allUsers
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setRecentUsers(recent);
      setDashboardData({
        totalVisits: 12345, // This would come from analytics in real app
        totalOrders: revenueRes.data.totalOrders,
        totalSales: parseFloat(revenueRes.data.totalRevenue),
        totalUsers: totalUsersCount,
        verifiedUsers: verifiedCount,
        pendingOrders: revenueRes.data.pendingOrders,
        completedOrders: revenueRes.data.deliveredOrders,
      });
    } catch (error) {
      toast.error("Failed to load dashboard data");
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
          <p className="text-2xl font-RobotoSlab font-bold text-secondaryColor">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-lightestPrimaryColor via-white to-lightestSecondaryColor px-4 md:px-8 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-RobotoSlab font-bold text-secondaryColor mb-3">Dashboard</h1>
        <p className="text-lg text-gray-600 font-OpenSans">Overview of your store's performance</p>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <DashboardCard
          icon={<MdVisibility className="w-8 h-8" />}
          title="Total Visits"
          value={dashboardData.totalVisits.toLocaleString()}
          subtext="Lifetime visits"
          gradient="from-blue-500 to-blue-600"
          trend="+12%"
        />
        <DashboardCard
          icon={<MdShoppingCart className="w-8 h-8" />}
          title="Total Orders"
          value={dashboardData.totalOrders}
          subtext="Orders placed"
          gradient="from-green-500 to-green-600"
          trend="+8%"
        />
        <DashboardCard
          icon={<MdAttachMoney className="w-8 h-8" />}
          title="Total Sales"
          value={`$${dashboardData.totalSales.toFixed(2)}`}
          subtext="Revenue generated"
          gradient="from-primaryColor to-darkPrimaryColor"
          trend="+23%"
        />
        <DashboardCard
          icon={<MdPeople className="w-8 h-8" />}
          title="Total Users"
          value={dashboardData.totalUsers}
          subtext="Registered users"
          gradient="from-purple-500 to-purple-600"
          trend="+5%"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <DashboardCard
          icon={<MdVerified className="w-8 h-8" />}
          title="Verified Users"
          value={dashboardData.verifiedUsers}
          subtext={`${((dashboardData.verifiedUsers / dashboardData.totalUsers) * 100).toFixed(1)}% of total`}
          gradient="from-emerald-500 to-emerald-600"
        />
        <DashboardCard
          icon={<MdPending className="w-8 h-8" />}
          title="Pending Orders"
          value={dashboardData.pendingOrders}
          subtext="Awaiting action"
          gradient="from-yellow-500 to-yellow-600"
        />
        <DashboardCard
          icon={<MdCheckCircle className="w-8 h-8" />}
          title="Completed Orders"
          value={dashboardData.completedOrders}
          subtext="Successfully delivered"
          gradient="from-teal-500 to-teal-600"
        />
      </div>

      {/* Recent Users Table */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-neutralColor">
        <div className="mb-8">
          <h2 className="text-2xl font-RobotoSlab font-bold text-secondaryColor mb-2">Recent Users</h2>
          <p className="text-gray-600 font-OpenSans">Latest registered users on your platform</p>
        </div>

        {recentUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-secondaryColor to-blue-900 text-white">
                <tr>
                  <th className="px-6 py-4 font-RobotoCondensed font-bold">Username</th>
                  <th className="px-6 py-4 font-RobotoCondensed font-bold">Email</th>
                  <th className="px-6 py-4 font-RobotoCondensed font-bold">Status</th>
                  <th className="px-6 py-4 font-RobotoCondensed font-bold">Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user, idx) => (
                  <tr key={idx} className="border-b border-neutralColor hover:bg-lightestPrimaryColor transition-colors">
                    <td className="px-6 py-4 font-RobotoCondensed font-bold text-secondaryColor">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 font-OpenSans text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-RobotoCondensed font-bold ${
                          user.verificationStatus === "verified"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.verificationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-OpenSans">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
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
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 font-OpenSans">No users found</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickActionCard
          title="View Revenue"
          description="Detailed sales analytics"
          link="/administrator/revenues"
          color="from-primaryColor to-darkPrimaryColor"
        />
        <QuickActionCard
          title="Manage Products"
          description="Add, edit, or remove items"
          link="/administrator/product-Management"
          color="from-blue-500 to-blue-600"
        />
        <QuickActionCard
          title="User Management"
          description="Manage user accounts"
          link="/administrator/user-Management"
          color="from-green-500 to-green-600"
        />
      </div>
    </section>
  );
};

// Dashboard Card Component
const DashboardCard = ({ icon, title, value, subtext, gradient, trend }) => (
  <div className={`bg-gradient-to-br ${gradient} rounded-xl shadow-xl p-6 text-white hover:shadow-2xl transition-shadow duration-300 border border-opacity-20 border-white`}>
    <div className="flex items-center justify-between mb-4">
      <div className="opacity-90">{icon}</div>
      {trend && <span className="text-xs font-bold bg-white bg-opacity-20 px-2 py-1 rounded-full">{trend}</span>}
    </div>
    <p className="text-sm font-OpenSans opacity-90 mb-2">{title}</p>
    <p className="text-3xl md:text-4xl font-RobotoSlab font-bold mb-2">{value}</p>
    <p className="text-xs font-OpenSans opacity-75">{subtext}</p>
  </div>
);

// Quick Action Card Component
const QuickActionCard = ({ title, description, link, color }) => (
  <a
    href={link}
    className={`bg-gradient-to-br ${color} rounded-xl shadow-lg p-6 text-white hover:shadow-2xl transition-all duration-300 border border-opacity-20 border-white group cursor-pointer`}
  >
    <h3 className="text-xl font-RobotoSlab font-bold mb-2 group-hover:translate-y-[-2px] transition-transform">
      {title}
    </h3>
    <p className="text-sm font-OpenSans opacity-90">{description}</p>
    <div className="mt-4 flex items-center gap-2 text-sm font-bold group-hover:translate-x-2 transition-transform">
      <span>→</span>
    </div>
  </a>
);
