// subscriptionUtils.js
// Simple localStorage helper for subscription data in the Universal Subscription Platform.

const SUBSCRIPTIONS_KEY = "subboxSubscriptions";
const UPDATE_KEY = "subboxSubscriptionsUpdated";

const loadJson = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (error) {
    return [];
  }
};

const saveJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Could not save subscription data", error);
  }
};

const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + (item.price || 0), 0);
};

export const getSubscriptions = () => {
  return loadJson(SUBSCRIPTIONS_KEY);
};

export const saveSubscriptions = (subscriptions) => {
  saveJson(SUBSCRIPTIONS_KEY, subscriptions);
  localStorage.setItem(UPDATE_KEY, Date.now().toString());
};

export const getActiveSubscription = () => {
  const subscriptions = getSubscriptions();
  return (
    subscriptions.find((sub) => sub.status === "active") ||
    subscriptions[subscriptions.length - 1] ||
    null
  );
};

export const getSubscriptionById = (id) => {
  const subscriptions = getSubscriptions();
  return subscriptions.find((sub) => sub.id === id) || null;
};

export const createSubscription = ({ name, frequency, items = [], status = "active" }) => {
  const subscriptions = getSubscriptions();
  const newSubscription = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    subscriptionName: name || "My Subscription",
    frequency: frequency || "monthly",
    selectedItems: items,
    totalPrice: calculateTotal(items),
    status,
    createdDate: new Date().toISOString(),
  };
  saveSubscriptions([...subscriptions, newSubscription]);
  return newSubscription;
};

export const updateSubscription = (subscription) => {
  const subscriptions = getSubscriptions();
  const updated = subscriptions.map((sub) =>
    sub.id === subscription.id ? { ...subscription, totalPrice: calculateTotal(subscription.selectedItems) } : sub
  );
  saveSubscriptions(updated);
  return getSubscriptionById(subscription.id);
};

export const deleteSubscription = (id) => {
  const subscriptions = getSubscriptions();
  saveSubscriptions(subscriptions.filter((sub) => sub.id !== id));
};

export const toggleSubscriptionStatus = (id) => {
  const subscription = getSubscriptionById(id);
  if (!subscription) return null;
  subscription.status = subscription.status === "active" ? "inactive" : "active";
  return updateSubscription(subscription);
};

export const addItemToSubscription = (product, subscriptionId) => {
  const current = getSubscriptionById(subscriptionId) || getActiveSubscription();
  if (!current) {
    return createSubscription({ name: "My Subscription", frequency: "monthly", items: [product] });
  }

  const exists = current.selectedItems.some((item) => item.id === product.id);
  if (exists) return current;

  const updated = {
    ...current,
    selectedItems: [...current.selectedItems, product],
  };
  return updateSubscription(updated);
};

export const removeItemFromSubscription = (productId, subscriptionId) => {
  const current = getSubscriptionById(subscriptionId) || getActiveSubscription();
  if (!current) return null;

  const updated = {
    ...current,
    selectedItems: current.selectedItems.filter((item) => item.id !== productId),
  };
  return updateSubscription(updated);
};

export const getSubscriptionItems = (subscription) => {
  if (!subscription || !Array.isArray(subscription.selectedItems)) {
    return [];
  }
  return subscription.selectedItems;
};

export const isProductInSubscription = (productId, subscription) => {
  if (!subscription) return false;
  return subscription.selectedItems.some((item) => item.id === productId);
};

export const getSubscriptionUpdateToken = () => {
  return localStorage.getItem(UPDATE_KEY) || "";
};
