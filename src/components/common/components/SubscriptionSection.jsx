import { useState, useEffect } from "react";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import RecommendationSection from "./RecommendationSection";
import { ITEMS } from "../functions/items";
import {
  addItemToSubscription,
  createSubscription,
  getActiveSubscription,
  getSubscriptions,
  getSubscriptionItems,
  removeItemFromSubscription,
  toggleSubscriptionStatus,
  updateSubscription,
} from "../functions/subscriptionUtils";
import { getNextBasketRecommendations } from "../functions/recommendationUtils";

const SubscriptionSection = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState("monthly");
  const [recommended, setRecommended] = useState([]);

  const loadData = () => {
    const subs = getSubscriptions();
    const active = getActiveSubscription();
    setSubscriptions(subs);
    setActiveSubscription(active);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const subscriptionItems = getSubscriptionItems(activeSubscription);
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setRecommended(
      getNextBasketRecommendations({
        products: ITEMS,
        cartItems,
        subscriptionItems,
      })
    );
  }, [activeSubscription]);

  const handleCreateSubscription = () => {
    const newSubscription = createSubscription({
      name: name || "My Subscription",
      frequency,
      items: [],
      status: "active",
    });
    setName("");
    setFrequency("monthly");
    setActiveSubscription(newSubscription);
    loadData();
  };

  const handleAddProduct = (product) => {
    const updated = addItemToSubscription(product, activeSubscription?.id);
    setActiveSubscription(updated);
    loadData();
  };

  const handleRemoveProduct = (productId) => {
    const updated = removeItemFromSubscription(productId, activeSubscription?.id);
    setActiveSubscription(updated);
    loadData();
  };

  const handleToggleStatus = () => {
    if (!activeSubscription) return;
    const updated = toggleSubscriptionStatus(activeSubscription.id);
    setActiveSubscription(updated);
    loadData();
  };

  const handleSaveSubscription = () => {
    if (!activeSubscription) return;
    updateSubscription(activeSubscription);
    loadData();
  };

  const subscriptionItems = getSubscriptionItems(activeSubscription);

  return (
    <div className="space-y-8">
      <Paper className="p-6 rounded-3xl shadow-lg bg-white" elevation={2}>
        <Typography variant="h5" className="font-bold mb-3">
          My Subscriptions
        </Typography>
        <Typography className="text-gray-500 mb-4">
          Create a subscription package for products and services. This section stores subscriptions locally in your browser.
        </Typography>

        <Box className="grid gap-4 md:grid-cols-3 mb-6">
          <TextField
            label="Subscription name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <Select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            fullWidth
            variant="outlined"
          >
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
          <Button
            variant="contained"
            onClick={handleCreateSubscription}
            sx={{ textTransform: "none" }}
          >
            Create Subscription
          </Button>
        </Box>

        {activeSubscription ? (
          <Paper className="p-5 rounded-3xl border border-gray-200">
            <Typography variant="h6" className="font-semibold mb-2">
              Active Subscription
            </Typography>
            <Typography className="text-gray-700 mb-2">
              Name: {activeSubscription.subscriptionName}
            </Typography>
            <Typography className="text-gray-700 mb-2">
              Frequency: {activeSubscription.frequency}
            </Typography>
            <Typography className="text-gray-700 mb-2">
              Status: {activeSubscription.status}
            </Typography>
            <Typography className="text-gray-700 mb-2">
              Total price: ${activeSubscription.totalPrice.toFixed(2)}
            </Typography>
            <Typography className="text-gray-700 mb-4">
              Created: {new Date(activeSubscription.createdDate).toLocaleString()}
            </Typography>
            <Box className="flex flex-wrap gap-3 mb-4">
              <Button
                variant="outlined"
                onClick={handleToggleStatus}
                sx={{ textTransform: "none" }}
              >
                {activeSubscription.status === "active" ? "Cancel Subscription" : "Activate Subscription"}
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveSubscription}
                sx={{ textTransform: "none" }}
              >
                Save Subscription
              </Button>
            </Box>
            <Typography variant="subtitle1" className="font-semibold mb-3">
              Subscription Items
            </Typography>
            {subscriptionItems.length > 0 ? (
              <Box className="space-y-3">
                {subscriptionItems.map((item) => (
                  <Paper
                    key={item.id}
                    className="p-4 rounded-3xl border border-gray-200 flex justify-between items-center"
                  >
                    <div>
                      <Typography className="font-semibold">{item.title}</Typography>
                      <Typography className="text-gray-500 text-sm">{item.type}</Typography>
                      <Typography className="text-indigo-600 font-semibold mt-1">
                        ${item.price}
                      </Typography>
                    </div>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleRemoveProduct(item.id)}
                      sx={{ textTransform: "none" }}
                    >
                      Remove
                    </Button>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Typography className="text-gray-500">No items added yet.</Typography>
            )}
          </Paper>
        ) : (
          <Paper className="p-5 rounded-3xl border border-gray-200">
            <Typography className="text-gray-700">
              No subscription selected. Create one to start building your package.
            </Typography>
          </Paper>
        )}
      </Paper>

      <Paper className="p-6 rounded-3xl shadow-lg bg-white" elevation={2}>
        <Typography variant="h6" className="font-semibold mb-3">
          Recommended for Your Next Subscription
        </Typography>
        <RecommendationSection title="Subscription recommendations" items={recommended} />
      </Paper>

      <Paper className="p-6 rounded-3xl shadow-lg bg-white" elevation={2}>
        <Typography variant="h6" className="font-semibold mb-4">
          Available Products to Add
        </Typography>
        <Box className="grid gap-4 md:grid-cols-2">
          {ITEMS.slice(0, 6).map((item) => {
            const alreadyAdded = subscriptionItems.some((subItem) => subItem.id === item.id);
            return (
              <Paper
                key={item.id}
                className="p-4 rounded-3xl border border-gray-200"
                elevation={0}
              >
                <Typography className="font-semibold">{item.title}</Typography>
                <Typography className="text-gray-500 text-sm">{item.type}</Typography>
                <Typography className="text-indigo-600 font-semibold mt-2">
                  ${item.price}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={alreadyAdded}
                  onClick={() => handleAddProduct(item)}
                  sx={{ mt: 3, textTransform: "none" }}
                >
                  {alreadyAdded ? "Already in subscription" : "Add to Subscription"}
                </Button>
              </Paper>
            );
          })}
      </Box>
      </Paper>

      <Paper className="p-6 rounded-3xl shadow-lg bg-white" elevation={2}>
        <Typography variant="h6" className="font-semibold mb-3">
          Subscription History
        </Typography>
        {subscriptions.length > 0 ? (
          <Box className="space-y-4">
            {subscriptions.map((sub) => (
              <Paper
                key={sub.id}
                className="p-4 rounded-3xl border border-gray-200"
                elevation={0}
              >
                <Typography className="font-semibold">{sub.subscriptionName}</Typography>
                <Typography className="text-gray-500">Frequency: {sub.frequency}</Typography>
                <Typography className="text-gray-500">Status: {sub.status}</Typography>
                <Typography className="text-gray-500">
                  Items: {sub.selectedItems.length}
                </Typography>
                <Typography className="text-indigo-600 font-semibold mt-2">
                  ${sub.totalPrice.toFixed(2)}
                </Typography>
              </Paper>
            ))}
          </Box>
        ) : (
          <Typography className="text-gray-500">No subscription history yet.</Typography>
        )}
      </Paper>
    </div>
  );
};

export default SubscriptionSection;
