import { useSelector } from "react-redux";

export const Orders = () => {
  const {
    userData: { orders },
  } = useSelector((state) => state.userAuth);

  const allProducts = useSelector((state) => state.productsData?.allProductsData || []);

  const getProductTitle = (productId) => {
    const product = allProducts.find((p) => p._id === productId);
    return product?.title || "Unknown Product";
  };

  return (
    <div className="w-[100%] lg:w-[100%] max-w-[800px] mb-16">
      <h2 className="text-[28px] font-bold mb-8">My Orders</h2>
      {!orders || orders.length === 0 ? (
        <div className="bg-neutralColor p-6 rounded-lg text-center">
          <p className="text-[18px] text-secondaryColor">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order, index) => (
            <div key={index} className="bg-white border-[1px] border-LightSecondaryColor rounded-lg p-6 shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-[20px] font-bold">Order #{index + 1}</h3>
                  <p className="text-secondaryColor text-[14px]">
                    {order.date ? new Date(order.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }) : "N/A"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[18px] font-bold">${order.totalAmount?.toFixed(2) || 0}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-[14px]">
                <div>
                  <p className="font-semibold text-secondaryColor">Shipping Method</p>
                  <p className="capitalize">{order.shippingMethod || "N/A"}</p>
                </div>
                <div>
                  <p className="font-semibold text-secondaryColor">Payment Method</p>
                  <p className="capitalize">
                    {order.paymentMethod === "cash" ? "Cash on Delivery" : "Online Payment"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-secondaryColor">Delivery Status</p>
                  <p className={`capitalize ${order.deliveryStatus === "delivered" ? "text-primaryColor" : "text-orange-500"}`}>
                    {order.deliveryStatus || "pending"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-secondaryColor">Payment Status</p>
                  <p className={`capitalize ${order.paymentStatus === "paid" ? "text-primaryColor" : "text-orange-500"}`}>
                    {order.paymentStatus || "pending"}
                  </p>
                </div>
              </div>

              <div className="mb-4 border-t-[1px] border-LightSecondaryColor pt-4">
                <p className="font-semibold mb-2 text-secondaryColor">Items:</p>
                <div className="text-[14px] space-y-1">
                  {order.products?.map((product, idx) => (
                    <p key={idx}>• {getProductTitle(product.productId)} (Qty: {product.quantity})</p>
                  ))}
                </div>
              </div>

              <div className="bg-neutralColor p-4 rounded text-[14px]">
                <p className="mb-2">
                  <span className="font-semibold">Shipping Address:</span> {order.address}
                </p>
                <p>
                  <span className="font-semibold">City:</span> {order.city}, {order.country} {order.postalCode}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
