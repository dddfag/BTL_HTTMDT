const mongoose = require('mongoose');
const User = require('./models/userData');
const Admin = require('./models/admin');
require('dotenv').config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Check admins
    const admins = await User.find({ adminStatus: true }).select('email username adminStatus');
    console.log('\n=== ADMINS IN DB ===');
    console.log('Found', admins.length, 'admins');
    admins.forEach(admin => {
      console.log(`- ${admin.email} (${admin.username}) - adminStatus: ${admin.adminStatus}`);
    });
    
    // Check orders
    console.log('\n=== ORDERS IN DB ===');
    const usersWithOrders = await User.find({}).select('email username orders');
    let totalOrders = 0;
    usersWithOrders.forEach(user => {
      if (user.orders && user.orders.length > 0) {
        console.log(`- ${user.email}: ${user.orders.length} orders`);
        totalOrders += user.orders.length;
      }
    });
    console.log(`Total orders: ${totalOrders}`);
    
    // Check Admin collection
    console.log('\n=== ADMIN COLLECTION ===');
    const adminRecords = await Admin.find().select('adminRank userData');
    console.log('Found', adminRecords.length, 'admin records');
    adminRecords.forEach(admin => {
      console.log(`- AdminRank: ${admin.adminRank}, UserId: ${admin.userData}`);
    });
    
    process.exit(0);
  } catch(e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();
