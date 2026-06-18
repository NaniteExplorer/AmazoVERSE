import crypto from "crypto";
import cloudinary from "cloudinary";
import userRepository from "../repositories/user.repository.js";
import sendEmail from "../utils/sendEmail.js";
import ErrorHandler from "../utils/errorHandler.js";
import config from "../config/index.js";

/**
 * UserService — authentication, profile and admin user-management logic.
 */
class UserService {
  constructor(repository = userRepository) {
    this.repository = repository;
  }

  async register({ name, email, password, avatar }) {
    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    return this.repository.create({
      name,
      email,
      password,
      avatar: { public_id: myCloud.public_id, url: myCloud.secure_url },
    });
  }

  async login(email, password) {
    if (!email || !password) {
      throw new ErrorHandler("Please Enter Email & Password", 400);
    }

    const user = await this.repository.findByEmailWithPassword(email);
    if (!user) throw new ErrorHandler("Invalid email or password", 401);

    const isMatched = await user.comparePassword(password);
    if (!isMatched) throw new ErrorHandler("Invalid email or password", 401);

    return user;
  }

  async requestPasswordReset(email, baseUrl) {
    const user = await this.repository.findOne({ email });
    if (!user) throw new ErrorHandler("User not found", 404);

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${baseUrl}/password/reset/${resetToken}`;
    const message = `Your password reset token is :- \n\n ${resetUrl} \n\nIf you have not requested this email then, please ignore it`;

    try {
      await sendEmail({
        email: user.email,
        subject: `${config.brand.name} Password Recovery`,
        message,
      });
      return user.email;
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      throw new ErrorHandler(error.message, 500);
    }
  }

  async resetPassword(token, password, confirmPassword) {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await this.repository.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      );
    }
    if (password !== confirmPassword) {
      throw new ErrorHandler("Password does not match", 400);
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return user;
  }

  getById(id) {
    return this.repository.findById(id);
  }

  async updatePassword(userId, { oldPassword, newPassword, confirmPassword }) {
    const user = await this.repository.findByIdWithPassword(userId);

    const isMatched = await user.comparePassword(oldPassword);
    if (!isMatched) throw new ErrorHandler("Old password is incorrect", 400);
    if (newPassword !== confirmPassword) {
      throw new ErrorHandler("password does not match", 400);
    }

    user.password = newPassword;
    await user.save();
    return user;
  }

  async updateProfile(userId, { name, email, avatar }) {
    const newUserData = { name, email };

    if (avatar && avatar !== "") {
      const user = await this.repository.findById(userId);
      if (!user) throw new ErrorHandler("User not found", 404);

      if (user.avatar.public_id) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      }

      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });
      newUserData.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    return this.repository.updateById(userId, newUserData, {
      new: true,
      runValidators: true,
    });
  }

  getAllUsers() {
    return this.repository.find();
  }

  async getUserById(id) {
    const user = await this.repository.findById(id);
    if (!user) throw new ErrorHandler(`User does not exist with Id: ${id}`, 404);
    return user;
  }

  updateRole(id, { name, email, role }) {
    return this.repository.updateById(
      id,
      { name, email, role },
      { new: true, runValidators: true }
    );
  }

  async deleteUser(id) {
    const user = await this.getUserById(id);
    if (user.avatar?.public_id) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    }
    await user.deleteOne();
  }
}

export default new UserService();
