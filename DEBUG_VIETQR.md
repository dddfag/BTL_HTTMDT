# Hướng dẫn Debug VietQR Payment

## 1. Kiểm tra Backend có chạy không

### Windows (PowerShell):
```bash
# Vào thư mục backend
cd backend

# Chạy backend
npm start
# hoặc
npm run server  # (nếu dùng nodemon)
```

Nếu chạy thành công sẽ hiển thị:
```
Server is listening on port 5000
```

---

## 2. Kiểm tra lỗi trong Browser Console

### Bước 1: Mở Developer Tools
- **F12** hoặc **Ctrl+Shift+I** (Windows)
- Đi tới tab **Console**

### Bước 2: Kiểm tra lỗi
Nếu thấy lỗi, hãy ghi chú lỗi và kiểm tra:

**Lỗi phổ biến:**

### ❌ "Failed to fetch" hoặc "Cannot POST /api/v1/vietqr/generate"
**Nguyên nhân:** Backend không chạy hoặc route không đúng
**Giải pháp:**
```bash
# Chạy backend
cd backend
npm start
```

### ❌ "ECONNREFUSED" 
**Nguyên nhân:** Frontend không thể kết nối tới backend
**Giải pháp:**
- Kiểm tra PORT backend (mặc định 5000)
- Kiểm tra REACT_APP_SERVER_URL trong frontend
- Kiểm tra CORS trong backend

### ❌ "Cannot read properties of undefined"
**Nguyên nhân:** Dữ liệu không hợp lệ
**Giải pháp:**
- Kiểm tra totalAmount > 0
- Kiểm tra email hợp lệ
- Kiểm tra orderId không rỗng

---

## 3. Kiểm tra API thủ công (Postman hoặc curl)

### Sử dụng curl (Windows PowerShell):
```powershell
$body = @{
    amount = 100.50
    orderId = "ORD-123456"
    email = "test@gmail.com"
    description = "Test payment"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/v1/vietqr/generate" `
  -Method POST `
  -Headers @{"Content-Type" = "application/json"} `
  -Body $body
```

### Hoặc sử dụng Postman:
1. **Tạo request POST**: `http://localhost:5000/api/v1/vietqr/generate`
2. **Headers**: `Content-Type: application/json`
3. **Body (JSON)**:
```json
{
  "amount": 100.50,
  "orderId": "ORD-123456",
  "email": "test@gmail.com",
  "description": "Test payment"
}
```

**Nếu thành công sẽ nhận:**
```json
{
  "success": true,
  "data": {
    "orderId": "ORD-123456",
    "amount": 2412000,
    "vietQRImageUrl": "https://img.vietqr.io/image/...",
    ...
  }
}
```

---

## 4. Kiểm tra Network Tab

### Bước 1: Mở DevTools → Network tab
### Bước 2: Chọn VietQR trong checkout
### Bước 3: Xem request:
- **URL**: `http://localhost:5000/api/v1/vietqr/generate`
- **Method**: POST
- **Status**: Phải là 200 (success)

Nếu status là **500**, xem **Response tab** để xem lỗi từ backend.

---

## 5. Kiểm tra Environment Variables

### Backend (.env):
```bash
# Phải có 3 biến này
VIET_QR_BANK_CODE=970436
VIET_QR_ACCOUNT_NUMBER=0123456789
VIET_QR_ACCOUNT_NAME=AUFFUR FURNITURE
```

### Frontend (.env hoặc .env.local):
```bash
# Tùy chọn (mặc định là http://localhost:5000/)
REACT_APP_SERVER_URL=http://localhost:5000/
```

---

## 6. Checklist trước khi test

- [ ] Backend đang chạy (port 5000)
- [ ] Frontend đang chạy (port 3000)
- [ ] `.env` backend có VIET_QR_BANK_CODE, VIET_QR_ACCOUNT_NUMBER
- [ ] MongoDB đang chạy
- [ ] Không có lỗi trong Browser Console
- [ ] Network request không bị CORS error

---

## 7. Nếu vẫn bị lỗi, hãy ghi lỗi từ Console:

```
🔴 Copy toàn bộ error message:
[Lỗi ở đây]

✅ Gửi cho tôi để debug
```

---

## 8. Khởi động lại

Nếu vẫn không được, thử khởi động lại toàn bộ:

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

Chờ cả hai chạy xong rồi test lại.

---

## Notes

- VietQR sử dụng dịch vụ **img.vietqr.io** - không cần API key riêng
- Tỷ giá USD→VNĐ: 1 USD = 24,000 VNĐ (có thể thay đổi trong code)
- Hạn thanh toán: 15 phút sau khi tạo QR
