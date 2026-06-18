import cloudinary from "cloudinary";
import productRepository from "../repositories/product.repository.js";
import ApiFeatures from "../utils/apiFeatures.js";
import ErrorHandler from "../utils/errorHandler.js";

const RESULTS_PER_PAGE = 25;

/**
 * ProductService — all product business logic. Controllers stay thin and only
 * translate HTTP <-> service calls; persistence lives in the repository.
 */
class ProductService {
  constructor(repository = productRepository) {
    this.repository = repository;
  }

  async #uploadImages(rawImages) {
    const images =
      typeof rawImages === "string" ? [rawImages] : rawImages || [];
    const uploaded = [];
    for (const image of images) {
      const result = await cloudinary.v2.uploader.upload(image, {
        folder: "products",
      });
      uploaded.push({ public_id: result.public_id, url: result.secure_url });
    }
    return uploaded;
  }

  async createProduct(data, userId) {
    const payload = { ...data, user: userId };
    payload.images = await this.#uploadImages(data.images);
    return this.repository.create(payload);
  }

  async getAllProducts(queryParams) {
    const productsCount = await this.repository.countDocuments();

    const feature = new ApiFeatures(this.repository.query(), queryParams)
      .search()
      .filter();
    feature.pagination(RESULTS_PER_PAGE);

    const products = await feature.query;

    return {
      products,
      productsCount,
      resultPerPage: RESULTS_PER_PAGE,
      filteredProductsCount: products.length,
    };
  }

  getAdminProducts() {
    return this.repository.find();
  }

  async getProductById(id) {
    const product = await this.repository.findById(id);
    if (!product) throw new ErrorHandler("Product not found", 404);
    return product;
  }

  async updateProduct(id, data) {
    const product = await this.getProductById(id);

    if (data.images !== undefined) {
      for (const image of product.images) {
        await cloudinary.v2.uploader.destroy(image.public_id);
      }
      data.images = await this.#uploadImages(data.images);
    }

    return this.repository.updateById(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async deleteProduct(id) {
    const product = await this.getProductById(id);
    for (const image of product.images) {
      await cloudinary.v2.uploader.destroy(image.public_id);
    }
    await product.deleteOne();
  }

  async upsertReview(userId, userName, { rating, comment, productId }) {
    const product = await this.getProductById(productId);

    const review = {
      user: userId,
      name: userName,
      rating: Number(rating),
      comment,
    };

    const existing = product.reviews.find(
      (rev) => rev.user.toString() === userId.toString()
    );

    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    product.ratings =
      product.reviews.reduce((sum, rev) => sum + rev.rating, 0) /
      product.reviews.length;

    await product.save({ validateBeforeSave: false });
  }

  async getReviews(productId) {
    const product = await this.getProductById(productId);
    return product.reviews;
  }

  async deleteReview(productId, reviewId) {
    const product = await this.getProductById(productId);

    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== reviewId.toString()
    );

    const numOfReviews = reviews.length;
    const ratings =
      numOfReviews === 0
        ? 0
        : reviews.reduce((sum, rev) => sum + rev.rating, 0) / numOfReviews;

    await this.repository.updateById(
      productId,
      { reviews, ratings, numOfReviews },
      { new: true, runValidators: true }
    );
  }
}

export default new ProductService();
