import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const VietQRPayment = ({ totalAmount, orderId, email, onPaymentComplete }) => {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [showQR, setShowQR] = useState(false);

  // Auto-generate QR code when component mounts or when amount/email changes
  useEffect(() => {
    if (totalAmount && orderId && email) {
      generateQRCode();
    }
  }, [totalAmount, orderId, email]);

  // Generate VietQR code
  const generateQRCode = async () => {
    if (!totalAmount || !orderId || !email) {
      toast("Thiếu thông tin thanh toán", {
        type: "error",
        autoClose: 3000,
        position: "top-center",
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000/";
      
      const response = await axios.post(`${serverUrl}api/v1/vietqr/generate`, {
        amount: totalAmount,
        orderId,
        email,
        description: `Thanh toán đơn hàng ${orderId}`,
      });

      if (response.data.success) {
        setPaymentInfo(response.data.data);
        setQrCode(response.data.data.vietQRImageUrl);
        setShowQR(true);
        toast("Mã QR VietQR đã được tạo thành công", {
          type: "success",
          autoClose: 2000,
          position: "top-center",
        });
      }
    } catch (error) {
      toast(error.response?.data?.message || "Lỗi tạo mã QR", {
        type: "error",
        autoClose: 3000,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  // Verify payment
  const verifyPayment = async () => {
    if (!paymentInfo?.orderId) {
      toast("Vui lòng tạo mã QR trước", {
        type: "error",
        autoClose: 3000,
        position: "top-center",
      });
      return;
    }

    setLoading(true);
    try {
      const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000/";
      
      const response = await axios.post(`${serverUrl}api/v1/vietqr/verify`, {
        orderId: paymentInfo.orderId,
        amount: paymentInfo.amount,
      });

      if (response.data.success) {
        toast("Thanh toán thành công!", {
          type: "success",
          autoClose: 3000,
          position: "top-center",
        });
        onPaymentComplete?.();
      }
    } catch (error) {
      toast(error.response?.data?.message || "Lỗi xác minh thanh toán", {
        type: "error",
        autoClose: 3000,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !showQR) {
    return (
      <div className="vietqr-payment-container border rounded p-4 bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-gray-600">Đang tạo mã QR...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vietqr-payment-container border rounded p-4 bg-gray-50">
      {!showQR ? (
        <button
          type="button"
          onClick={generateQRCode}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
        >
          {loading ? "Đang tạo mã QR..." : "Tạo lại mã QR VietQR"}
        </button>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="qr-code-container border rounded p-4 bg-white flex justify-center">
            {qrCode && (
              <div className="flex flex-col items-center gap-2">
                <img src={qrCode} alt="VietQR Code" className="w-48 h-48" />
                {paymentInfo && (
                  <div className="payment-details text-center text-sm">
                    <p>
                      <strong>Số tiền:</strong> {paymentInfo.amount.toLocaleString("vi-VN")} VNĐ
                    </p>
                    <p className="text-gray-600 mt-2">Quét mã QR để thanh toán</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="payment-actions flex gap-2">
            <button
              type="button"
              onClick={() => setShowQR(false)}
              disabled={loading}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded disabled:bg-gray-400"
            >
              Quay lại
            </button>
            <button
              type="button"
              onClick={verifyPayment}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
            >
              {loading ? "Đang xác minh..." : "Đã thanh toán"}
            </button>
          </div>

          {paymentInfo && (
            <div className="bank-info text-xs bg-white p-3 rounded border">
              <p>
                <strong>Ngân hàng:</strong> {paymentInfo.bankInfo.name || "MB"}
              </p>
              <p>
                <strong>Tài khoản:</strong> {paymentInfo.bankInfo.accountNumber}
              </p>
              <p>
                <strong>Chủ tài khoản:</strong> {paymentInfo.bankInfo.accountName}
              </p>
              <p className="text-gray-500 mt-2">
                Hạn thanh toán: {new Date(paymentInfo.expiresAt).toLocaleTimeString("vi-VN")}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
