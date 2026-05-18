const Product = require("../models/products");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const CustomErrorHandler = require("../errors/customErrorHandler");
const { title } = require("process");

const createProducts = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

const getAllProducts = async (req, res) => {
  let products = await Product.find({});

  res.status(200).json({ message: "success", products });
};

const uploadProductImages = async (req, res) => {
  if (!req.files.image.mimetype.includes("image")) {
    throw CustomErrorHandler(415, "invalid image type");
  }
  if (!req.files) {
    throw CustomErrorHandler(400, "No image waas uploaded");
  }
  if (req.files.image.size > 3 * 1024 * 1024) {
    throw CustomErrorHandler(400, "Image size has exceeded the limit");
  }
  const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
    use_filename: true,
    folder: "file-Auffur",
  });
  fs.unlinkSync(req.files.image.tempFilePath);

  return res.status(201).json({ image: { src: result.secure_url } });
};

const getAspecificProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new CustomErrorHandler(401, "parameters missing");
  }
  const checkIfProductExist = await Product.findById({ _id: id }).select({
    _id: 1,
    title: 1,
    stock: 1,
    price: 1,
    discountPercentValue: 1,
    categories: 1,
    image: 1,
    description: 1,
  });
  if (!checkIfProductExist) {
    throw new CustomErrorHandler(404, "Products not found");
  }
  res.status(200).json({ message: "success", product: checkIfProductExist });
};

const deleteAspecificProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new CustomErrorHandler(401, "parameters missing");
  }

  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new CustomErrorHandler(404, "Products not found");
  }
  res.status(201).json({ message: "success", product });
};

const updateAspecificProduct = async (req, res) => {
  const updatedData = req.body;
  const { id } = req.params;
  if (!id || !updatedData) {
    throw new CustomErrorHandler(401, "parameters missing");
  }
  const Updatedproduct = await Product.findByIdAndUpdate(id, updatedData, { runValidators: true });

  res.status(201).json({ message: "product successfully updated", product: Updatedproduct });
};

const searchProducts = async (req, res) => {
  const { title, pageNo, perPage } = req.query;
  if (!title || !pageNo || !perPage) {
    throw new CustomErrorHandler(400, "parameters missing");
  }

  const pageNumber = parseInt(pageNo);
  const itemsPerPage = parseInt(perPage);

  const searchLength = await Product.countDocuments({ title: { $regex: title, $options: "i" } });
  const searchedProducts = await Product.find({ title: { $regex: title, $options: "i" } })
    .skip((pageNumber - 1) * itemsPerPage)
    .limit(itemsPerPage);

  res.status(201).json({ product: searchedProducts, productsLength: searchLength });
};

const sortByLowStockProducts = async (req, res) => {
  const { pageNo, perPage } = req.query;
  if (!pageNo || !perPage) {
    throw new CustomErrorHandler(400, "parameters missing");
  }
  const pageNumber = parseInt(pageNo);
  const itemsPerPage = parseInt(perPage);
  const productsLength = await Product.countDocuments();

  const sortedProducts = await Product.find({})
    .sort({ stock: 1, _id: 1 })
    .skip((pageNumber - 1) * itemsPerPage)
    .limit(itemsPerPage);

  res.status(201).json({ products: sortedProducts, productsLength });
};

const addRatingAndComment = async (req, res) => {
  const { id } = req.params;
  const { username, email, rating, comment } = req.body;

  if (!id || !username || !email || !rating) {
    throw new CustomErrorHandler(400, "parameters missing");
  }

  if (rating < 1 || rating > 5) {
    throw new CustomErrorHandler(400, "Rating must be between 1 and 5");
  }

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      {
        $push: {
          ratings: {
            username,
            email,
            rating,
            comment: comment || "",
          },
        },
      },
      { new: true }
    );

    if (!product) {
      throw new CustomErrorHandler(404, "Product not found");
    }

    res.status(201).json({ message: "Rating added successfully", product });
  } catch (error) {
    throw new CustomErrorHandler(500, error.message);
  }
};

const getProductRatings = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new CustomErrorHandler(400, "parameters missing");
  }

  try {
    const product = await Product.findById(id).select("ratings title");

    if (!product) {
      throw new CustomErrorHandler(404, "Product not found");
    }

    const ratings = product.ratings || [];
    const avgRating = ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1) : 0;

    res.status(200).json({
      message: "success",
      ratings,
      averageRating: avgRating,
      totalRatings: ratings.length,
      productTitle: product.title,
    });
  } catch (error) {
    throw new CustomErrorHandler(500, error.message);
  }
};

module.exports = {
  getAllProducts,
  createProducts,
  uploadProductImages,
  getAspecificProduct,
  deleteAspecificProduct,
  updateAspecificProduct,
  searchProducts,
  sortByLowStockProducts,
  addRatingAndComment,
  getProductRatings,
};
