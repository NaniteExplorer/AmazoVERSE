import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import productService from "../services/product.service.js";

// Create Product -- Admin
export const createProduct = catchAsyncErrors(async (req, res) => {
  const product = await productService.createProduct(req.body, req.user.id);
  res.status(201).json({ success: true, product });
});

// Get All Products
export const getAllProducts = catchAsyncErrors(async (req, res) => {
  const result = await productService.getAllProducts(req.query);
  res.status(200).json({ success: true, ...result });
});

// Get All Products -- Admin
export const getAdminProducts = catchAsyncErrors(async (req, res) => {
  const products = await productService.getAdminProducts();
  res.status(200).json({ success: true, products });
});

// Get Product details
export const getProductDetails = catchAsyncErrors(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  res.status(200).json({ success: true, product });
});

// Update Product -- Admin
export const updateProduct = catchAsyncErrors(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  res.status(200).json({ success: true, product });
});

// Delete Product -- Admin
export const deleteProduct = catchAsyncErrors(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res
    .status(200)
    .json({ success: true, message: "Product Deleted Successfully" });
});

// Create / Update review
export const createProductReview = catchAsyncErrors(async (req, res) => {
  await productService.upsertReview(req.user._id, req.user.name, req.body);
  res.status(200).json({ success: true });
});

// Get all reviews of a product
export const getProductReviews = catchAsyncErrors(async (req, res) => {
  const reviews = await productService.getReviews(req.query.id);
  res.status(200).json({ success: true, reviews });
});

// Delete review
export const deleteReview = catchAsyncErrors(async (req, res) => {
  await productService.deleteReview(req.query.productId, req.query.id);
  res.status(200).json({ success: true });
});
