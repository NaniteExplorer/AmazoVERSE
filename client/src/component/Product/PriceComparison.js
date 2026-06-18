import React from "react";
import "./PriceComparison.css";

// Deterministic % deltas per seller so the demo prices are stable across
// renders (no Math.random flicker) while still looking like a real comparison.
const DEMO_SELLERS = [
  { seller: "Amazon", delta: 0.06 },
  { seller: "Flipkart", delta: -0.04 },
  { seller: "Meesho", delta: 0.11 },
];

/**
 * Builds illustrative offers from the base price when a product has none
 * stored. This keeps the comparison panel populated WITHOUT writing anything
 * to the database (existing, manually-fed product data is never modified).
 */
const buildDemoOffers = (basePrice) =>
  DEMO_SELLERS.map(({ seller, delta }) => ({
    seller,
    price: Math.max(1, Math.round(basePrice * (1 + delta))),
    url: "",
    inStock: true,
  }));

/**
 * PriceComparison — "buyhatke"-style panel listing the same product's price
 * across sellers (Amazon, Flipkart, ...).
 *
 * Data source priority:
 *   1. `product.offers` if present (real, stored offers).
 *   2. Otherwise, client-side illustrative offers derived from the base price.
 *
 * No live scraping or persistence happens here.
 */
const PriceComparison = ({ basePrice, offers = [], allowDemo = true }) => {
  if (!basePrice && basePrice !== 0) return null;

  const hasRealOffers = offers && offers.length > 0;
  const isDemo = !hasRealOffers;
  const effectiveOffers = hasRealOffers
    ? offers
    : allowDemo
    ? buildDemoOffers(basePrice)
    : [];

  if (effectiveOffers.length === 0) return null;

  // Combine the in-store price with the offers, then sort cheapest first.
  const rows = [
    { seller: "Amaezoverse", price: basePrice, url: "", inStock: true },
    ...effectiveOffers,
  ].sort((a, b) => a.price - b.price);

  const lowest = rows[0].price;

  return (
    <div className="priceComparison">
      <h3 className="priceComparison__title">
        Compare Prices
        {isDemo && (
          <span className="priceComparison__demoNote">
            {" "}
            (illustrative)
          </span>
        )}
      </h3>
      <ul className="priceComparison__list">
        {rows.map((offer, index) => {
          const isLowest = offer.price === lowest;
          return (
            <li
              key={`${offer.seller}-${index}`}
              className={`priceComparison__row ${
                isLowest ? "priceComparison__row--best" : ""
              }`}
            >
              <span className="priceComparison__seller">
                {offer.logo ? (
                  <img src={offer.logo} alt={offer.seller} />
                ) : null}
                {offer.seller}
                {isLowest && (
                  <span className="priceComparison__badge">Lowest</span>
                )}
              </span>

              <span className="priceComparison__price">
                ₹{offer.price}
                {!offer.inStock && (
                  <em className="priceComparison__oos">Out of stock</em>
                )}
              </span>

              {offer.url ? (
                <a
                  className="priceComparison__cta"
                  href={offer.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  View Deal
                </a>
              ) : (
                <span className="priceComparison__cta priceComparison__cta--here">
                  Buy Here
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PriceComparison;
