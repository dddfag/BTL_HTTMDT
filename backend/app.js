const express = require("express");
require("dotenv").config();
require("express-async-errors");
const connectDb = require("./db/connect");
const errorHandler = require("./middleware/errorHandler");
const pathNotFound = require("./middleware/pathNotFound");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const cors = require("cors");
const productRoute = require("./routes/productRoute");
const authRoute = require("./routes/authenticationRoute");
const adminRoute = require("./routes/adminRoutes");
const ordersRoute = require("./routes/ordersRoute");
const revenueRoute = require("./routes/revenueRoute");
const vietQRRoute = require("./routes/vietQRRoute");
const { clearAdminJwt } = require("./controllers/admin");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();
//  middlewares
app.use(cors({
  origin:[
    "https://auffur-furnishes.netlify.app",
    "http://localhost:3000"
  ]
}));
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).send("<h1>Auffur,ecommerce server</h1> ");
});

app.use("/api/v1/products", productRoute);
app.use("/api/v1/auth", authRoute);
app.use("/orders", ordersRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/revenue", revenueRoute);
app.use("/api/v1/vietqr", vietQRRoute);
app.use(errorHandler);
app.use(pathNotFound);

// clear admin token after 6 hours of inactivity
setInterval(clearAdminJwt, 6 * 60 * 60 * 1000);

const port = process.env.PORT || 5000;

let dbConnected = false;

// Healthcheck endpoint - doesn't require DB
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', dbConnected });
});

const startServer = async () => {
  try {
    // Start server immediately
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });

    // Connect to MongoDB in background
    try {
      await connectDb(process.env.MONGO_URI);
      dbConnected = true;
      console.log('MongoDB connected successfully');
    } catch (dbError) {
      console.error('MongoDB connection failed:', dbError.message);
      console.error('Full error:', dbError);
      // Don't exit - app can still serve requests
    }
  } catch (error) {
    console.error('Failed to start server:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

startServer();
