# VietQR Payment Integration Guide

Hướng dẫn tích hợp thanh toán VietQR cho hệ thống Auffur Ecommerce

## Mô tả

Hệ thống thanh toán VietQR cho phép khách hàng thanh toán đơn hàng bằng cách quét mã QR. Hệ thống sẽ tự động:

1. Chuyển đổi giá từ USD sang VNĐ (1 USD = 24,000 VNĐ)
2. Tạo mã QR VietQR với thông tin thanh toán
3. Lưu trữ thông tin thanh toán trong đơn hàng

## Cấu hình

### 1. Thiết lập biến môi trường (Backend .env)

```env
# VietQR Configuration
VIET_QR_BANK_CODE=970436              # Mã ngân hàng (MB = 970436)
VIET_QR_ACCOUNT_NUMBER=0123456789     # Số tài khoản nhận thanh toán
VIET_QR_ACCOUNT_NAME=AUFFUR FURNITURE # Tên chủ tài khoản
```

### Mã ngân hàng phổ biến:
- **970436** - MB (Ngân hàng Quân Đội)
- **970418** - ACB (Ngân hàng Á Châu)
- **970010** - BIDV (Ngân hàng Đầu tư và Phát triển)
- **970007** - Vietcombank
- **970405** - Techcombank

Tìm mã ngân hàng tại: https://vietqr.io/

### 2. Frontend - Không cần cấu hình thêm

Frontend sẽ tự động gọi API VietQR từ backend.

## Cách hoạt động

### Flow thanh toán VietQR:

1. **Khách hàng chọn VietQR** trong checkout
   ↓
2. **Frontend tạo mã QR**
   - Gọi `/api/v1/vietqr/generate`
   - Gửi: số tiền USD, email, orderId
   - Nhận: mã QR và thông tin thanh toán
   ↓
3. **Khách hàng quét mã QR**
   - Lấy mã QR từ giao diện
   - Quét bằng ứng dụng ngân hàng hoặc ví điện tử
   ↓
4. **Xác nhận thanh toán**
   - Click "Đã thanh toán"
   - Gọi `/api/v1/vietqr/verify`
   - Lưu đơn hàng
   ↓
5. **Hoàn tất**
   - Đơn hàng được tạo trong hệ thống
   - Kho hàng được cập nhật
   - Khách hàng nhận thông báo

## API Endpoints

### 1. Generate VietQR Payment

**Endpoint:** `POST /api/v1/vietqr/generate`

**Request Body:**
```json
{
  "amount": 100.50,           // Số tiền USD
  "orderId": "ORD-1234567890",
  "email": "customer@email.com",
  "description": "Thanh toán đơn hàng ORD-1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "ORD-1234567890",
    "amount": 2412000,                    // VNĐ
    "currency": "VND",
    "originalAmount": 100.50,             // USD
    "originalCurrency": "USD",
    "vietQRImageUrl": "https://img.vietqr.io/image/...",
    "bankInfo": {
      "code": "970436",
      "accountNumber": "0123456789",
      "accountName": "AUFFUR FURNITURE"
    },
    "expiresAt": "2024-01-15T10:45:30Z"
  }
}
```

### 2. Verify VietQR Payment

**Endpoint:** `POST /api/v1/vietqr/verify`

**Request Body:**
```json
{
  "orderId": "ORD-1234567890",
  "amount": 2412000,
  "transactionRef": "TXN-optional"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "ORD-1234567890",
    "amount": 2412000,
    "status": "verified",
    "verifiedAt": "2024-01-15T10:40:30Z"
  }
}
```

## Dữ liệu thanh toán trong Order

Khi khách hàng thanh toán bằng VietQR, đơn hàng sẽ lưu:

```javascript
{
  // ... thông tin đơn hàng khác
  paymentMethod: "vietqr",
  totalAmount: 2412000,                 // VNĐ (tất cả giá đã là VND)
  currency: "VND",
  paymentStatus: "pending",
  deliveryStatus: "pending",
  createdAt: "2024-01-15T10:40:00Z"
}
```

**Lưu ý**: Tất cả giá sản phẩm đã được lưu trực tiếp bằng VND trong database. Không còn cần chuyển đổi USD → VND.

## Tính năng

✅ Chuyển đổi tự động USD → VNĐ
✅ Tạo mã QR VietQR
✅ Hiển thị thông tin ngân hàng
✅ Xác minh thanh toán
✅ Lưu trữ thông tin giá cả gốc và chuyển đổi
✅ Hạn thanh toán 15 phút
✅ Hỗ trợ tiếng Việt

## Tùy chỉnh tỷ giá USD/VNĐ (Lưu ý: Không còn cần dùng)

**DEPRECATED**: Tỷ giá chỉ còn được dùng trong script migration. Tất cả giá đã được lưu bằng VND nên không cần chuyển đổi trong app.

Nếu cần cập nhật tỷ giá cho migration trong tương lai, chỉnh sửa file `backend/migrateToVND.js`:

```javascript
const USD_TO_VND_RATE = 24000; // Thay đổi số này
```

## Tích hợp thực tế với ngân hàng

Hiện tại, hệ thống đang hoạt động ở chế độ demo. Để tích hợp thực tế:

1. **Lấy API credentials** từ nhà cung cấp VietQR
2. **Cập nhật controller** `vietQRPayment.js` để gọi API ngân hàng thật
3. **Implement webhook** để nhận thông báo thanh toán từ ngân hàng
4. **Verify transaction** trực tiếp với hệ thống ngân hàng

## Xử lý lỗi

### Lỗi khi tạo mã QR:
- Kiểm tra thông tin ngân hàng trong .env
- Kiểm tra amount > 0
- Kiểm tra email hợp lệ

### Lỗi xác minh thanh toán:
- Kiểm tra orderId và amount
- Kiểm tra hạn thanh toán chưa hết
- Kiểm tra kết nối mạng

## Bảo mật

- Luôn lưu giữ thông tin tài khoản ngân hàng trong .env
- Không commit .env file lên git
- Sử dụng HTTPS trong production
- Validate tất cả thông tin đầu vào từ client

## Hỗ trợ

Để biết thêm thông tin về VietQR:
- Website: https://vietqr.io/
- Tài liệu: https://vietqr.io/api-docs
- Ngân hàng hỗ trợ: https://vietqr.io/banks
