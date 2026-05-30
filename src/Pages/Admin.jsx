import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../Auth/firebase";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Tabs,
  Tab,
  Box,
  Typography,
  Alert,
  Button,
} from "@mui/material";
import AdminDashboard from "../components/Admin/AdminDashboard";
import AdminProducts from "../components/Admin/AdminProducts";
import AdminOrders from "../components/Admin/AdminOrders";
import AdminUsers from "../components/Admin/AdminUsers";

const ADMIN_EMAILS = ["admin@subbox.com", "aran@subbox.com"];

const Admin = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (!ADMIN_EMAILS.includes(currentUser.email)) {
      navigate("/");
      return;
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return (
      <Container className="mt-40">
        <Alert severity="error">Требуется вход в систему</Alert>
      </Container>
    );
  }

  if (!ADMIN_EMAILS.includes(currentUser.email)) {
    return (
      <Container className="mt-40">
        <Alert severity="error">У вас нет доступа к админ панели</Alert>
      </Container>
    );
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50 pt-28 pb-20">
      <Container maxWidth="xl">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Typography
              variant="h4"
              className="font-extrabold mb-1 bg-clip-text text-transparent"
              sx={{
                backgroundImage: "linear-gradient(135deg,#0ea5e9,#0284c7,#10b981)",
              }}
            >
              Админ Панель Subbox
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Добро пожаловать, {currentUser.email}
            </Typography>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outlined"
              size="small"
              sx={{ borderRadius: 2, textTransform: "none" }}
              onClick={() => setTabValue(1)}
            >
              Добавить Товар
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{
                borderRadius: 2,
                backgroundImage: "linear-gradient(135deg,#0ea5e9,#0284c7)",
                boxShadow: "0 6px 18px rgba(14,165,233,0.25)",
                textTransform: "none",
              }}
              onClick={() => setTabValue(0)}
            >
              Обновить панель
            </Button>
          </div>
        </div>

        <Box
          className="rounded-2xl"
          sx={{
            p: 1,
            background: "rgba(255,255,255,0.9)",
            boxShadow: "0 4px 18px rgba(15,23,42,0.06)",
            borderRadius: 3,
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="admin tabs"
            sx={{
              minHeight: 48,
              p: 1,
              background: "#f8fafc",
              borderRadius: 6,
              "& .MuiTabs-flexContainer": { gap: 1 },
              "& .MuiTabs-indicator": { display: "none" },
            }}
          >
            <Tab
              label="Панель"
              sx={{
                borderRadius: 6,
                px: 2.5,
                py: 1,
                m: 0.5,
                textTransform: "none",
                fontWeight: tabValue === 0 ? 700 : 600,
                color: tabValue === 0 ? "white" : "#6b7280",
                background: tabValue === 0 ? "linear-gradient(135deg,#0ea5e9,#0284c7)" : "transparent",
                boxShadow: tabValue === 0 ? "0 8px 24px rgba(14,165,233,0.2)" : "none",
              }}
            />
            <Tab
              label="Товары"
              sx={{
                borderRadius: 6,
                px: 2.5,
                py: 1,
                m: 0.5,
                textTransform: "none",
                fontWeight: tabValue === 1 ? 700 : 600,
                color: tabValue === 1 ? "white" : "#6b7280",
                background: tabValue === 1 ? "linear-gradient(135deg,#0ea5e9,#0284c7)" : "transparent",
                boxShadow: tabValue === 1 ? "0 8px 24px rgba(14,165,233,0.2)" : "none",
              }}
            />
            <Tab
              label="Заказы"
              sx={{
                borderRadius: 6,
                px: 2.5,
                py: 1,
                m: 0.5,
                textTransform: "none",
                fontWeight: tabValue === 2 ? 700 : 600,
                color: tabValue === 2 ? "white" : "#6b7280",
                background: tabValue === 2 ? "linear-gradient(135deg,#0ea5e9,#0284c7)" : "transparent",
                boxShadow: tabValue === 2 ? "0 8px 24px rgba(14,165,233,0.2)" : "none",
              }}
            />
            <Tab
              label="Пользователи"
              sx={{
                borderRadius: 6,
                px: 2.5,
                py: 1,
                m: 0.5,
                textTransform: "none",
                fontWeight: tabValue === 3 ? 700 : 600,
                color: tabValue === 3 ? "white" : "#6b7280",
                background: tabValue === 3 ? "linear-gradient(135deg,#0ea5e9,#0284c7)" : "transparent",
                boxShadow: tabValue === 3 ? "0 8px 24px rgba(14,165,233,0.2)" : "none",
              }}
            />
          </Tabs>
        </Box>

        <Box className="mt-8">
          {tabValue === 0 && <AdminDashboard />}
          {tabValue === 1 && <AdminProducts />}
          {tabValue === 2 && <AdminOrders />}
          {tabValue === 3 && <AdminUsers />}
        </Box>
      </Container>
    </div>
  );
};

export default Admin;
