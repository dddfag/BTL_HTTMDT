const CustomErrorHandler = require("../errors/customErrorHandler");

/**
 * Generate VietQR payment code
 * VietQR uses QR code standard to generate payment info
 * All prices are now stored in VND in the database
 */
const generateVietQRPayment = async (req, res) => {
  try {
    const { amount, orderId, email, description } = req.body;

    // Validate input
    if (!amount || !orderId || !email) {
      throw new CustomErrorHandler(
        400,
        "Amount, orderId, and email are required"
      );
    }

    // Amount is already in VND (no conversion needed)
    const amountInVnd = amount;

    // Bank account information (Configure these in .env)
    const bankInfo = {
      bankCode: process.env.VIET_QR_BANK_CODE || "970436", // MB (Ngân hàng Quân Đội) - example
      accountNumber: process.env.VIET_QR_ACCOUNT_NUMBER || "0123456789",
      accountName: process.env.VIET_QR_ACCOUNT_NAME || "AUFFUR FURNITURE",
    };

    // Generate VietQR URL (using standard VietQR format)
    // VietQR URL format: https://img.vietqr.io/image/{bank-code}-{account-number}-compact2.png?amount={amount}&addInfo={description}&accountName={accountName}
    const vietQRImageUrl = `https://img.vietqr.io/image/${bankInfo.bankCode}-${bankInfo.accountNumber}-compact2.png?amount=${amountInVnd}&addInfo=${orderId} - ${email}&accountName=${bankInfo.accountName}`;

    // Alternative: Generate raw VietQR data string for custom QR generation
    const qrData = `00020126360014COM.VIETQR0111${bankInfo.accountNumber}52040000530376454061${String(
      amountInVnd
    ).padStart(13, "0")}0708${orderId} - ${email}6304`;

    const paymentInfo = {
      orderId,
      amount: amountInVnd,
      currency: "VND",
      vietQRImageUrl,
      qrData,
      bankInfo: {
        code: bankInfo.bankCode,
        name: "Bank Name",
        accountNumber: bankInfo.accountNumber,
        accountName: bankInfo.accountName,
      },
      description: `Payment for order ${orderId}`,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes expiry
    };

    res.status(200).json({
      success: true,
      data: paymentInfo,
      message: "VietQR payment info generated successfully",
    });
  } catch (error) {
    throw new CustomErrorHandler(
      500,
      error.message || "Failed to generate VietQR payment"
    );
  }
};

/**
 * Verify VietQR payment
 * In production, you would integrate with bank API to verify payment
 */
const verifyVietQRPayment = async (req, res) => {
  try {
    const { orderId, amount, transactionRef } = req.body;

    if (!orderId || !amount) {
      throw new CustomErrorHandler(400, "orderId and amount are required");
    }

    // In production, you would call bank API to verify the transaction
    // For now, we'll accept the payment as verified
    const paymentVerification = {
      orderId,
      amount,
      status: "verified",
      transactionRef: transactionRef || `TXN-${Date.now()}`,
      verifiedAt: new Date(),
    };

    res.status(200).json({
      success: true,
      data: paymentVerification,
      message: "Payment verified successfully",
    });
  } catch (error) {
    throw new CustomErrorHandler(
      500,
      error.message || "Failed to verify VietQR payment"
    );
  }
};

module.exports = {
  generateVietQRPayment,
  verifyVietQRPayment,
};
