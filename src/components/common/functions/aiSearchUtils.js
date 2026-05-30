// aiSearchUtils.js
// Simple keyword-based product search helper for the Subbox AI assistant.

const DEFAULT_RESULTS = 6;

// Normalize text and split into simple search tokens.
const tokenize = (text) => {
  return (text || "")
    .toLowerCase()
    .split(/[^a-zA-Z0-9а-яА-Я]+/)
    .filter(Boolean);
};

const scoreProduct = (product, tokens) => {
  let score = 0;

  const title = (product.title || "").toLowerCase();
  const category = (product.type || "").toLowerCase();
  const details = (product.details || "").toLowerCase();
  const tags = Array.isArray(product.tags)
    ? product.tags.map((tag) => tag.toLowerCase())
    : [];

  tokens.forEach((token) => {
    // Exact token in title gives the strongest signal.
    if (title.includes(token)) score += 3;

    // Category/type matching is also important.
    if (category.includes(token)) score += 2;

    // Description can still be relevant.
    if (details.includes(token)) score += 1;

    // Optional tags may be available in product data.
    if (tags.some((tag) => tag.includes(token))) score += 2;

    // Simple price preference handling for words like "cheap" or "budget".
    if (token === "cheap" || token === "budget" || token === "affordable") {
      score += Math.max(0, 3 - Math.floor((product.price || 0) / 200));
    }
  });

  return score;
};

export const searchProducts = ({ products, query }) => {
  const searchTokens = tokenize(query);

  // If query is empty, return a small set of fallback items.
  if (searchTokens.length === 0) {
    return products.slice(0, DEFAULT_RESULTS);
  }

  const scored = products
    .map((product) => ({
      product,
      score: scoreProduct(product, searchTokens),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.product);

  // If no matching products are found, return fallback suggestions.
  if (scored.length === 0) {
    const fallback = products.slice(0, DEFAULT_RESULTS);
    return fallback;
  }

  return scored.slice(0, DEFAULT_RESULTS);
};
