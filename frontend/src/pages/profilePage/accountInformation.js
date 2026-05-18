import { BiArrowToRight } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdEmail, MdPerson, MdCalendarToday, MdShoppingCart, MdAttachMoney, MdVerified, MdEdit } from "react-icons/md";

export const AccountInformation = () => {
  const { userData } = useSelector((state) => state.userAuth);
  const navigate = useNavigate();

  const yearJoined = userData.createdAt ? new Date(userData.createdAt).getFullYear() : 2022;
  const completePurchases = userData.orders?.length || 0;
  const totalPurchaseValue = userData.orders?.reduce((sum, order) => sum + (order.totalAmount || 0), 0).toFixed(2) || 0;

  const InfoCard = ({ icon: Icon, label, value, highlight = false }) => (
    <div className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
      highlight 
        ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300" 
        : "bg-white border-neutralColor hover:border-primaryColor"
    }`}>
      <div className={`p-3 rounded-lg ${highlight ? "bg-green-100" : "bg-lightestPrimaryColor"}`}>
        <Icon className={`w-6 h-6 ${highlight ? "text-green-600" : "text-primaryColor"}`} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-RobotoCondensed text-gray-600">{label}</p>
        <p className={`text-xl font-bold ${highlight ? "text-green-700" : "text-secondaryColor"}`}>{value}</p>
      </div>
    </div>
  );

  return (
    <div className="w-full mb-20">
      <h2 className="text-3xl font-RobotoSlab font-bold text-secondaryColor mb-8">Account Information</h2>

      {/* Admin Navigation */}
      {userData.adminStatus && (
        <div
          className="mb-8 px-6 py-4 bg-gradient-to-r from-lightPrimaryColor to-primaryColor text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer flex items-center justify-between"
          onClick={() => navigate("/administrator/product-management")}
        >
          <span className="font-RobotoCondensed font-bold text-lg">Proceed to Admin Dashboard</span>
          <BiArrowToRight className="w-6 h-6" />
        </div>
      )}

      {/* Verification Status */}
      <div className={`mb-8 px-6 py-4 rounded-lg flex items-center gap-3 ${
        userData.verificationStatus === "verified" 
          ? "bg-green-100 border-2 border-green-300" 
          : "bg-yellow-100 border-2 border-yellow-300"
      }`}>
        <MdVerified className={`w-6 h-6 ${userData.verificationStatus === "verified" ? "text-green-600" : "text-yellow-600"}`} />
        <span className={`font-RobotoCondensed font-bold ${userData.verificationStatus === "verified" ? "text-green-700" : "text-yellow-700"}`}>
          Email Status: {userData.verificationStatus === "verified" ? "Verified" : "Pending Verification"}
        </span>
      </div>

      {/* Personal Information Section */}
      <div className="bg-white rounded-lg shadow-md p-8 border border-neutralColor mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-RobotoSlab font-bold text-secondaryColor">Personal Information</h3>
          <button
            onClick={() => navigate("../accountSettings")}
            className="flex items-center gap-2 px-4 py-2 bg-lightPrimaryColor text-white rounded-lg hover:bg-primaryColor transition"
          >
            <MdEdit className="w-5 h-5" />
            Edit Profile
          </button>
        </div>

        <div className="space-y-4">
          <InfoCard
            icon={MdEmail}
            label="Email Address"
            value={userData.email}
          />
          <InfoCard
            icon={MdPerson}
            label="Username"
            value={userData.username}
          />
          {userData.phoneNumber && (
            <InfoCard
              icon={MdPerson}
              label="Phone Number"
              value={userData.phoneNumber}
            />
          )}
        </div>
      </div>

      {/* Customer Metrics Section */}
      <div className="bg-white rounded-lg shadow-md p-8 border border-neutralColor">
        <h3 className="text-2xl font-RobotoSlab font-bold text-secondaryColor mb-6">Customer Metrics</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoCard
            icon={MdCalendarToday}
            label="Member Since"
            value={yearJoined}
          />
          <InfoCard
            icon={MdShoppingCart}
            label="Total Orders"
            value={completePurchases}
            highlight={completePurchases > 0}
          />
          <InfoCard
            icon={MdAttachMoney}
            label="Total Spent"
            value={`$${totalPurchaseValue}`}
            highlight={parseFloat(totalPurchaseValue) > 0}
          />
        </div>
      </div>
    </div>
  );
};
