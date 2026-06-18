import Stripe from "stripe";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import config from "../config/index.js";

const stripe = new Stripe(config.stripe.secretKey);

export const processPayment = catchAsyncErrors(async (req, res) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metadata: { company: config.brand.name },
  });

  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

export const sendStripeApiKey = catchAsyncErrors(async (req, res) => {
  res.status(200).json({ stripeApiKey: config.stripe.apiKey });
});
