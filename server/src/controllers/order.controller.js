import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import orderService from "../services/order.service.js";

// Create new order
export const newOrder = catchAsyncErrors(async (req, res) => {
  const order = await orderService.createOrder(req.body, req.user._id);
  res.status(201).json({ success: true, order });
});

// Get single order
export const getSingleOrder = catchAsyncErrors(async (req, res) => {
  const order = await orderService.getById(req.params.id);
  res.status(200).json({ success: true, order });
});

// Get logged-in user's orders
export const myOrders = catchAsyncErrors(async (req, res) => {
  const order = await orderService.getMyOrders(req.user._id);
  res.status(200).json({ success: true, order });
});

// Get all orders -- Admin
export const getAllOrders = catchAsyncErrors(async (req, res) => {
  const { orders, totalAmount } = await orderService.getAllOrders();
  res.status(200).json({ success: true, totalAmount, orders });
});

// Update order status -- Admin
export const updateOrder = catchAsyncErrors(async (req, res) => {
  await orderService.updateStatus(req.params.id, req.body.status);
  res.status(200).json({ success: true });
});

// Delete order -- Admin
export const deleteOrder = catchAsyncErrors(async (req, res) => {
  await orderService.deleteOrder(req.params.id);
  res.status(200).json({ success: true });
});
