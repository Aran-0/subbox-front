import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
} from "@mui/material";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(storedOrders);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "processing":
        return "info";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "⏳ Ожидание",
      processing: "⚙️ В обработке",
      completed: "✅ Завершён",
      cancelled: "❌ Отменён",
    };
    return labels[status] || status;
  };

  return (
    <Box>
      <Typography variant="h6" className="font-bold mb-6">
        История заказов ({orders.length})
      </Typography>

      {orders.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="textSecondary" align="center" className="py-8">
              Нет заказов
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Card}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
                <TableCell className="font-bold">ID Заказа</TableCell>
                <TableCell className="font-bold">Email</TableCell>
                <TableCell align="right" className="font-bold">
                  Сумма
                </TableCell>
                <TableCell className="font-bold">Товары</TableCell>
                <TableCell className="font-bold">Статус</TableCell>
                <TableCell className="font-bold">Дата</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell className="font-mono text-sm">
                    {order.id?.substring(0, 8)}...
                  </TableCell>
                  <TableCell>{order.email}</TableCell>
                  <TableCell align="right" className="font-semibold">
                    ${order.total?.toFixed(2) || "0.00"}
                  </TableCell>
                  <TableCell>{order.itemsCount || 0} шт</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(order.status || "pending")}
                      color={getStatusColor(order.status || "pending")}
                      size="small"
                    />
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(order.date || Date.now()).toLocaleDateString(
                      "ru-RU"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminOrders;
