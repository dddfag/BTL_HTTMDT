const User = require("../models/userData");
const CustomErrorHandler = require("../errors/customErrorHandler");

// Get revenue dashboard data (total revenue, order count, average order value)
const getRevenueDashboard = async (req, res) => {
  try {
    const allUsers = await User.find();
    
    let totalRevenue = 0;
    let totalOrders = 0;
    let paidOrders = 0;
    let pendingOrders = 0;
    let cancelledOrders = 0;
    let deliveredOrders = 0;

    allUsers.forEach((user) => {
      user.orders.forEach((order) => {
        totalOrders++;
        totalRevenue += order.totalAmount || 0;
        
        if (order.paymentStatus === "paid") {
          paidOrders++;
        } else if (order.paymentStatus === "pending") {
          pendingOrders++;
        } else if (order.paymentStatus === "cancelled") {
          cancelledOrders++;
        }
        
        if (order.deliveryStatus === "delivered") {
          deliveredOrders++;
        }
      });
    });

    const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

    res.status(200).json({
      totalRevenue: totalRevenue.toFixed(2),
      totalOrders,
      averageOrderValue,
      paidOrders,
      pendingOrders,
      cancelledOrders,
      deliveredOrders,
    });
  } catch (error) {
    throw new CustomErrorHandler(500, error.message);
  }
};

// Get revenue trends (daily/monthly)
const getRevenueTrends = async (req, res) => {
  try {
    const { period = "monthly" } = req.query; // monthly or daily
    const allUsers = await User.find();

    const trendData = {};

    allUsers.forEach((user) => {
      user.orders.forEach((order) => {
        const date = new Date(order.date);
        let key;

        if (period === "daily") {
          key = date.toISOString().split("T")[0]; // YYYY-MM-DD
        } else {
          key = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`; // Jan 2024
        }

        if (!trendData[key]) {
          trendData[key] = { date: key, revenue: 0, orders: 0 };
        }

        trendData[key].revenue += order.totalAmount || 0;
        trendData[key].orders += 1;
      });
    });

    // Convert to sorted array
    const trends = Object.values(trendData)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((item) => ({
        ...item,
        revenue: parseFloat(item.revenue.toFixed(2)),
      }));

    res.status(200).json(trends);
  } catch (error) {
    throw new CustomErrorHandler(500, error.message);
  }
};

// Get revenue by product
const getRevenueByProduct = async (req, res) => {
  try {
    const allUsers = await User.find().populate("orders.products.productId");
    const Product = require("../models/products");

    const productRevenue = {};

    allUsers.forEach((user) => {
      user.orders.forEach((order) => {
        order.products.forEach((item) => {
          const productId = item.productId?._id?.toString();
          const productTitle = item.productId?.title || "Unknown Product";
          const quantity = item.quantity || 0;
          
          // Calculate revenue for this order item
          let itemRevenue = 0;
          if (item.productId?.price) {
            const discount = item.productId?.discountPercentage || 0;
            const discountedPrice = item.productId.price * (1 - discount / 100);
            itemRevenue = discountedPrice * quantity;
          }

          if (!productRevenue[productId]) {
            productRevenue[productId] = {
              productId,
              productTitle,
              revenue: 0,
              quantitySold: 0,
            };
          }

          productRevenue[productId].revenue += itemRevenue;
          productRevenue[productId].quantitySold += quantity;
        });
      });
    });

    // Convert to sorted array (top 10)
    const products = Object.values(productRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
      .map((item) => ({
        ...item,
        revenue: parseFloat(item.revenue.toFixed(2)),
      }));

    res.status(200).json(products);
  } catch (error) {
    throw new CustomErrorHandler(500, error.message);
  }
};

// Get detailed sales report
const getSalesReport = async (req, res) => {
  try {
    const { status = "all", limit = 50, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const allUsers = await User.find();
    let allOrders = [];

    allUsers.forEach((user) => {
      user.orders.forEach((order) => {
        allOrders.push({
          ...order.toObject ? order.toObject() : order,
          userId: user._id,
          username: user.username,
          userEmail: user.email,
        });
      });
    });

    // Filter by status
    if (status !== "all") {
      if (status === "paid" || status === "pending" || status === "cancelled") {
        allOrders = allOrders.filter((order) => order.paymentStatus === status);
      } else if (status === "delivered" || status === "pending" || status === "cancelled") {
        allOrders = allOrders.filter((order) => order.deliveryStatus === status);
      }
    }

    // Sort by date (newest first)
    allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

    const total = allOrders.length;
    const paginatedOrders = allOrders.slice(skip, skip + parseInt(limit));

    res.status(200).json({
      orders: paginatedOrders.map((order) => ({
        ...order,
        totalAmount: parseFloat(order.totalAmount || 0).toFixed(2),
      })),
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    throw new CustomErrorHandler(500, error.message);
  }
};

// Get payment method breakdown
const getPaymentMethodBreakdown = async (req, res) => {
  try {
    const allUsers = await User.find();
    const paymentBreakdown = {};

    allUsers.forEach((user) => {
      user.orders.forEach((order) => {
        const method = order.paymentMethod || "unknown";
        if (!paymentBreakdown[method]) {
          paymentBreakdown[method] = { method, count: 0, revenue: 0 };
        }
        paymentBreakdown[method].count += 1;
        paymentBreakdown[method].revenue += order.totalAmount || 0;
      });
    });

    const breakdown = Object.values(paymentBreakdown).map((item) => ({
      ...item,
      revenue: parseFloat(item.revenue.toFixed(2)),
    }));

    res.status(200).json(breakdown);
  } catch (error) {
    throw new CustomErrorHandler(500, error.message);
  }
};

module.exports = {
  getRevenueDashboard,
  getRevenueTrends,
  getRevenueByProduct,
  getSalesReport,
  getPaymentMethodBreakdown,
};
