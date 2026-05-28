import { useSelector } from "react-redux";
import { formatPriceVND } from "../../utils/priceFormatter";

export const Orders = () => {
  const {
    userData: { orders },
  } = useSelector((state) => state.userAuth);

  const allProducts = useSelector((state) => state.productsData?.allProductsData || []);

  const getProductTitle = (productId) => {
    const product = allProducts.find((p) => p._id === productId);
    return product?.title || "Unknown Product";
  };

  const translateShippingMethod = (method) => {
    const translations = {
      "standard": "Tiêu chuẩn (1-3 ngày)",
      "express": "Vận chuyển nhanh (trong ngày)",
      "free shipping": "Vận chuyển hỏa tốc (1-3 giờ)",
    };
    return translations[method] || method;
  };

  return (
    <div className="w-[100%] lg:w-[100%] max-w-[800px] mb-16">
      <h2 className="text-[28px] font-bold mb-8">Đơn hàng của tôi</h2>
      {!orders || orders.length === 0 ? (
        <div className="bg-neutralColor p-6 rounded-lg text-center">
          <p className="text-[18px] text-secondaryColor">Bạn chưa đặt hàng nào.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order, index) => (
            <div key={index} className="bg-white border-[1px] border-LightSecondaryColor rounded-lg p-6 shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-[20px] font-bold">Đơn hàng #{index + 1}</h3>
                  <p className="text-secondaryColor text-[14px]">
                    {order.date ? new Date(order.date).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }) : "N/A"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[18px] font-bold">{formatPriceVND(order.totalAmount || 0)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-[14px]">
                <div>
                  <p className="font-semibold text-secondaryColor">Phương thức vận chuyển</p>
                  <p className="capitalize">{translateShippingMethod(order.shippingMethod) || "N/A"}</p>
                </div>
                <div>
                  <p className="font-semibold text-secondaryColor">Phương thức thanh toán</p>
                  <p className="capitalize">
                    {order.paymentMethod === "cash" ? "Thanh toán khi nhận hàng" : "Thanh toán trực tuyến"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-secondaryColor">Trạng thái giao hàng</p>
                  <p className={`capitalize ${order.deliveryStatus === "delivered" ? "text-primaryColor" : "text-orange-500"}`}>
                    {order.deliveryStatus === "delivered" ? "Đã giao" : "Đang xử lý"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-secondaryColor">Trạng thái thanh toán</p>
                  <p className={`capitalize ${order.paymentStatus === "paid" ? "text-primaryColor" : "text-orange-500"}`}>
                    {order.paymentStatus === "paid" ? "Đã thanh toán" : "Đang chờ"}
                  </p>
                </div>
              </div>

              <div className="mb-4 border-t-[1px] border-LightSecondaryColor pt-4">
                <p className="font-semibold mb-2 text-secondaryColor">Sản phẩm:</p>
                <div className="text-[14px] space-y-1">
                  {order.products?.map((product, idx) => (
                    <p key={idx}>• {getProductTitle(product.productId)} (Số lượng: {product.quantity})</p>
                  ))}
                </div>
              </div>

              <div className="bg-neutralColor p-4 rounded text-[14px] space-y-2">
                <p>
                  <span className="font-semibold">Địa chỉ:</span> {order.address}
                </p>
                <p>
                  <span className="font-semibold">Quận/Huyện:</span> {order.district || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Phường/Xã:</span> {order.ward || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Thành phố:</span> {order.city}, {order.country} {order.postalCode}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
