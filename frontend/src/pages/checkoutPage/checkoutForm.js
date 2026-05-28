import { useDispatch, useSelector } from "react-redux";
import { setShippingMethod } from "../../features/authSlice";
import { FullpageSpinnerLoader } from "../../components/loaders/spinnerIcon";
import { VietQRPayment } from "../../components/vietQRPayment/VietQRPayment";
import { useState, useEffect } from "react";

export const CheckoutForm = ({ placeOrderFn, checkoutFormData, setCheckoutFormData, totalAmountToBePaid }) => {
  const {
    userData: { isLoading, email },
  } = useSelector((state) => state.userAuth);

  const dispatch = useDispatch();
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  
  // State for Vietnam address API (Hanoi only)
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  // Load Hanoi districts when component mounts
  useEffect(() => {
    loadHanoiDistricts();
  }, []);

  // Load Hanoi districts from API (code 01)
  const loadHanoiDistricts = async () => {
    setLoadingDistricts(true);
    try {
      const response = await fetch("https://provinces.open-api.vn/api/p/01?depth=2");
      const data = await response.json();
      setDistricts(data.districts || []);
    } catch (error) {
      console.error("Error loading Hanoi districts:", error);
    }
    setLoadingDistricts(false);
  };



  // Handle district change
  const handleDistrictChange = async (e) => {
    const districtCode = e.target.value;
    setCheckoutFormData((prevData) => ({
      ...prevData,
      district: districtCode,
      ward: ""
    }));
    setWards([]);

    if (districtCode) {
      try {
        const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
        const data = await response.json();
        setWards(data.wards);
      } catch (error) {
        console.error("Error loading wards:", error);
      }
    }
  };

  // Handle ward change
  const handleWardChange = (e) => {
    setCheckoutFormData((prevData) => ({
      ...prevData,
      ward: e.target.value
    }));
  };

  return (
    <form
      className="mt-20 w-[92%] mx-auto tablet:w-[88%] lg:basis-[50%] xl:basis-[60%] lg:order-1 lg:mx-0  max-w-[500px] xl:max-w-[600px]"
      onSubmit={placeOrderFn}
    >
      <article>
        <h2 className="text-[24px] font-bold  mb-6">Thông tin liên hệ</h2>
        <section className="flex flex-col gap-4 w-[100%] mx-auto">
          <div className="w-[100%] ">
            <label htmlFor="" className="font-medium text-[18px]">
              Tên người dùng
            </label>{" "}
            <br />
            <input
              type="text"
              name=""
              id=""
              required
              className="pl-3 w-[100%] h-[52px] focus-border-[1px] rounded focus:outline-none border-[1px] border-LightSecondaryColor"
              placeholder="username"
              value={checkoutFormData.username}
              onChange={(e) => {
                setCheckoutFormData((prevData) => {
                  return { ...prevData, username: e.target.value };
                });
              }}
            />
          </div>
          <div className="w-[100%] ">
            <label htmlFor="" className="font-medium  text-[18px]">
              Địa chỉ email
            </label>{" "}
            <br />
            <input
              type="email"
              name=""
              readOnly
              id=""
              required
              defaultValue={email}
              className="pl-3 cursor-not-allowed w-[100%] h-[52px] focus-border-[1px] rounded focus:outline-none border-[1px] border-LightSecondaryColor"
              placeholder="user@gmail.com"
            />
          </div>
          <div className="w-[100%] ">
            <label htmlFor="" className="font-medium text-[18px]">
              Số điện thoại
            </label>{" "}
            <br />
            <input
              type="tel"
              name=""
              id=""
              required
              className="pl-3 w-[100%] h-[52px] focus-border-[1px] rounded focus:outline-none border-[1px] border-LightSecondaryColor"
              placeholder="Nhập số điện thoại của bạn"
              value={checkoutFormData.phoneNumber}
              onChange={(e) => {
                setCheckoutFormData((prevData) => {
                  return { ...prevData, phoneNumber: e.target.value };
                });
              }}
            />
          </div>
        </section>
      </article>
      <article className="mt-6">
        <h2 className="text-[24px] font-bold  mb-6">Thông tin thanh toán</h2>
        <section className="flex flex-col gap-4 w-[100%] mx-auto">
          <div className="w-[100%] ">
            <label htmlFor="" className="font-medium  text-[18px]">
              Địa chỉ
            </label>{" "}
            <br />
            <input
              type="text"
              name=""
              id=""
              required
              className="pl-3 w-[100%] h-[52px] focus-border-[1px] rounded focus:outline-none border-[1px] border-LightSecondaryColor"
              placeholder="Address"
              value={checkoutFormData.address}
              onChange={(e) => {
                setCheckoutFormData((prevData) => {
                  return { ...prevData, address: e.target.value };
                });
              }}
            />
          </div>

          <div className="w-[100%]">
            <label htmlFor="" className="font-medium  text-[18px]">
              Quận/Huyện
            </label>{" "}
            <br />
            <select
              required
              disabled={districts.length === 0 || loadingDistricts}
              className="pl-3 w-[100%] h-[52px] focus-border-[1px] rounded focus:outline-none border-[1px] border-LightSecondaryColor"
              value={checkoutFormData.district || ""}
              onChange={handleDistrictChange}
            >
              <option value="" disabled>
                Chọn quận/huyện
              </option>
              {districts.map((district) => (
                <option key={district.code} value={district.code}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-[100%]">
            <label htmlFor="" className="font-medium  text-[18px]">
              Phường/Xã
            </label>{" "}
            <br />
            <select
              required
              disabled={!checkoutFormData.district || wards.length === 0}
              className="pl-3 w-[100%] h-[52px] focus-border-[1px] rounded focus:outline-none border-[1px] border-LightSecondaryColor"
              value={checkoutFormData.ward || ""}
              onChange={handleWardChange}
            >
              <option value="" disabled>
                Chọn phường/xã
              </option>
              {wards.map((ward) => (
                <option key={ward.code} value={ward.code}>
                  {ward.name}
                </option>
              ))}
            </select>
          </div>
        </section>
      </article>
      <article className="mt-6">
        <h2 className="text-[24px] font-bold  mb-6">Tùy chọn vận chuyển</h2>
        <div
          className="flex flex-col gap-2"
          onChange={(e) => {
            if (e.target.type === "radio" && e.target.checked) {
              dispatch(setShippingMethod(e.target.value));
              setCheckoutFormData((prevData) => {
                return { ...prevData, shippingMethod: e.target.value };
              });
            }
          }}
        >
          {" "}
          <div className="flex gap-4 items-center">
            <input type="radio" name="shipping-rate" required value="standard" className="w-4 h-4" />{" "}
            <span className=" text-lg">Tiêu chuẩn (1-3 ngày) :&nbsp;30.000 VND </span>
          </div>
          <div className="flex gap-4 items-center">
            <input type="radio" name="shipping-rate" required value="express" className="w-4 h-4" />{" "}
            <span className=" text-lg">Vận chuyển nhanh (trong ngày) :&nbsp;80.000 VND </span>
          </div>
          <div className="flex gap-4 items-center">
            <input type="radio" name="shipping-rate" required value="free shipping" className="w-4 h-4" />{" "}
            <span className=" text-lg">Vận chuyển hỏa tốc (1-3 giờ) :&nbsp;200.000 VND </span>
          </div>
        </div>
      </article>
      <article className="mt-6">
        <h2 className="text-[24px] font-bold  mb-6">Phương thức thanh toán</h2>
        <div
          className="flex flex-col gap-2"
          onChange={(e) => {
            if (e.target.type === "radio" && e.target.checked) {
              setCheckoutFormData((prevData) => {
                return { ...prevData, paymentMethod: e.target.value };
              });
              setPaymentCompleted(false); // Reset when changing payment method
            }
          }}
        >
          <div className="flex gap-4 items-center">
            <input type="radio" name="payment-method" required value="cash" className="w-4 h-4" /> 
            <span className="text-lg">Thanh toán khi nhận (COD)</span>
          </div>
          <div className="flex gap-4 items-center">
            <input type="radio" name="payment-method" required value="vietqr" className="w-4 h-4" /> 
            <span className="text-lg">Thanh toán VietQR (Quét mã QR)</span>
          </div>
        </div>

        {/* VietQR Payment Component */}
        {checkoutFormData.paymentMethod === "vietqr" && (
          <div className="mt-4">
            <VietQRPayment 
              totalAmount={totalAmountToBePaid}
              orderId={`ORD-${Date.now()}`}
              email={email}
              onPaymentComplete={() => setPaymentCompleted(true)}
            />
          </div>
        )}
      </article>
      <button
        type="submit"
        disabled={checkoutFormData.paymentMethod === "vietqr" && !paymentCompleted}
        className="my-12 w-[100%] mx-auto block h-[52px] bg-primaryColor text-white font-medium rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? <>Xử lý</> : "Đặt đơn hàng"}
      </button>

      {isLoading && <FullpageSpinnerLoader />}
    </form>
  );
};
