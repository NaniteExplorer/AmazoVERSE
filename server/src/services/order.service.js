import orderRepository from "../repositories/order.repository.js";
import productRepository from "../repositories/product.repository.js";
import ErrorHandler from "../utils/errorHandler.js";

/**
 * OrderService — order creation, retrieval and admin status management,
 * including stock adjustment when an order ships.
 */
class OrderService {
  constructor(orders = orderRepository, products = productRepository) {
    this.orders = orders;
    this.products = products;
  }

  createOrder(data, userId) {
    return this.orders.create({
      ...data,
      paidAt: Date.now(),
      user: userId,
    });
  }

  async getById(id) {
    const order = await this.orders.findByIdWithUser(id);
    if (!order) throw new ErrorHandler("Order not found with this id", 404);
    return order;
  }

  getMyOrders(userId) {
    return this.orders.findByUser(userId);
  }

  async getAllOrders() {
    const orders = await this.orders.find();
    const totalAmount = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    return { orders, totalAmount };
  }

  async #reduceStock(productId, quantity) {
    const product = await this.products.findById(productId);
    if (!product)
      throw new ErrorHandler(`Product not found with id: ${productId}`, 404);
    product.Stock -= quantity;
    await product.save({ validateBeforeSave: false });
  }

  async updateStatus(id, status) {
    const order = await this.orders.findById(id);
    if (!order) throw new ErrorHandler("Order not found with this Id", 404);
    if (order.orderStatus === "Delivered") {
      throw new ErrorHandler("You have already delivered this order", 400);
    }

    if (status === "Shipped") {
      for (const item of order.orderItems) {
        await this.#reduceStock(item.product, item.quantity);
      }
    }

    order.orderStatus = status;
    if (status === "Delivered") order.deliveredAt = Date.now();

    await order.save({ validateBeforeSave: false });
  }

  async deleteOrder(id) {
    const order = await this.orders.findById(id);
    if (!order) throw new ErrorHandler("Order not found with this Id", 404);
    await order.deleteOne();
  }
}

export default new OrderService();
