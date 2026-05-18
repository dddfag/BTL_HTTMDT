require("dotenv").config();
const connectDb = require("./db/connect");
const Admin = require("./models/admin");
const User = require("./models/userData");
const bcryptjs = require("bcryptjs");

const populateAdminsAndUsers = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    await Admin.deleteMany();
    await User.deleteMany();
    const adminPassword = await bcryptjs.hash("admin123", 10);
    const userPassword = await bcryptjs.hash("user123", 10);
    

    const usersData = [
      {
        username: "johndoe",
        email: "john@example.com",
        password: userPassword,
        address: "123 Main St, City, State",
        country: "USA",
        city: "New York",
        postalCode: 10001,
        adminStatus: false,
        verificationStatus: "verified",
      },
      {
        username: "janesmith",
        email: "jane@example.com",
        password: userPassword,
        address: "456 Oak Ave, Town, State",
        country: "USA",
        city: "Los Angeles",
        postalCode: 90001,
        adminStatus: false,
        verificationStatus: "verified",
      },
      {
        username: "bobjohnson",
        email: "bob@example.com",
        password: userPassword,
        address: "789 Pine Rd, Village, State",
        country: "USA",
        city: "Chicago",
        postalCode: 60601,
        adminStatus: false,
        verificationStatus: "pending",
      },
      {
        username: "admin_user",
        email: "admin@auffur.com",
        password: adminPassword,
        address: "Admin Building",
        country: "USA",
        city: "New York",
        postalCode: 10001,
        adminStatus: true,
        verificationStatus: "verified",
      },
      {
        username: "admin_two",
        email: "admin2@auffur.com",
        password: adminPassword,
        address: "Admin Building 2",
        country: "USA",
        city: "Los Angeles",
        postalCode: 90001,
        adminStatus: true,
        verificationStatus: "verified",
      },
    ];
    
    const createdUsers = await User.create(usersData);
    
    // Create sample admins (linking to users)
    const admins = [
      {
        userData: createdUsers[3]._id, // admin@auffur.com
        adminRank: 1, // Super Admin
      },
      {
        userData: createdUsers[4]._id, // admin2@auffur.com
        adminRank: 2, // Admin
      },
    ];
    
    await Admin.create(admins);
    
    console.log("Admins and Users populated successfully!");
    console.log(`   - ${admins.length} admin(s) created`);
    console.log(`   - ${createdUsers.length} user(s) created`);
    console.log("\nSample Credentials:");
    console.log("   Admin 1: admin@auffur.com / admin123");
    console.log("   Admin 2: admin2@auffur.com / admin123");
    console.log("   User 1: john@example.com / user123");
    console.log("   User 2: jane@example.com / user123");
    console.log("   User 3: bob@example.com / user123");
    process.exit(0);
  } catch (error) {
    console.error("Error populating database:", error.message);
    process.exit(1);
  }
};

populateAdminsAndUsers();
