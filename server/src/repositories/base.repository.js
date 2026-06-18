/**
 * BaseRepository
 *
 * Generic data-access layer wrapping a Mongoose model. Every domain repository
 * extends this class, so query logic lives in one place and services never talk
 * to Mongoose directly. This keeps the persistence concern swappable and testable.
 */
class BaseRepository {
  /**
   * @param {import("mongoose").Model} model - the Mongoose model to wrap
   */
  constructor(model) {
    this.model = model;
  }

  create(data) {
    return this.model.create(data);
  }

  findById(id, projection = null, options = {}) {
    return this.model.findById(id, projection, options);
  }

  findOne(filter, projection = null) {
    return this.model.findOne(filter, projection);
  }

  find(filter = {}) {
    return this.model.find(filter);
  }

  /** Returns the raw query so callers (e.g. ApiFeatures) can keep chaining. */
  query(filter = {}) {
    return this.model.find(filter);
  }

  countDocuments(filter = {}) {
    return this.model.countDocuments(filter);
  }

  updateById(id, update, options = { new: true, runValidators: true }) {
    return this.model.findByIdAndUpdate(id, update, options);
  }

  deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }
}

export default BaseRepository;
