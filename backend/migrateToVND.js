require("dotenv").config();
const connectDb = require("./db/connect");
const Product = require("./models/products");

const USD_TO_VND_RATE = 24000;

const migrateToVND = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    
    console.log("Starting migration: Converting all product prices from USD to VND...\n");
    
    // Get all products
    const allProducts = await Product.find({});
    console.log(`Found ${allProducts.length} products to migrate.\n`);
    
    let migratedCount = 0;
    let skippedCount = 0;
    
    for (const product of allProducts) {
      // Check if price is already large (likely already in VND)
      if (product.price >= 100000) {
        console.log(`✓ SKIPPED: "${product.title}" - Price ${product.price} (already in VND)`);
        skippedCount++;
        continue;
      }
      
      // Convert price from USD to VND
      const oldPrice = product.price;
      const newPrice = Math.round(oldPrice * USD_TO_VND_RATE);
      
      // Update product
      product.price = newPrice;
      await product.save();
      
      console.log(`✓ MIGRATED: "${product.title}" - ${oldPrice}$ → ${newPrice}₫`);
      migratedCount++;
    }
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Migration completed successfully!`);
    console.log(`   - ${migratedCount} product(s) migrated`);
    console.log(`   - ${skippedCount} product(s) skipped (already in VND)`);
    console.log(`${'='.repeat(60)}\n`);
    
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error.message);
    process.exit(1);
  }
};

migrateToVND();
