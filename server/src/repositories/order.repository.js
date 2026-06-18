import BaseRepository from "./base.repository.js";
import Order from "../models/order.model.js";

class OrderRepository extends BaseRepository {
  constructor() {
    super(Order);
  }

  findByUser(userId) {
    return this.model.find({ user: userId });
  }

  findByIdWithUser(id) {
    return this.model.findById(id).populate("user", "name email");
  }
}

export default new OrderRepository();
