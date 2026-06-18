import BaseRepository from "./base.repository.js";
import User from "../models/user.model.js";

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  /** Login needs the password field which is `select: false` by default. */
  findByEmailWithPassword(email) {
    return this.model.findOne({ email }).select("+password");
  }

  findByIdWithPassword(id) {
    return this.model.findById(id).select("+password");
  }
}

export default new UserRepository();
