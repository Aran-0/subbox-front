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

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Получаем пользователей из локального хранилища
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []);

  return (
    <Box>
      <Typography variant="h6" className="font-bold mb-6">
        Управление пользователями ({users.length})
      </Typography>

      {users.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="textSecondary" align="center" className="py-8">
              Нет пользователей
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Card}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
                <TableCell className="font-bold">Email</TableCell>
                <TableCell className="font-bold">Имя</TableCell>
                <TableCell className="font-bold">Телефон</TableCell>
                <TableCell className="font-bold">Адрес</TableCell>
                <TableCell className="font-bold">Дата регистрации</TableCell>
                <TableCell className="font-bold">Статус</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.name || "-"}</TableCell>
                  <TableCell>{user.phone || "-"}</TableCell>
                  <TableCell>{user.address || "-"}</TableCell>
                  <TableCell className="text-sm">
                    {new Date(user.createdAt || Date.now()).toLocaleDateString(
                      "ru-RU"
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label="✅ Активен"
                      color="success"
                      size="small"
                    />
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

export default AdminUsers;
