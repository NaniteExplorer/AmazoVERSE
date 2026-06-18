import BaseRepository from "./base.repository.js";
import Product from "../models/product.model.js";

class ProductRepository extends BaseRepository {
  constructor() {
    super(Product);
  }
}

// Export a singleton — repositories are stateless wrappers around a model.
export default new ProductRepository();
