import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { ITEMS } from "../common/functions/items";
import { getNextBasketRecommendations } from "../common/functions/recommendationUtils";
import RecommendationSection from "../common/components/RecommendationSection";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    // Получаем статистику из локального хранилища
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    setStats({
      totalProducts: ITEMS.length,
      totalOrders: orders.length,
      totalUsers: new Set(orders.map((o) => o.userId)).size || 1,
      totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
    });
  }, []);

  // Recommender settings modal state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    enabled: true,
    lookbackDays: 30,
    algorithm: "frequency",
    topN: 4,
  });

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("recommenderSettings"));
      if (saved) setSettings((s) => ({ ...s, ...saved }));
    } catch (e) {
      // ignore
    }
  }, []);

  const openSettings = () => setSettingsOpen(true);
  const closeSettings = () => setSettingsOpen(false);
  const handleSaveSettings = () => {
    try {
      localStorage.setItem("recommenderSettings", JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
    setSettingsOpen(false);
  };

  // Simple AI Assistant state
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantQuery, setAssistantQuery] = useState("");
  const [assistantHistory, setAssistantHistory] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setRecommendations(getNextBasketRecommendations({ products: ITEMS, cartItems }));
  }, []);

  const openAssistant = () => setAssistantOpen(true);
  const closeAssistant = () => setAssistantOpen(false);

  const generateAnswer = (q) => {
    const text = (q || "").toLowerCase();
    // If user asks about Next Basket
    if (text.includes("next basket") || text.includes("следующ") || text.includes("рекоменд")) {
      return (
        "Next Basket — это система, которая предсказывает, какие товары пользователь купит в следующий раз, используя историю заказов и частотные/ассоциативные правила."
      );
    }

    // If asks about a specific product by name
    const byTitle = ITEMS.find((it) => (it.title || "").toLowerCase().includes(text));
    if (byTitle) {
      return `Товар: ${byTitle.title} — цена: $${byTitle.price}. ${byTitle.details}`;
    }

    // If asks for recommendations, show topN by frequency from orders
    if (text.includes("рекомендац") || text.includes("предлож")) {
      try {
        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        const freq = {};
        orders.forEach((o) => {
          (o.items || []).forEach((it) => {
            freq[it.id] = (freq[it.id] || 0) + (it.quantity || 1);
          });
        });
        const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
        const top = sorted.slice(0, settings.topN || 4).map(([id]) => ITEMS.find((i) => i.id === id)).filter(Boolean);
        if (top.length === 0) return "Нет данных по заказам для генерации рекомендаций.";
        return "Рекомендации: " + top.map((t) => `${t.title} ($${t.price})`).join(", ");
      } catch (e) {
        return "Не удалось получить данные заказов для рекомендаций.";
      }
    }

    // Fallback: search by type
    const byType = ITEMS.find((it) => (it.type || "").toLowerCase().includes(text));
    if (byType) {
      return `Найден товар типа ${byType.type}: ${byType.title} — $${byType.price}`;
    }

    return "Извините, я не понял вопроса. Спросите про товар по названию или попросите рекомендации.";
  };

  const askAssistant = () => {
    if (!assistantQuery.trim()) return;
    const userQ = assistantQuery.trim();
    const answer = generateAnswer(userQ);
    setAssistantHistory((h) => [...h, { from: "user", text: userQ }, { from: "bot", text: answer }]);
    setAssistantQuery("");
  };


  const StatCard = ({ title, value, icon, color }) => (
    <Card
      className="hover:shadow-xl transition-shadow"
      sx={{ background: `linear-gradient(135deg, ${color}15, ${color}05)` }}
    >
      <CardContent>
        <Box className="flex items-center justify-between">
          <div>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h5" className="font-bold text-gray-900">
              {value}
            </Typography>
          </div>
          <Typography variant="h4" sx={{ color: color }}>
            {icon}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    icon: PropTypes.node.isRequired,
    color: PropTypes.string.isRequired,
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Всего товаров"
            value={stats.totalProducts}
            icon="📦"
            color="#6366f1"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Заказов"
            value={stats.totalOrders}
            icon="📋"
            color="#ec4899"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Пользователей"
            value={stats.totalUsers}
            icon="👥"
            color="#f59e0b"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Доход"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            icon="💰"
            color="#10b981"
          />
        </Grid>
      </Grid>

      <Card className="mt-8">
        <CardContent>
          <Typography variant="h6" className="font-bold mb-4">
            Быстрые ссылки
          </Typography>
          <Box className="flex gap-4 flex-wrap">
            <Button
              variant="contained"
              sx={{
                background:
                  "linear-gradient(135deg, #0ea5e9, #0284c7)",
                textTransform: "none",
              }}
            >
              Добавить товар
            </Button>
            <Button
              variant="outlined"
              sx={{ color: "#0ea5e9", borderColor: "#0ea5e9" }}
            >
              Просмотреть заказы
            </Button>
            <Button
              variant="outlined"
              sx={{ color: "#10b981", borderColor: "#10b981" }}
            >
              Управление пользователями
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card className="mt-8 overflow-hidden">
        <CardContent>
          <Box className="flex items-center justify-between">
            <Typography variant="h6" className="font-bold mb-2">
              Next Basket Recommendation
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={openSettings}
              sx={{
                backgroundImage: "linear-gradient(135deg,#0ea5e9,#0284c7)",
                textTransform: "none",
              }}
            >
              Настроить рекомендации
            </Button>
          </Box>
          <RecommendationSection title="Admin Basket Recommendations" items={recommendations} />
        </CardContent>
      </Card>

      <Dialog open={settingsOpen} onClose={closeSettings} fullWidth maxWidth="sm">
        <DialogTitle>Настройки рекомендаций Next Basket</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={!!settings.enabled}
                  onChange={(e) => setSettings((s) => ({ ...s, enabled: e.target.checked }))}
                />
              }
              label="Включить рекомендации"
            />

            <TextField
              label="Окно историй (дней)"
              type="number"
              value={settings.lookbackDays}
              onChange={(e) => setSettings((s) => ({ ...s, lookbackDays: Number(e.target.value) || 0 }))}
            />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Алгоритм
              </Typography>
              <Select
                fullWidth
                value={settings.algorithm}
                onChange={(e) => setSettings((s) => ({ ...s, algorithm: e.target.value }))}
              >
                <MenuItem value="frequency">По частоте покупок</MenuItem>
                <MenuItem value="association">Ассоциативные правила (простые)</MenuItem>
              </Select>
            </Box>

            <TextField
              label="Показывать топ N"
              type="number"
              value={settings.topN}
              onChange={(e) => setSettings((s) => ({ ...s, topN: Number(e.target.value) || 1 }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSettings}>Отмена</Button>
          <Button variant="contained" onClick={handleSaveSettings} sx={{ textTransform: "none" }}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
      
      <Card className="mt-6">
        <CardContent>
          <Box className="flex items-center justify-between">
            <Typography variant="h6" className="font-bold">AI Assistant</Typography>
            <Button size="small" onClick={openAssistant} sx={{ textTransform: "none" }}>
              Открыть ассистента
            </Button>
          </Box>
          <Typography variant="body2" className="text-gray-500 mt-2">
            Помощник отвечает на вопросы о товарах и рекомендует позиции по истории заказов.
          </Typography>
        </CardContent>
      </Card>

      <Dialog open={assistantOpen} onClose={closeAssistant} fullWidth maxWidth="md">
        <DialogTitle>AI Assistant — спросите про товары</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                placeholder="Например: посоветуй продукты или расскажи про PlayStation"
                value={assistantQuery}
                onChange={(e) => setAssistantQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') askAssistant(); }}
              />
              <Button variant="contained" onClick={askAssistant} sx={{ textTransform: "none" }}>Спросить</Button>
            </Box>

            <Box>
              <List sx={{ maxHeight: 300, overflow: "auto" }}>
                {assistantHistory.length === 0 && (
                  <ListItem>
                    <ListItemText primary="Задайте вопрос, чтобы получить ответ." />
                  </ListItem>
                )}
                {assistantHistory.map((m, idx) => (
                  <ListItem key={idx} sx={{ alignItems: "flex-start" }}>
                    <ListItemText
                      primary={m.from === "user" ? `Вы: ${m.text}` : `Ассистент: ${m.text}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setAssistantHistory([]); closeAssistant(); }}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
