require("dotenv").config();
const connectDb = require("./db/connect");
const User = require("./models/userData");
const Product = require("./models/products");

const populateOrders = async () => {
  try {
    await connectDb(process.env.MONGO_URI);

    // Get some users
    let users = await User.find().limit(5);
    const products = await Product.find().limit(5);

    if (products.length === 0) {
      console.log("❌ No products found! Cannot populate orders without products.");
      process.exit(1);
    }

    if (users.length === 0) {
      console.log("❌ No users found! Please create users first.");
      process.exit(1);
    }

    let ordersAdded = 0;

    // Create sample orders for existing users
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      
      // Skip if user doesn't have required fields
      if (!user.fullName || !user.phoneNumber) {
        console.log(`⚠ Skipping user ${user.email} - missing fullName or phoneNumber`);
        // Update user with default values if missing
        if (!user.fullName) user.fullName = user.username || "Khách hàng";
        if (!user.phoneNumber) user.phoneNumber = "0900000000";
        await user.save();
      }
      
      // Create 2-3 orders per user
      const orderCount = Math.floor(Math.random() * 2) + 2;
      
      for (let j = 0; j < orderCount; j++) {
        // Select random products
        const orderProducts = [];
        const productCount = Math.floor(Math.random() * 3) + 1;
        
        for (let k = 0; k < productCount; k++) {
          const randomProduct = products[Math.floor(Math.random() * products.length)];
          const quantity = Math.floor(Math.random() * 3) + 1;
          
          orderProducts.push({
            productId: randomProduct._id,
            quantity: quantity,
          });
        }
        
        // Calculate total amount
        let totalAmount = 0;
        for (const item of orderProducts) {
          const product = await Product.findById(item.productId);
          if (product) {
            const discount = product.discountPercentValue || 0;
            const discountedPrice = product.price * (1 - discount / 100);
            totalAmount += discountedPrice * item.quantity;
          }
        }
        
        // Create order
        const order = {
          products: orderProducts,
          username: user.username || "customer",
          fullName: user.fullName || "Khách hàng",
          phoneNumber: user.phoneNumber || "0900000000",
          shippingMethod: ["standard", "express", "free shipping"][Math.floor(Math.random() * 3)],
          paymentMethod: ["cash", "online", "vietqr"][Math.floor(Math.random() * 3)],
          email: user.email,
          address: user.address || "Địa chỉ chưa cập nhật",
          district: "Quận 1",
          ward: "Phường Bến Nghé",
          country: user.country || "Việt Nam",
          city: user.city || "Hồ Chí Minh",
          postalCode: user.postalCode || 70000,
          totalAmount: Math.round(totalAmount),
          deliveryStatus: ["pending", "delivered"][Math.floor(Math.random() * 2)],
          paymentStatus: ["pending", "paid"][Math.floor(Math.random() * 2)],
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        };
        
        user.orders.push(order);
        ordersAdded++;
      }
      
      await user.save();
    }
    
    console.log(`✓ Orders populated successfully! Added ${ordersAdded} orders to ${users.length} users`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error populating orders:", error.message);
    process.exit(1);
  }
};

populateOrders();
