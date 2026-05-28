# Hướng Dẫn: Chuyển Đổi Giá Sang VND (Tiền Việt)

## Tình Huống Hiện Tại

Website **Auffur** đã được cập nhật để sử dụng **Đồng Việt (VND)** thay vì USD.

### Những Thay Đổi Chính:

1. ✅ **Database**: Tất cả giá sản phẩm được lưu trực tiếp bằng VND
2. ✅ **Frontend**: Hiển thị giá với ký hiệu VND (₫) theo tiêu chuẩn Việt Nam
3. ✅ **Không còn conversion**: Không cần chuyển đổi tiền tệ - mọi giá đều là VND

---

## Hướng Dẫn Sử Dụng

### 1. Tạo/Thêm Sản Phẩm Mới

Khi tạo sản phẩm mới, **hãy nhập giá trực tiếp bằng VND**. Ví dụ:

```javascript
{
  title: "Ghế gỗ",
  price: 1500000,        // 1.5 triệu đồng (không phải USD)
  stock: 50,
  discountPercentValue: 10,
  image: "url...",
  categories: {
    "Featured Categories": ["featured"],
    location: ["living room"],
    features: ["chairs"],
    others: []
  }
}
```

### 2. Chuyển Đổi Dữ Liệu Cũ (USD → VND)

Nếu bạn đã có dữ liệu cũ lưu bằng USD trong database:

```bash
# Chạy script migration
node migrateToVND.js
```

Script này sẽ:
- Tìm tất cả sản phẩm có giá < 100,000 (coi là USD)
- Nhân với 24,000 để chuyển sang VND
- Lưu lại vào database

### 3. Hiển Thị Giá Trên Frontend

Giá tự động được định dạng với ký hiệu VND:

```javascript
// Trong component React
import { formatPriceVND } from "../utils/priceFormatter";

// Sử dụng
<h3>{formatPriceVND(1500000)}</h3>
// Kết quả: ₫1.500.000
```

### 4. Xử Lý Thanh Toán

#### VietQR Payment (QR Code):
- Giá đã là VND, truyền trực tiếp cho API
- Không cần convert

```javascript
// Gửi thanh toán VietQR
const response = await axios.post("/api/v1/vietqr/generate", {
  amount: totalAmount,  // Đã là VND từ database
  orderId: "order123",
  email: "customer@email.com"
});
```

#### Thanh Toán Tiền Mặt:
- Giá hiển thị là VND
- Khách hàng thanh toán bằng VND

---

## Cấu Trúc Giá (VND)

| Loại Sản Phẩm | Giá Tầm | Ví Dụ |
|---|---|---|
| Đồ nhỏ | 100K - 500K | Đèn: 500,000₫ |
| Ghế/Bàn | 500K - 3M | Ghế: 1,500,000₫ |
| Bộ nội thất | 3M+ | Bộ sofa: 6,000,000₫ |

---

## Tỷ Giá Tham Khảo

```
1 USD = 24,000 VND (tỷ giá cố định trong hệ thống)
```

Nếu muốn thay đổi tỷ giá, sửa trong `backend/migrateToVND.js`:

```javascript
const USD_TO_VND_RATE = 24000;  // Sửa con số này
```

---

## Các File Liên Quan

### Backend:
- `models/products.js` - Lưu giá bằng VND
- `productsJSON.js` - Dữ liệu sản phẩm mẫu (VND)
- `migrateToVND.js` - Script chuyển USD → VND
- `controllers/vietQRPayment.js` - QR payment (VND)
- `controllers/Orders.js` - Xử lý đơn hàng (VND)

### Frontend:
- `utils/priceFormatter.js` - Định dạng hiển thị VND
- Tất cả component hiển thị giá sử dụng `formatPriceVND()`

---

## Bộ Lọc Giá

Bộ lọc trong shop page giờ hiển thị VND:

- 24.000₫ - 240.000₫ (tầm $1-10)
- 264.000₫ - 2.400.000₫ (tầm $11-100)
- 2.424.000₫ - 6.000.000₫ (tầm $101-250)
- 6.024.000₫+ (tầm $251+)

---

## Admin Panel

Khi quản lý sản phẩm trong admin:
- **Nhập giá bằng VND**
- Ví dụ: Giá 500.000 = 500 nghìn đồng
- Không cần nhập đơn vị, hệ thống tự động định dạng

---

## FAQ

**Q: Tôi muốn đổi lại sang USD?**
- Sửa `priceFormatter.js` để hiển thị USD
- Nhân giá VND ÷ 24,000 khi hiển thị

**Q: Làm sao thêm tiền ship VND?**
- Phí ship đã được tính bằng VND
- Xem `utils/handleSetShippingMethodValueFn.js`

**Q: Nếu forgot migrate dữ liệu?**
- Chạy `node migrateToVND.js`
- Script tự động bỏ qua những giá đã là VND

---

## Hỗ Trợ

Nếu có vấn đề:
1. Kiểm tra giá trong MongoDB (phải > 100,000 nếu là VND)
2. Chạy migration script nếu cần
3. Xóa cache browser nếu vẫn thấy giá cũ
