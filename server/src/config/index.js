import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from server/config/config.env when not in production.
// In production (e.g. Vercel) the variables are injected by the platform.
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: path.join(__dirname, "../../config/config.env") });
}

/**
 * Centralised, validated configuration object.
 * Every other module reads config from here instead of touching process.env directly.
 */
const config = {
  env: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "PRODUCTION",
  port: process.env.PORT || 4000,

  brand: {
    name: "Amaezoverse",
    legalName: "Amaezoverse",
  },

  db: {
    uri: process.env.DB_URI,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE,
    cookieExpire: Number(process.env.COOKIE_EXPIRE) || 5,
  },

  cloudinary: {
    name: process.env.CLOUDINARY_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  smtp: {
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    service: process.env.SMPT_SERVICE,
    mail: process.env.SMPT_MAIL,
    password: process.env.SMPT_PASSWORD,
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    apiKey: process.env.STRIPE_API_KEY,
  },
};

export default config;
