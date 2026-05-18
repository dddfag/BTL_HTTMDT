import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  MdPeople,
  MdVerified,
  MdPending,
  MdDelete,
  MdSearch,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdShoppingCart,
} from "react-icons/md";

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
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
      toast.error("Failed to fetch users");
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
    if (window.confirm(`Are you sure you want to delete user ${userEmail}?`)) {
      try {
        const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || "";
        const headers = { Authorization: `Bearer ${LoginToken}` };

        await axios.delete(`http://localhost:5000/api/v1/auth/deleteUser?id=${userId}`, { headers });
        
        toast.success("User deleted successfully");
        setUsers(users.filter((u) => u._id !== userId));
        setSelectedUser(null);
      } catch (error) {
        toast.error("Failed to delete user");
        console.error(error);
      }
    }
  };

  const changeUserRoleToAdmin = async (userId, userEmail) => {
    if (window.confirm(`Are you sure you want to make ${userEmail} an admin?`)) {
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

        toast.success("User promoted to admin successfully");
        // Update the users list
        const updatedUsers = users.map((u) =>
          u._id === userId ? { ...u, adminStatus: true } : u
        );
        setUsers(updatedUsers);
        
        // Update selected user
        setSelectedUser((prev) => (prev ? { ...prev, adminStatus: true } : null));
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to promote user to admin");
        console.error(error);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const removeUserAdminRole = async (userId, userEmail) => {
    if (window.confirm(`Are you sure you want to revoke admin status from ${userEmail}?`)) {
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

        toast.success("Admin status removed successfully");
        // Update the users list
        const updatedUsers = users.map((u) =>
          u._id === userId ? { ...u, adminStatus: false } : u
        );
        setUsers(updatedUsers);

        // Update selected user
        setSelectedUser((prev) => (prev ? { ...prev, adminStatus: false } : null));
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to remove admin status");
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
          <p className="text-2xl font-RobotoSlab font-bold text-secondaryColor">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-lightestPrimaryColor via-white to-lightestSecondaryColor px-4 md:px-8 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-RobotoSlab font-bold text-secondaryColor mb-3">User Management</h1>
        <p className="text-lg text-gray-600 font-OpenSans">Manage and monitor user accounts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          icon={<MdPeople className="w-8 h-8" />}
          title="Total Users"
          value={stats.total}
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          icon={<MdVerified className="w-8 h-8" />}
          title="Verified"
          value={stats.verified}
          gradient="from-green-500 to-green-600"
        />
        <StatCard
          icon={<MdPending className="w-8 h-8" />}
          title="Pending"
          value={stats.pending}
          gradient="from-yellow-500 to-yellow-600"
        />
        <StatCard
          icon={<MdPeople className="w-8 h-8" />}
          title="Admins"
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
              Search Users
            </label>
            <div className="relative">
              <MdSearch className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-neutralColor rounded-lg font-OpenSans text-secondaryColor placeholder-gray-400 focus:outline-none focus:border-primaryColor focus:ring-2 focus:ring-primaryColor focus:ring-opacity-50 transition-all"
              />
            </div>
          </div>

          {/* Filter */}
          <div>
            <label className="block text-sm font-RobotoCondensed font-bold text-secondaryColor mb-3">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 border-2 border-neutralColor rounded-lg font-OpenSans text-secondaryColor focus:outline-none focus:border-primaryColor focus:ring-2 focus:ring-primaryColor focus:ring-opacity-50 transition-all"
            >
              <option value="all">All Users</option>
              <option value="verified">Verified Only</option>
              <option value="pending">Pending Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-neutralColor">
        <div className="mb-8">
          <h2 className="text-2xl font-RobotoSlab font-bold text-secondaryColor mb-2">
            Users ({filteredUsers.length})
          </h2>
          <p className="text-gray-600 font-OpenSans">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredUsers.length)} of{" "}
            {filteredUsers.length} users
          </p>
        </div>

        {currentUsers.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gradient-to-r from-secondaryColor to-blue-900 text-white">
                  <tr>
                    <th className="px-6 py-4 font-RobotoCondensed font-bold">Username</th>
                    <th className="px-6 py-4 font-RobotoCondensed font-bold">Email</th>
                    <th className="px-6 py-4 font-RobotoCondensed font-bold">Status</th>
                    <th className="px-6 py-4 font-RobotoCondensed font-bold">Admin</th>
                    <th className="px-6 py-4 font-RobotoCondensed font-bold">Joined</th>
                    <th className="px-6 py-4 font-RobotoCondensed font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-neutralColor hover:bg-lightestPrimaryColor transition-colors cursor-pointer"
                      onClick={() => setSelectedUser(user)}
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
                            User
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-OpenSans">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }) : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteUser(user._id, user.email);
                          }}
                          className="text-red-600 hover:text-red-800 font-bold transition-colors flex items-center gap-1"
                        >
                          <MdDelete className="w-5 h-5" />
                          Delete
                        </button>
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
                  Previous
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
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 font-OpenSans text-lg">No users found</p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-primaryColor to-darkPrimaryColor text-white p-8 flex justify-between items-center sticky top-0">
              <h3 className="text-2xl font-RobotoSlab font-bold">User Details</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-2xl font-bold hover:opacity-80 transition-opacity"
              >
                ✕
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <DetailItem label="Username" value={selectedUser.username} />
                <DetailItem label="Email" value={selectedUser.email} />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <DetailItem
                  label="Status"
                  value={
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-RobotoCondensed font-bold ${
                        selectedUser.verificationStatus === "verified"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedUser.verificationStatus}
                    </span>
                  }
                />
                <DetailItem
                  label="Role"
                  value={
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-RobotoCondensed font-bold ${
                        selectedUser.adminStatus
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedUser.adminStatus ? "Admin" : "User"}
                    </span>
                  }
                />
              </div>

              {selectedUser.address && (
                <DetailItem label="Address" value={selectedUser.address} icon={<MdLocationOn />} />
              )}
              {selectedUser.city && (
                <DetailItem
                  label="City"
                  value={`${selectedUser.city}${selectedUser.country ? ", " + selectedUser.country : ""}`}
                />
              )}
              {selectedUser.postalCode && <DetailItem label="Postal Code" value={selectedUser.postalCode} />}

              <DetailItem
                label="Phone"
                value={selectedUser.phoneNumber || "Not provided"}
                icon={<MdPhone />}
              />

              <DetailItem
                label="Orders"
                value={selectedUser.orders?.length || 0}
                icon={<MdShoppingCart />}
              />

              <DetailItem
                label="Joined"
                value={new Date(selectedUser.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />

              <div className="pt-6 border-t border-neutralColor space-y-3">
                {selectedUser.adminStatus ? (
                  <button
                    onClick={() => {
                      removeUserAdminRole(selectedUser._id, selectedUser.email);
                    }}
                    disabled={actionLoading}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-RobotoCondensed font-bold py-3 px-6 rounded-lg transition-all"
                  >
                    {actionLoading ? "Processing..." : "Revoke Admin Status"}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      changeUserRoleToAdmin(selectedUser._id, selectedUser.email);
                    }}
                    disabled={actionLoading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-RobotoCondensed font-bold py-3 px-6 rounded-lg transition-all"
                  >
                    {actionLoading ? "Processing..." : "Make Admin"}
                  </button>
                )}
                <button
                  onClick={() => {
                    deleteUser(selectedUser._id, selectedUser.email);
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-RobotoCondensed font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <MdDelete className="w-5 h-5" />
                  Delete User
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

// Detail Item Component
const DetailItem = ({ label, value, icon }) => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      {icon && <span className="text-primaryColor">{icon}</span>}
      <label className="text-xs font-RobotoCondensed font-bold text-gray-600 uppercase tracking-wider">
        {label}
      </label>
    </div>
    <p className="text-lg font-OpenSans text-secondaryColor">{value}</p>
  </div>
);
