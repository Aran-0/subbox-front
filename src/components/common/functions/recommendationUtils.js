// Recommendation helper functions for Subbox.
// This file reads lightweight activity data from localStorage and returns product suggestions.

const SEARCH_HISTORY_KEY = "subboxSearchHistory";
const VIEWED_PRODUCTS_KEY = "subboxViewedProductIds";
const VIEWED_CATEGORIES_KEY = "subboxViewedCategories";
const USER_PREFERENCES_KEY = "subboxUserPreferences";
const MAX_RECOMMENDATIONS = 8;
const MAX_HISTORY = 20;

const loadJson = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (error) {
    return [];
  }
};

const tokenize = (text) => {
  return (text || "")
    .toLowerCase()
    .split(/[^a-zA-Z0-9а-яА-Я]+/)
    .filter(Boolean);
};

const saveJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Could not save recommendation data", error);
  }
};

export const saveSearchHistory = (query) => {
  const cleaned = (query || "").trim();
  if (!cleaned) return;

  const existing = loadJson(SEARCH_HISTORY_KEY);
  const next = [cleaned, ...existing.filter((item) => item !== cleaned)].slice(0, MAX_HISTORY);
  saveJson(SEARCH_HISTORY_KEY, next);
};

export const saveViewedProduct = (product) => {
  if (!product || !product.id) return;

  const viewedIds = loadJson(VIEWED_PRODUCTS_KEY);
  const nextIds = [product.id, ...viewedIds.filter((id) => id !== product.id)].slice(0, MAX_HISTORY);
  saveJson(VIEWED_PRODUCTS_KEY, nextIds);

  if (product.type) {
    saveViewedCategory(product.type);
  }
};

export const saveViewedCategory = (category) => {
  const cleanedCategory = (category || "").trim();
  if (!cleanedCategory) return;

  const viewedCategories = loadJson(VIEWED_CATEGORIES_KEY);
  const nextCategories = [cleanedCategory, ...viewedCategories.filter((item) => item !== cleanedCategory)].slice(0, MAX_HISTORY);
  saveJson(VIEWED_CATEGORIES_KEY, nextCategories);
};

export const getUserPreferences = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_PREFERENCES_KEY)) || {};
  } catch (error) {
    return {};
  }
};

const getMostFrequentCategories = ({ products, cartItems = [], subscriptionItems = [] }) => {
  const searchHistory = loadJson(SEARCH_HISTORY_KEY);
  const viewedProductIds = loadJson(VIEWED_PRODUCTS_KEY);
  const viewedCategories = loadJson(VIEWED_CATEGORIES_KEY);
  const preferences = getUserPreferences();
  const preferredCategories = [];

  if (Array.isArray(preferences.categories)) {
    preferredCategories.push(...preferences.categories);
  }
  if (Array.isArray(preferences.preferredCategories)) {
    preferredCategories.push(...preferences.preferredCategories);
  }
  if (typeof preferences.category === "string") {
    preferredCategories.push(preferences.category);
  }

  const frequency = {};
  const track = (category) => {
    if (!category) return;
    frequency[category] = (frequency[category] || 0) + 1;
  };

  const inferCategoriesFromText = (text) => {
    const tokens = tokenize(text);
    return products
      .filter((item) =>
        tokens.some(
          (token) =>
            item.type?.toLowerCase().includes(token) ||
            item.title?.toLowerCase().includes(token) ||
            item.details?.toLowerCase().includes(token)
        )
      )
      .map((item) => item.type)
      .filter(Boolean);
  };

  searchHistory.forEach((query) => {
    inferCategoriesFromText(query).forEach(track);
  });

  viewedCategories.forEach(track);
  preferredCategories.forEach(track);
  cartItems.forEach((item) => track(item.type));
  subscriptionItems.forEach((item) => track(item.type));
  products
    .filter((item) => viewedProductIds.includes(item.id))
    .forEach((item) => track(item.type));

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category);
};

const shuffleArray = (array) => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const getNextBasketRecommendations = ({ products, cartItems = [], subscriptionItems = [] }) => {
  const basketIds = [
    ...cartItems.map((item) => item.id),
    ...subscriptionItems.map((item) => item.id),
  ];
  const preferredCategories = getMostFrequentCategories({ products, cartItems, subscriptionItems });
  const recommended = [];

  const addProduct = (product) => {
    if (!product) return;
    if (basketIds.includes(product.id)) return;
    if (recommended.find((item) => item.id === product.id)) return;
    recommended.push(product);
  };

  preferredCategories.forEach((category) => {
    products
      .filter((item) => item.type === category)
      .forEach(addProduct);
  });

  if (recommended.length < 4) {
    const fallbackCandidates = products.filter(
      (item) => !basketIds.includes(item.id) && !recommended.some((existing) => existing.id === item.id)
    );
    const fallback = shuffleArray(fallbackCandidates).slice(0, MAX_RECOMMENDATIONS - recommended.length);
    fallback.forEach(addProduct);
  }

  return recommended.slice(0, MAX_RECOMMENDATIONS);
};
