import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

import config from "./config/index.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import productRoutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// --- Core middleware ---------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

// --- API routes --------------------------------------------------------------
app.use("/api/v1", productRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes);

// Lightweight health check
app.get("/api/health", (req, res) => {
  res
    .status(200)
    .json({ success: true, service: config.brand.name, status: "ok" });
});

// --- Static client (production build) ---------------------------------------
// On Vercel the built SPA is served by the static build step, and this function
// only handles /api/* — so we only serve static files when running as a normal
// long-lived process (local production, Render, etc.).
if (!process.env.VERCEL) {
  const clientBuildPath = path.join(__dirname, "../../client/build");
  app.use(express.static(clientBuildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(clientBuildPath, "index.html"));
  });
}

// --- Error handler (must be last) -------------------------------------------
app.use(errorMiddleware);

export default app;
