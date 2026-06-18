import cloudinary from "cloudinary";
import config from "./index.js";

/**
 * Configures the Cloudinary SDK once at startup.
 * Returns the configured v2 instance for convenience.
 */
const configureCloudinary = () => {
  cloudinary.v2.config({
    cloud_name: config.cloudinary.name,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
  return cloudinary.v2;
};

export default configureCloudinary;
