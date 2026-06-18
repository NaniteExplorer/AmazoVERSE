import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import userService from "../services/user.service.js";
import sendToken from "../utils/sendToken.js";

// Register a user
export const registerUser = catchAsyncErrors(async (req, res) => {
  const user = await userService.register(req.body);
  sendToken(user, 201, res);
});

// Login user
export const loginUser = catchAsyncErrors(async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.login(email, password);
  sendToken(user, 200, res);
});

// Logout user
export const logout = catchAsyncErrors(async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });
  res.status(200).json({ success: true, message: "Logged Out" });
});

// Forgot password
export const forgotPassword = catchAsyncErrors(async (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const email = await userService.requestPasswordReset(req.body.email, baseUrl);
  res
    .status(200)
    .json({ success: true, message: `Email sent to ${email} successfully` });
});

// Reset password
export const resetPassword = catchAsyncErrors(async (req, res) => {
  const user = await userService.resetPassword(
    req.params.token,
    req.body.password,
    req.body.confirmPassword
  );
  sendToken(user, 200, res);
});

// Get logged-in user details
export const getUserDetails = catchAsyncErrors(async (req, res) => {
  const user = await userService.getById(req.user.id);
  res.status(200).json({ success: true, user });
});

// Update password
export const updatePassword = catchAsyncErrors(async (req, res) => {
  const user = await userService.updatePassword(req.user.id, req.body);
  sendToken(user, 200, res);
});

// Update profile
export const updateProfile = catchAsyncErrors(async (req, res) => {
  await userService.updateProfile(req.user.id, req.body);
  res.status(200).json({ success: true });
});

// Get all users -- Admin
export const getAllUser = catchAsyncErrors(async (req, res) => {
  const users = await userService.getAllUsers();
  res.status(200).json({ success: true, users });
});

// Get single user -- Admin
export const getSingleUser = catchAsyncErrors(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json({ success: true, user });
});

// Update user role -- Admin
export const updateUserRole = catchAsyncErrors(async (req, res) => {
  await userService.updateRole(req.params.id, req.body);
  res.status(200).json({ success: true });
});

// Delete user -- Admin
export const deleteUser = catchAsyncErrors(async (req, res) => {
  await userService.deleteUser(req.params.id);
  res.status(200).json({ success: true, message: "User deleted successfully" });
});
