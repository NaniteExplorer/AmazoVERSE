import React from "react";
import Helmet from "react-helmet";

const BRAND = "Amaezoverse";
const DEFAULT_DESCRIPTION =
  "Amaezoverse — shop millions of products and instantly compare prices across Amazon, Flipkart and more, all in one place.";

/**
 * Centralised SEO component.
 * Renders a brand-suffixed <title>, meta description, canonical URL and
 * Open Graph / Twitter card tags so every page is share- and search-friendly.
 *
 * @param {string}  title       - page-specific title (brand is appended automatically)
 * @param {string}  description - meta description (falls back to brand default)
 * @param {string}  image       - absolute image URL for social cards (optional)
 * @param {boolean} appendBrand - set false to use `title` verbatim (e.g. home page)
 */
const MetaData = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image,
  appendBrand = true,
}) => {
  const fullTitle =
    appendBrand && title ? `${title} | ${BRAND}` : title || BRAND;
  const canonical =
    typeof window !== "undefined" ? window.location.href : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:site_name" content={BRAND} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {canonical && <meta property="og:url" content={canonical} />}
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta
        name="twitter:card"
        content={image ? "summary_large_image" : "summary"}
      />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};

export default MetaData;
