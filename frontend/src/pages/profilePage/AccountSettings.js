import { motion } from "framer-motion";
import { primaryBtnVariant } from "../../utils/animation";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getUserData } from "../../features/authSlice";
import { MdEdit, MdSave, MdCancel, MdLock } from "react-icons/md";

const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000/";

export const AccountSettings = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.userAuth);

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    phoneNumber: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username || "",
        phoneNumber: userData.phoneNumber || "",
        address: userData.address || "",
        city: userData.city || "",
        country: userData.country || "",
        postalCode: userData.postalCode || "",
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateUserSettings = async () => {
    try {
      setLoading(true);
      const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || "";
      const headers = { Authorization: `Bearer ${LoginToken}` };

      await axios.put(
        `${serverUrl}api/v1/auth/updateUserSettings?email=${userData.email}`,
        {
          username: formData.username,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode,
        },
        { headers }
      );

      toast.success("Settings updated successfully!");
      setIsEditing(false);
      
      // Refresh user data
      const updatedUserData = await axios.get(
        `${serverUrl}api/v1/auth/getUserData?email=${userData.email}`,
        { headers }
      );
      dispatch(getUserData(updatedUserData.data));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update settings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange_API = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    try {
      setLoading(true);
      const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || "";
      const headers = { Authorization: `Bearer ${LoginToken}` };

      await axios.post(
        `${serverUrl}api/v1/auth/changePassword`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        { headers }
      );

      toast.success("Password changed successfully!");
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mb-20">
      <h2 className="text-3xl font-RobotoSlab font-bold text-secondaryColor mb-8">Account Settings</h2>

      <div className="space-y-8 max-w-[700px]">
        {/* Contact Information Section */}
        <div className="bg-white rounded-lg shadow-md p-8 border border-neutralColor">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-RobotoSlab font-bold text-secondaryColor">Contact Information</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 bg-lightPrimaryColor text-white rounded-lg hover:bg-primaryColor transition"
            >
              {isEditing ? <MdCancel className="w-5 h-5" /> : <MdEdit className="w-5 h-5" />}
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>

          <div className="space-y-4">
            {/* Username */}
            <div>
              <label className="block font-RobotoCondensed font-bold text-secondaryColor mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border-2 border-neutralColor rounded-lg font-OpenSans focus:outline-none focus:border-primaryColor disabled:bg-gray-100 disabled:cursor-not-allowed transition"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block font-RobotoCondensed font-bold text-secondaryColor mb-2">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 border-2 border-neutralColor rounded-lg font-OpenSans focus:outline-none focus:border-primaryColor disabled:bg-gray-100 disabled:cursor-not-allowed transition"
              />
            </div>

            {isEditing && (
              <motion.button
                initial="initial"
                whileTap="click"
                variants={primaryBtnVariant}
                onClick={updateUserSettings}
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-primaryColor to-darkPrimaryColor text-white font-RobotoCondensed font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </motion.button>
            )}
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white rounded-lg shadow-md p-8 border border-neutralColor">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-RobotoSlab font-bold text-secondaryColor">Billing Address</h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-lightPrimaryColor text-white rounded-lg hover:bg-primaryColor transition"
              >
                <MdEdit className="w-5 h-5" />
                Edit
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Address */}
            <div>
              <label className="block font-RobotoCondensed font-bold text-secondaryColor mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter your address"
                className="w-full px-4 py-3 border-2 border-neutralColor rounded-lg font-OpenSans focus:outline-none focus:border-primaryColor disabled:bg-gray-100 disabled:cursor-not-allowed transition"
              />
            </div>

            {/* City & Country */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-RobotoCondensed font-bold text-secondaryColor mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="City"
                  className="w-full px-4 py-3 border-2 border-neutralColor rounded-lg font-OpenSans focus:outline-none focus:border-primaryColor disabled:bg-gray-100 disabled:cursor-not-allowed transition"
                />
              </div>
              <div>
                <label className="block font-RobotoCondensed font-bold text-secondaryColor mb-2">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Country"
                  className="w-full px-4 py-3 border-2 border-neutralColor rounded-lg font-OpenSans focus:outline-none focus:border-primaryColor disabled:bg-gray-100 disabled:cursor-not-allowed transition"
                />
              </div>
            </div>

            {/* Postal Code */}
            <div>
              <label className="block font-RobotoCondensed font-bold text-secondaryColor mb-2">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Postal code"
                className="w-full px-4 py-3 border-2 border-neutralColor rounded-lg font-OpenSans focus:outline-none focus:border-primaryColor disabled:bg-gray-100 disabled:cursor-not-allowed transition"
              />
            </div>

            {isEditing && (
              <motion.button
                initial="initial"
                whileTap="click"
                variants={primaryBtnVariant}
                onClick={updateUserSettings}
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-primaryColor to-darkPrimaryColor text-white font-RobotoCondensed font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Address"}
              </motion.button>
            )}
          </div>
        </div>

        {/* Password Change Section */}
        <div className="bg-white rounded-lg shadow-md p-8 border border-neutralColor">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-RobotoSlab font-bold text-secondaryColor flex items-center gap-2">
              <MdLock className="w-6 h-6" />
              Security
            </h3>
            <button
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              className="flex items-center gap-2 px-4 py-2 bg-lightPrimaryColor text-white rounded-lg hover:bg-primaryColor transition"
            >
              {isChangingPassword ? <MdCancel className="w-5 h-5" /> : <MdEdit className="w-5 h-5" />}
              {isChangingPassword ? "Cancel" : "Change Password"}
            </button>
          </div>

          {isChangingPassword && (
            <div className="space-y-4">
              <div>
                <label className="block font-RobotoCondensed font-bold text-secondaryColor mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 border-2 border-neutralColor rounded-lg font-OpenSans focus:outline-none focus:border-primaryColor transition"
                />
              </div>

              <div>
                <label className="block font-RobotoCondensed font-bold text-secondaryColor mb-2">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 border-2 border-neutralColor rounded-lg font-OpenSans focus:outline-none focus:border-primaryColor transition"
                />
              </div>

              <div>
                <label className="block font-RobotoCondensed font-bold text-secondaryColor mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 border-2 border-neutralColor rounded-lg font-OpenSans focus:outline-none focus:border-primaryColor transition"
                />
              </div>

              <motion.button
                initial="initial"
                whileTap="click"
                variants={primaryBtnVariant}
                onClick={handlePasswordChange_API}
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-red-500 to-red-600 text-white font-RobotoCondensed font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password"}
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
