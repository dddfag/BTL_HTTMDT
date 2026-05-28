const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "please enter your full name"],
    },
    username: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "please enter an email"],
    },
    password: {
      type: String,
      required: [true, "please enter a password"],
    },
    phoneNumber: {
      type: String,
      required: [true, "please enter a phone number"],
    },
    adminStatus: {
      type: Boolean,
      default: false,
      enum: [false, true],
    },
    verificationStatus: {
      type: String,
      default: "pending",
    },
    verificationToken: {
      type: String,
    },
    address: String,
    country: String,
    postalCode: Number,
    city: String,
    shippingMethod: {
      type: String,
      default: "standard",
      enum: ["standard", "express", "free shipping"],
    },
    orders: [
      {
        products: [
          {
            productId: { type: Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number },
          },
        ],
        username: String,
        fullName: String,
        phoneNumber: String,
        shippingMethod: String,
        paymentMethod: { type: String, enum: ["cash", "online", "vietqr"], default: "cash" },
        email: String,
        address: String,
        district: String,
        ward: String,
        country: String,
        postalCode: Number,
        city: String,
        totalAmount: Number,
        deliveryStatus: { type: String, enum: ["pending", "delivered", "cancelled"] },
        paymentStatus: { type: String, enum: ["pending", "paid", "cancelled"] },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  this.email = this.email.toLowerCase();
  next();
});

module.exports = mongoose.model("User", userSchema);
