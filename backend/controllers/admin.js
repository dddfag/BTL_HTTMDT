const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const CustomErrorHandler = require("../errors/customErrorHandler");
const bcryptjs = require("bcryptjs");
const User = require("../models/userData");
const mongoose = require("mongoose");

const createNewAdmin = async (req, res) => {
  const { adminRank } = req.body;
  const email = req.body?.email?.toLowerCase();

  const { doerRank, doerData } = res.locals.actionDoer;

  let checkIfEmailExistsinUsers = await User.findOne({ email });
  let checkIfEmailExistsinAdmin = await Admin.findOne({ userData: checkIfEmailExistsinUsers?._id });

  if (checkIfEmailExistsinAdmin) {
    throw new CustomErrorHandler(400, "Email  has already been appointed admin status");
  }
  if (!checkIfEmailExistsinUsers) {
    throw new CustomErrorHandler(400, "Incorect credentials");
  } else if (checkIfEmailExistsinUsers && checkIfEmailExistsinUsers.verificationStatus === "pending") {
    throw new CustomErrorHandler(403, "User Email address must be verified before login");
  } else if (doerRank !== 1) {
    throw new CustomErrorHandler(400, "You arent eligible for this action");
  } else {
    // transaction allows for an atomic run where multiple function can be run and if one fail,the operation fails entirely
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await Admin.create({ userData: checkIfEmailExistsinUsers._id, adminRank });
      await User.findByIdAndUpdate(checkIfEmailExistsinUsers._id, { adminStatus: true });

      await session.commitTransaction();

      res.status(201).json({ message: "User's admin appointment successful" });
    } catch (error) {
      await session.abortTransaction();
      throw new CustomErrorHandler(500, "Something went wrong");
    } finally {
      session.endSession();
    }
  }
};

const removeAdmin = async (req, res) => {
  const email = req.body?.email?.toLowerCase();

  const { doerRank, doerData } = res.locals.actionDoer;

  let checkIfEmailExistsinUsers = await User.findOne({ email });
  let checkIfEmailExistsinAdmin = await Admin.findOne({ userData: checkIfEmailExistsinUsers?._id });

  if (!checkIfEmailExistsinAdmin) {
    throw new CustomErrorHandler(400, "Email address is not an admin");
  } else if (!checkIfEmailExistsinUsers) {
    throw new CustomErrorHandler(400, "Incorect credentials");
  } else if (doerRank !== 1) {
    throw new CustomErrorHandler(400, "You arent eligible for this action");
  } else {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await Admin.findOneAndDelete({ userData: checkIfEmailExistsinUsers._id });
      await User.findByIdAndUpdate(checkIfEmailExistsinUsers._id, { adminStatus: false });

      await session.commitTransaction();

      res.status(201).json({ message: "User admin status has been revoked" });
    } catch (error) {
      await session.abortTransaction();
      throw new CustomErrorHandler(500, "Something went wrong");
    } finally {
      session.endSession();
    }
  }
};

const getAdminDatas = async (req, res) => {
  const adminDatas = await Admin.find({}).populate(userData);
  res.status(200).json({ adminDatas });
};

// invalidate jwt after 6hours of time has elapsed since last activity of admins
const clearAdminJwt = async () => {
  const admins = await Admin.find({});

  for (let key of admins) {
    let {
      userData: { verificationToken },
    } = await key.populate("userData");

    if (new Date() - key.lastLogin > 6 * 60 * 60 * 1000) {
      verificationToken = "";
      await key.save();
    }
  }
};

const validateUserAsAnAdmin = async (req, res) => {
  res.locals = "";

  res.status(200).send("success");
};

const getAllOrders = async (req, res) => {
  try {
    console.log("=== GET ALL ORDERS ===");
    console.log("User:", res.locals.actionDoer);
    
    const users = await User.find({}).select("email username orders");
    console.log("Found", users.length, "users");
    
    const allOrders = [];
    users.forEach(user => {
      user.orders.forEach(order => {
        allOrders.push({
          _id: order._id,
          userEmail: user.email,
          username: user.username,
          fullName: order.fullName,
          phoneNumber: order.phoneNumber,
          address: order.address,
          district: order.district,
          ward: order.ward,
          city: order.city,
          country: order.country,
          postalCode: order.postalCode,
          productCount: order.products.length,
          totalAmount: order.totalAmount,
          paymentMethod: order.paymentMethod,
          shippingMethod: order.shippingMethod,
          deliveryStatus: order.deliveryStatus,
          paymentStatus: order.paymentStatus,
          createdAt: order.date,
        });
      });
    });

    // Sort by date descending (newest first)
    allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log("Returning", allOrders.length, "orders");

    res.status(200).json({
      success: true,
      orders: allOrders,
      totalOrders: allOrders.length,
    });
  } catch (error) {
    throw new CustomErrorHandler(500, "Error fetching orders");
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { userEmail, orderId, deliveryStatus, paymentStatus } = req.body;

    if (!userEmail || !orderId) {
      throw new CustomErrorHandler(400, "User email and order ID are required");
    }

    const user = await User.findOne({ email: userEmail.toLowerCase() });
    if (!user) {
      throw new CustomErrorHandler(404, "User not found");
    }

    const order = user.orders.find(order => order._id.toString() === orderId);
    if (!order) {
      throw new CustomErrorHandler(404, "Order not found");
    }

    if (deliveryStatus) {
      order.deliveryStatus = deliveryStatus;
    }
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    }
    throw new CustomErrorHandler(500, "Error updating order status");
  }
};

module.exports = { createNewAdmin, removeAdmin, getAdminDatas, clearAdminJwt, validateUserAsAnAdmin, getAllOrders, updateOrderStatus };
