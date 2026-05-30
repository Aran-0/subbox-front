import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useCart } from "../../../context/CartContext";
import { searchProducts } from "../functions/aiSearchUtils";
import {
  saveSearchHistory,
  saveViewedCategory,
  getNextBasketRecommendations,
} from "../functions/recommendationUtils";
import {
  getActiveSubscription,
  getSubscriptionItems,
} from "../functions/subscriptionUtils";
import { ITEMS } from "../functions/items";
import RecommendationSection from "./RecommendationSection";

const AIProductAssistant = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [results, setResults] = useState([]);
  const [basketRecommendations, setBasketRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { cartItems } = useCart();

  useEffect(() => {
    const activeSubscription = getActiveSubscription();
    const subscriptionItems = getSubscriptionItems(activeSubscription);
    setBasketRecommendations(
      getNextBasketRecommendations({
        products: ITEMS,
        cartItems,
        subscriptionItems,
      })
    );
  }, [cartItems]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    saveSearchHistory(trimmed);

    const userMessage = { role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInput("");

    setTimeout(() => {
      const foundProducts = searchProducts({ products: ITEMS, query: trimmed });
      if (foundProducts.length > 0) {
        saveViewedCategory(foundProducts[0].type);
      }

      const assistantText =
        foundProducts.length > 0
          ? `I found ${foundProducts.length} product${
              foundProducts.length === 1 ? "" : "s"
            } for your next subscription basket.`
          : "I could not find exact matches, so I pulled suggested subscription products instead.";

      const assistantMessage = { role: "assistant", text: assistantText };
      setMessages((prev) => [...prev, assistantMessage]);
      setResults(foundProducts);
      const activeSubscription = getActiveSubscription();
      const subscriptionItems = getSubscriptionItems(activeSubscription);
      setBasketRecommendations(
        getNextBasketRecommendations({
          products: ITEMS,
          cartItems,
          subscriptionItems,
        })
      );
      setLoading(false);
    }, 400);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Paper className="p-6 rounded-3xl shadow-lg bg-white" elevation={2}>
      <Typography variant="h5" className="font-bold mb-2">
        AI Subscription Assistant
      </Typography>
      <Typography variant="body2" className="text-gray-500 mb-4">
        Build your subscription basket with keyword search and smart suggestions. Try phrases like &apos;show gaming products&apos;, &apos;cheap electronics&apos;, or &apos;subscription box items&apos;.
      </Typography>

      <Box className="space-y-4 mb-4">
        {messages.map((message, index) => (
          <Box
            key={index}
            className={`rounded-2xl p-4 ${
              message.role === "user"
                ? "bg-red-50 text-gray-900 self-end"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            <Typography variant="body2">{message.text}</Typography>
          </Box>
        ))}
      </Box>

      <Box className="flex flex-col md:flex-row gap-3 items-center">
        <TextField
          fullWidth
          placeholder="Type product request..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          variant="outlined"
          size="small"
        />
        <Button
          onClick={handleSend}
          variant="contained"
          disabled={loading || !input.trim()}
          className="h-12"
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Send"}
        </Button>
      </Box>

      <Box className="mt-6">
        {results.length > 0 && (
          <Typography variant="subtitle1" className="font-semibold mb-3">
            Suggested for your next subscription box
          </Typography>
        )}

        <Box className="grid gap-4 md:grid-cols-2">
          {results.map((item) => (
            <Paper
              key={item.id}
              className="p-4 rounded-3xl border border-gray-200"
              elevation={0}
            >
              <Box className="flex gap-4 items-start">
                <img
                  src={item.imageSrc}
                  alt={item.title}
                  className="w-24 h-24 object-contain rounded-xl"
                />
                <Box className="flex-1">
                  <Typography variant="subtitle1" className="font-semibold">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    {item.type}
                  </Typography>
                  <Typography variant="body1" className="text-indigo-600 font-semibold mt-2">
                    ${item.price}
                  </Typography>
                </Box>
              </Box>
              <Box className="mt-4 flex justify-end">
                <Link to={{ pathname: `/allProducts/${item.title}` }}>
                  <Button variant="outlined" size="small">
                    View product
                  </Button>
                </Link>
              </Box>
            </Paper>
          ))}
        </Box>

        {basketRecommendations.length > 0 && (
          <Box className="mt-10">
            <RecommendationSection
              title="Suggested for your next subscription box"
              items={basketRecommendations}
            />
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default AIProductAssistant;
