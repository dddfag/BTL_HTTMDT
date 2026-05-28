# Danh Sách Kiểm Tra: Hoàn Thành Migration USD → VND

## ✅ Hoàn Thành

### Backend Controllers
- ✅ **vietQRPayment.js** - Xóa convertUsdToVnd import
- ✅ **Orders.js** - Xóa convertUsdToVnd import và logic chuyển đổi
  - Simplified order saving (no more USD/VND duality)
  - API response now shows `currency: "VND"`
- ✅ **currencyConverter.js** - Đánh dấu DEPRECATED với cảnh báo

### Documentation
- ✅ **VIETQR_INTEGRATION.md** - Cập nhật order structure và tỷ giá
- ✅ **VND_CURRENCY_GUIDE.md** - Tạo hướng dẫn sử dụng toàn diện

### Seed Data & Migration
- ✅ **productsJSON.js** - Tất cả 20+ sản phẩm đã convert USD→VND
- ✅ **migrateToVND.js** - Script migration sẵn sàng

---

## ⏳ Cần Thực Hiện

### Bước 1: Chạy Database Migration (QUAN TRỌNG)

Sau khi tất cả code đã update, chạy script để migrate dữ liệu cũ:

```bash
# Terminal 1: Từ thư mục backend
cd backend
node migrateToVND.js
```

**Điều kiện:**
- File `.env` trong backend phải có `MONGO_URI`
- Kết nối được tới MongoDB
- Script sẽ tự động bỏ qua giá đã ≥ 100,000

**Output mong đợi:**
```
Starting migration: Converting all product prices from USD to VND...
Found X products to migrate.

✓ Migrated: Product Name (25 → 600000)
✓ Migrated: Product Name (250 → 6000000)
⊘ Skipped: Already in VND (100000)
...
Completed: Y migrated, Z skipped
```

### Bước 2: Verify Database

Kiểm tra MongoDB để chắc chắn:
- Tất cả giá ≥ 24,000 (1 USD tối thiểu)
- Không có giá nhỏ hơn 100 (không còn USD)

```javascript
// Dùng MongoDB Compass hoặc mongosh
db.products.find({ price: { $lt: 100000 } })  // Không nên có kết quả
db.products.find({}).limit(5)  // Check giá đã convert
```

### Bước 3: Start Servers

```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend (mở tab mới)
cd frontend
npm start
```

### Bước 4: Test Các Chức Năng

#### ✓ Test 1: Hiển Thị Giá
1. Mở http://localhost:3000
2. Duyệt sản phẩm
3. **Verify**: Giá hiển thị với ₫ (ví dụ: ₫600.000)

#### ✓ Test 2: Bộ Lọc Giá
1. Vào Shop page
2. Chọn bộ lọc giá
3. **Verify**: Thấy khoảng VND (24K - 240K, 264K - 2.4M, etc.)

#### ✓ Test 3: Giỏ Hàng
1. Thêm sản phẩm vào cart
2. Mở cart sidebar
3. **Verify**:
   - Giá sản phẩm: ₫X,XXX
   - Tổng tiền: ₫X,XXX
   - Phí ship: ₫X,XXX
   - Tổng cộng: ₫X,XXX

#### ✓ Test 4: Checkout
1. Đi tới checkout page
2. Điền thông tin
3. **Verify**:
   - Order Summary hiển thị VND
   - Tất cả số tiền đúng

#### ✓ Test 5: Thanh Toán VietQR
1. Chọn thanh toán VietQR
2. Ấn "Generate QR Code"
3. **Verify**:
   - Không có lỗi 500/400
   - QR code hiển thị (nếu API intégration)
   - Amount là VND đúng

#### ✓ Test 6: Tạo Đơn Hàng
1. Hoàn tất thanh toán
2. **Verify**:
   - Đơn hàng được lưu
   - totalAmount là VND
   - Không có field `totalAmountInVnd`

#### ✓ Test 7: Profile/Orders
1. Đăng nhập & vào Profile
2. Xem Orders
3. **Verify**:
   - Giá đơn hàng hiển thị VND
   - "Total Spent" tính đúng

---

## Các File Đã Thay Đổi

| File | Thay Đổi | Status |
|------|---------|--------|
| backend/controllers/Orders.js | Remove convertUsdToVnd logic | ✅ Done |
| backend/controllers/vietQRPayment.js | Remove import | ✅ Done |
| backend/utils/currencyConverter.js | Mark DEPRECATED | ✅ Done |
| VIETQR_INTEGRATION.md | Update documentation | ✅ Done |
| VND_CURRENCY_GUIDE.md | Create guide | ✅ Done |
| backend/migrateToVND.js | Ready to use | ✅ Done |
| backend/productsJSON.js | USD→VND converted | ✅ Done |
| Frontend components | Updated to use formatPriceVND | ✅ Done (prev session) |

---

## Nếu Gặp Lỗi

### "Cannot find module: currencyConverter"
- Kiểm tra import statements
- Chạy `grep -r "currencyConverter" backend/` để tìm nơi import

### Giá vẫn hiển thị sai
- Xóa cache browser (Ctrl+Shift+Delete)
- Refresh page
- Kiểm tra Network tab xem price field từ API

### Migration fail kết nối DB
- Verify `MONGO_URI` trong `.env`
- Test kết nối: `node -e "require('dotenv').config(); console.log(process.env.MONGO_URI)"`
- Ensure MongoDB server đang chạy

### VietQR QR code fail
- Check Amount được gửi là số (không string)
- Verify bank config env vars: `VIET_QR_BANK_CODE`, `VIET_QR_ACCOUNT_NUMBER`
- Check API logs

---

## Rollback (Nếu Cần)

Nếu cần quay về USD:

1. **Undo migrations từ MongoDB:**
   ```javascript
   // Reverse: VND → USD (chia cho 24000)
   db.products.updateMany({}, 
     { $set: { price: { $divide: ["$price", 24000] } } }
   )
   ```

2. **Revert code:**
   - Restore `Orders.js` và `vietQRPayment.js` từ git history
   - Uncomment convertUsdToVnd usage

---

## Completion Sign-Off

Khi tất cả tests pass, migration hoàn thành ✅

```
[ ] Database migration chạy thành công
[ ] Tất cả 7 test cases pass
[ ] Không có lỗi 404/500 trong console
[ ] VND hiển thị đúng tất cả nơi
[ ] Thanh toán hoạt động
[ ] Orders lưu đúng VND
```

**Liên hệ nếu cần hỗ trợ:** Check VND_CURRENCY_GUIDE.md cho FAQ
