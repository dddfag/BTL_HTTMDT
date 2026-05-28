import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  MdPeople,
  MdVerified,
  MdPending,
  MdDelete,
  MdSearch,
} from "react-icons/md";

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, filterStatus, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || "";
      const headers = { Authorization: `Bearer ${LoginToken}` };

      const response = await axios.get("http://localhost:5000/api/v1/auth/getAllUsers", { headers });
      setUsers(response.data);
    } catch (error) {
      toast.error("Không thể tải người dùng");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((user) => user.verificationStatus === filterStatus);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const deleteUser = async (userId, userEmail) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng ${userEmail}?`)) {
      try {
        const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || "";
        const headers = { Authorization: `Bearer ${LoginToken}` };

        await axios.delete(`http://localhost:5000/api/v1/auth/deleteUser?id=${userId}`, { headers });
        
        toast.success("Người dùng đã được xóa thành công");
        setUsers(users.filter((u) => u._id !== userId));
      } catch (error) {
        toast.error("Không thể xóa người dùng");
        console.error(error);
      }
    }
  };

  const changeUserRoleToAdmin = async (userId, userEmail) => {
    if (window.confirm(`Bạn có chắc chắn muốn nâng cấp ${userEmail} thành admin?`)) {
      try {
        setActionLoading(true);
        const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || "";
        const headers = { Authorization: `Bearer ${LoginToken}` };

        await axios.post(
          "http://localhost:5000/api/v1/admin/createNewAdmin",
          {
            email: userEmail,
            adminRank: 2, // Regular admin rank
          },
          { headers }
        );

        toast.success("Người dùng đã được nâng cấp thành admin thành công");
        // Update the users list
        const updatedUsers = users.map((u) =>
          u._id === userId ? { ...u, adminStatus: true } : u
        );
        setUsers(updatedUsers);
      } catch (error) {
        toast.error(error.response?.data?.message || "Không thể nâng cấp người dùng thành admin");
        console.error(error);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const removeUserAdminRole = async (userId, userEmail) => {
    if (window.confirm(`Bạn có chắc chắn muốn hủy quyền admin từ ${userEmail}?`)) {
      try {
        setActionLoading(true);
        const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || "";
        const headers = { Authorization: `Bearer ${LoginToken}` };

        await axios.delete(
          "http://localhost:5000/api/v1/admin/removeAdmin",
          {
            headers,
            data: { email: userEmail },
          }
        );

        toast.success("Quyền admin đã bị xóa thành công");
        // Update the users list
        const updatedUsers = users.map((u) =>
          u._id === userId ? { ...u, adminStatus: false } : u
        );
        setUsers(updatedUsers);
      } catch (error) {
        toast.error(error.response?.data?.message || "Không thể xóa quyền admin");
        console.error(error);
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Stats
  const stats = {
    total: users.length,
    verified: users.filter((u) => u.verificationStatus === "verified").length,
    pending: users.filter((u) => u.verificationStatus === "pending").length,
    admin: users.filter((u) => u.adminStatus === true).length,
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-lightestPrimaryColor to-lightestSecondaryColor">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-16 h-16 border-4 border-primaryColor border-t-secondaryColor rounded-full animate-spin mb-4"></div>
          </div>
          <p className="text-2xl font-RobotoSlab font-bold text-secondaryColor">Đang tải người dùng...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-lightestPrimaryColor via-white to-lightestSecondaryColor px-4 md:px-8 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-RobotoSlab font-bold text-secondaryColor mb-3">Quản lý người dùng</h1>
        <p className="text-lg text-gray-600 font-OpenSans">Quản lý và giám sát các tài khoản người dùng</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          icon={<MdPeople className="w-8 h-8" />}
          title="Tổng người dùng"
          value={stats.total}
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          icon={<MdVerified className="w-8 h-8" />}
          title="Đã xác minh"
          value={stats.verified}
          gradient="from-green-500 to-green-600"
        />
        <StatCard
          icon={<MdPending className="w-8 h-8" />}
          title="Chờ xử lý"
          value={stats.pending}
          gradient="from-yellow-500 to-yellow-600"
        />
        <StatCard
          icon={<MdPeople className="w-8 h-8" />}
          title="Quản trị viên"
          value={stats.admin}
          gradient="from-purple-500 to-purple-600"
        />
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-neutralColor mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-RobotoCondensed font-bold text-secondaryColor mb-3">
              Tìm kiếm người dùng
            </label>
            <div className="relative">
              <MdSearch className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-neutralColor rounded-lg font-OpenSans text-secondaryColor placeholder-gray-400 focus:outline-none focus:border-primaryColor focus:ring-2 focus:ring-primaryColor focus:ring-opacity-50 transition-all"
              />
            </div>
          </div>

          {/* Filter */}
          <div>
            <label className="block text-sm font-RobotoCondensed font-bold text-secondaryColor mb-3">
              Lọc theo trạng thái
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 border-2 border-neutralColor rounded-lg font-OpenSans text-secondaryColor focus:outline-none focus:border-primaryColor focus:ring-2 focus:ring-primaryColor focus:ring-opacity-50 transition-all"
            >
              <option value="all">Tất cả người dùng</option>
              <option value="verified">Chỉ đã xác minh</option>
              <option value="pending">Chỉ chờ xử lý</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-neutralColor">
        <div className="mb-8">
          <h2 className="text-2xl font-RobotoSlab font-bold text-secondaryColor mb-2">
            Người dùng ({filteredUsers.length})
          </h2>
          <p className="text-gray-600 font-OpenSans">
            Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredUsers.length)} của{" "}
            {filteredUsers.length} người dùng
          </p>
        </div>

        {currentUsers.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gradient-to-r from-secondaryColor to-blue-900 text-white">
                  <tr>
                    <th className="px-6 py-4 font-RobotoCondensed font-bold">Tên người dùng</th>
                    <th className="px-6 py-4 font-RobotoCondensed font-bold">Email</th>
                    <th className="px-6 py-4 font-RobotoCondensed font-bold">Trạng thái</th>
                    <th className="px-6 py-4 font-RobotoCondensed font-bold">Quyền hạn</th>
                    <th className="px-6 py-4 font-RobotoCondensed font-bold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-neutralColor hover:bg-lightestPrimaryColor transition-colors"
                    >
                      <td className="px-6 py-4 font-RobotoCondensed font-bold text-secondaryColor">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 font-OpenSans text-gray-600">{user.email}</td>
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
                      <td className="px-6 py-4">
                        {user.adminStatus ? (
                          <span className="px-3 py-1 rounded-full text-xs font-RobotoCondensed font-bold bg-purple-100 text-purple-800">
                            Admin
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-RobotoCondensed font-bold bg-gray-100 text-gray-800">
                            Người dùng
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {!user.adminStatus ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                changeUserRoleToAdmin(user._id, user.email);
                              }}
                              disabled={actionLoading}
                              className="text-green-600 hover:text-green-800 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Thành admin
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeUserAdminRole(user._id, user.email);
                              }}
                              disabled={actionLoading}
                              className="text-yellow-600 hover:text-yellow-800 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Bỏ admin
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteUser(user._id, user.email);
                            }}
                            className="text-red-600 hover:text-red-800 font-bold transition-colors flex items-center gap-1"
                          >
                            <MdDelete className="w-5 h-5" />
                            xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border-2 border-primaryColor text-primaryColor rounded-lg font-RobotoCondensed font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lightestPrimaryColor transition-all"
                >
                  Trang trước
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg font-RobotoCondensed font-bold transition-all ${
                      currentPage === page
                        ? "bg-gradient-to-r from-primaryColor to-darkPrimaryColor text-white"
                        : "border-2 border-neutralColor text-secondaryColor hover:border-primaryColor"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border-2 border-primaryColor text-primaryColor rounded-lg font-RobotoCondensed font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lightestPrimaryColor transition-all"
                >
                  Trang sau
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 font-OpenSans text-lg">Không tìm thấy người dùng</p>
          </div>
        )}
      </div>


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


