import colors from "colors";
import config from "./src/config/index.js";
import app from "./src/app.js";
import connectDatabase from "./src/config/database.js";
import configureCloudinary from "./src/config/cloudinary.js";

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Uncaught Exception");
  process.exit(1);
});

// Connect infrastructure (the connection is cached, so this is safe to run on
// every serverless cold start as well as once for a long-running process).
connectDatabase();
configureCloudinary();

// Only bind a port when running as a normal long-lived process (local/dev or a
// host like Render). On Vercel the platform invokes the exported app directly,
// so we must NOT call listen().
if (!process.env.VERCEL) {
  const server = app.listen(config.port, () => {
    console.log(
      colors.bgMagenta.white(
        `${config.brand.name} server is working on http://localhost:${config.port}`
      )
    );
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to unhandled Promise Rejection");
    server.close(() => process.exit(1));
  });
}

// Export the Express app so Vercel's @vercel/node runtime can use it as the
// serverless function handler.
export default app;
