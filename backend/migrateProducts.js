require("dotenv").config();
const connectDb = require("./db/connect");
const Product = require("./models/products");

const migrateProducts = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    
    // Update all products that don't have description field
    const result = await Product.updateMany(
      { description: { $exists: false } },
      { $set: { description: "" } }
    );

    console.log("Migration completed successfully!");
    console.log(`   - ${result.matchedCount} product(s) found`);
    console.log(`   - ${result.modifiedCount} product(s) updated with description field`);
    
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error.message);
    process.exit(1);
  }
};

migrateProducts();
