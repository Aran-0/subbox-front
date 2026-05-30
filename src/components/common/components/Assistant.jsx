import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { ITEMS } from "../functions/items";

export default function AssistantDialog({ open, onClose }) {
  const [assistantQuery, setAssistantQuery] = useState("");
  const [assistantHistory, setAssistantHistory] = useState([]);
  const [settings, setSettings] = useState({ topN: 4 });

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("recommenderSettings"));
      if (saved) setSettings((s) => ({ ...s, ...saved }));
    } catch (e) {
      // ignore
    }
  }, [open]);

  const generateAnswer = (q) => {
    const text = (q || "").toLowerCase();
    if (!text) return "Введите вопрос.";

    if (text.includes("next basket") || text.includes("следующ") || text.includes("рекоменд")) {
      return (
        "Next Basket — система, предсказывающая товары для следующей покупки на основе истории заказов (частоты и ассоциаций)."
      );
    }

    const byTitle = ITEMS.find((it) => (it.title || "").toLowerCase().includes(text));
    if (byTitle) {
      return `Товар: ${byTitle.title} — цена: $${byTitle.price}. ${byTitle.details}`;
    }

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
        if (top.length === 0) return "Нет данных заказов для рекомендаций.";
        return "Рекомендации: " + top.map((t) => `${t.title} ($${t.price})`).join(", ");
      } catch (e) {
        return "Не удалось получить данные заказов.";
      }
    }

    const byType = ITEMS.find((it) => (it.type || "").toLowerCase().includes(text));
    if (byType) {
      return `Найден товар типа ${byType.type}: ${byType.title} — $${byType.price}`;
    }

    return "Не понял вопроса. Спросите про товар по названию или попросите рекомендации.";
  };

  const askAssistant = () => {
    if (!assistantQuery.trim()) return;
    const userQ = assistantQuery.trim();
    const answer = generateAnswer(userQ);
    setAssistantHistory((h) => [...h, { from: "user", text: userQ }, { from: "bot", text: answer }]);
    setAssistantQuery("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>AI Ассистент — спросите про товары</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              placeholder="Например: порекомендуй продукты или расскажи про PlayStation"
              value={assistantQuery}
              onChange={(e) => setAssistantQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') askAssistant(); }}
            />
            <Button variant="contained" onClick={askAssistant} sx={{ textTransform: "none" }}>Спросить</Button>
          </Box>

          <Box>
            <List sx={{ maxHeight: 320, overflow: "auto" }}>
              {assistantHistory.length === 0 && (
                <ListItem>
                  <ListItemText primary="Задайте вопрос, чтобы получить ответ." />
                </ListItem>
              )}
              {assistantHistory.map((m, idx) => (
                <ListItem key={idx} sx={{ alignItems: "flex-start" }}>
                  <ListItemText primary={m.from === "user" ? `Вы: ${m.text}` : `Ассистент: ${m.text}`} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { setAssistantHistory([]); onClose(); }}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
}

AssistantDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
