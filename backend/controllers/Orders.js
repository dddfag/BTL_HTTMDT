const User = require("../models/userData");
const CustomErrorHandler = require("../errors/customErrorHandler");
const Product = require("../models/products");

const postUserOrders = async (req, res) => {
  const { orderDetails } = req.body;
  const { products, paymentMethod } = orderDetails;

  const email = req.body?.orderDetails?.email?.toLowerCase();

  let isOrderAboveLimit;
  for (let key of products) {
    const findProducts = await Product.findById(key.productId);
    if (key.quantity > findProducts.stock) {
      isOrderAboveLimit = true;
    }
  }

  let checkIfEmailExists = await User.findOne({ email });
  if (!checkIfEmailExists) {
    throw new CustomErrorHandler(403, "Email address associated with the account must be used ");
  } else if (isOrderAboveLimit) {
    throw new CustomErrorHandler(403, "One or more product quantities selected is more than the amount in stock");
  } else {
    // All prices are now stored in VND in the database
    const orderToSave = {
      ...orderDetails,
      createdAt: new Date(),
    };

    await User.findOneAndUpdate({ email }, { $push: { orders: orderToSave } }, { new: true });

    for (let key of products) {
      const findProducts = await Product.findById(key.productId);
      let newStock = findProducts.stock - key.quantity;
      // update new stock
      await findProducts.updateOne({ stock: newStock });
    }

    res.status(201).json({
      success: true,
      message: "order sucessful",
      data: {
        orderId: orderToSave._id,
        totalAmount: orderToSave.totalAmount,
        currency: "VND",
        paymentMethod: paymentMethod,
      },
    });
  }
};

module.exports = postUserOrders;
