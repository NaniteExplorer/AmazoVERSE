/**
 * OPT-IN price-comparison seeder (EXAMPLE — not run automatically).
 *
 * The app shows illustrative comparison prices client-side without touching the
 * database. If you later want REAL, persisted offers on your products, adapt and
 * run this script deliberately:
 *
 *     node server/scripts/seedOffers.example.js
 *
 * IMPORTANT: this WRITES to the database (adds an `offers` array to products that
 * don't have one). It never deletes or overwrites your existing product fields.
 * Review carefully and back up first. It is intentionally kept as `.example.js`
 * so it is not picked up by accident.
 */
import mongoose from "mongoose";
import config from "../src/config/index.js";
import Product from "../src/models/product.model.js";

// Map your own real seller data here instead of these placeholders.
const buildOffers = (product) => [
  { seller: "Amazon", price: Math.round(product.price * 1.06), url: "", inStock: true },
  { seller: "Flipkart", price: Math.round(product.price * 0.96), url: "", inStock: true },
];

async function run() {
  await mongoose.connect(config.db.uri);
  console.log("Connected. Seeding offers for products without any…");

  const products = await Product.find({
    $or: [{ offers: { $exists: false } }, { offers: { $size: 0 } }],
  });

  let updated = 0;
  for (const product of products) {
    product.offers = buildOffers(product);
    await product.save({ validateBeforeSave: false });
    updated += 1;
  }

  console.log(`Done. Updated ${updated} product(s).`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
