import express from "express";
import {
  processPayment,
  sendStripeApiKey,
} from "../controllers/payment.controller.js";
import { isAuthenticatedUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/payment/process").post(isAuthenticatedUser, processPayment);
router.route("/stripeapikey").get(isAuthenticatedUser, sendStripeApiKey);

export default router;
