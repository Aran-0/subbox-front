import { useState } from "react";
import {
  Card,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Tabs,
  Tab,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ITEMS } from "../common/functions/items";

const AdminProducts = () => {
  const [products, setProducts] = useState(ITEMS);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    imageSrc: "",
    description: "",
  });
  const [tabValue, setTabValue] = useState(0);
  
  // Каталог состояние
  const [catalogProducts, setCatalogProducts] = useState({
    vegetables: [
      { id: 1, name: "Картофель", price: "" },
      { id: 2, name: "Морковь", price: "" },
      { id: 3, name: "Лук", price: "" },
      { id: 4, name: "Помидоры", price: "" },
      { id: 5, name: "Огурцы", price: "" },
      { id: 6, name: "Перец", price: "" },
      { id: 7, name: "Брокколи", price: "" },
      { id: 8, name: "Кабачки", price: "" },
    ],
    dairy: [
      { id: 9, name: "Молоко", price: "" },
      { id: 10, name: "Йогурт", price: "" },
      { id: 11, name: "Сыр", price: "" },
      { id: 12, name: "Творог", price: "" },
      { id: 13, name: "Масло", price: "" },
      { id: 14, name: "Кефир", price: "" },
    ],
    bakery: [
      { id: 15, name: "Белый хлеб", price: "" },
      { id: 16, name: "Ржаной хлеб", price: "" },
      { id: 17, name: "Булочки", price: "" },
      { id: 18, name: "Круассаны", price: "" },
      { id: 19, name: "Пицца (готовая)", price: "" },
    ],
    meatFish: [
      { id: 20, name: "Курица", price: "" },
      { id: 21, name: "Говядина", price: "" },
      { id: 22, name: "Свинина", price: "" },
      { id: 23, name: "Рыба (лосось, треска, тунец)", price: "" },
      { id: 24, name: "Колбаса", price: "" },
    ],
  });

  const [openCatalogDialog, setOpenCatalogDialog] = useState(false);
  const [editingCatalogProduct, setEditingCatalogProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");

  const categories = [
    { key: "vegetables", label: "🥦 Овощи", icon: "🥦" },
    { key: "dairy", label: "🥛 Молочные продукты", icon: "🥛" },
    { key: "bakery", label: "🍞 Хлеб и выпечка", icon: "🍞" },
    { key: "meatFish", label: "🥩 Мясо и рыба", icon: "🥩" },
  ];

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.title,
        price: product.price,
        imageSrc: product.imageSrc,
        description: product.description || "",
      });
    } else {
      setEditingProduct(null);
      setFormData({
        title: "",
        price: "",
        imageSrc: "",
        description: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProduct = () => {
    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? { ...p, ...formData }
            : p
        )
      );
    } else {
      const newProduct = {
        id: Date.now().toString(),
        ...formData,
        price: parseFloat(formData.price),
      };
      setProducts([...products, newProduct]);
    }
    handleCloseDialog();
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // Каталог функции
  const handleOpenCatalogDialog = (category, product = null) => {
    setEditingCategory(category);
    if (product) {
      setEditingCatalogProduct(product);
      setNewProductName(product.name);
      setNewProductPrice(product.price || "");
    } else {
      setEditingCatalogProduct(null);
      setNewProductName("");
      setNewProductPrice("");
    }
    setOpenCatalogDialog(true);
  };

  const handleCloseCatalogDialog = () => {
    setOpenCatalogDialog(false);
    setEditingCatalogProduct(null);
    setNewProductName("");
    setNewProductPrice("");
  };

  const handleSaveCatalogProduct = () => {
    if (!newProductName.trim()) return;

    if (editingCatalogProduct) {
      setCatalogProducts((prev) => ({
        ...prev,
        [editingCategory]: prev[editingCategory].map((p) =>
          p.id === editingCatalogProduct.id
            ? { ...p, name: newProductName, price: newProductPrice }
            : p
        ),
      }));
    } else {
      const newId = Math.max(...Object.values(catalogProducts).flat().map((p) => p.id), 0) + 1;
      setCatalogProducts((prev) => ({
        ...prev,
        [editingCategory]: [
          ...prev[editingCategory],
          { id: newId, name: newProductName, price: newProductPrice },
        ],
      }));
    }
    handleCloseCatalogDialog();
  };

  const handleDeleteCatalogProduct = (category, productId) => {
    setCatalogProducts((prev) => ({
      ...prev,
      [category]: prev[category].filter((p) => p.id !== productId),
    }));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Box
        className="rounded-2xl mb-6"
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
          aria-label="products tabs"
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
            label="Товары"
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
            label="Каталог"
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
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <>
          <Box className="flex justify-between items-center mb-6">
            <Typography variant="h6" className="font-bold">
              Управление товарами ({products.length})
            </Typography>
            <Button
              variant="contained"
          sx={{
            background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
            textTransform: "none",
          }}
              onClick={() => handleOpenDialog()}
            >
              ➕ Добавить товар
            </Button>
          </Box>

      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
              <TableCell className="font-bold">Товар</TableCell>
              <TableCell align="right" className="font-bold">
                Цена
              </TableCell>
              <TableCell className="font-bold">Изображение</TableCell>
              <TableCell align="center" className="font-bold">
                Действия
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.slice(0, 10).map((product) => (
              <TableRow key={product.id} hover>
                <TableCell>{product.title}</TableCell>
                <TableCell align="right">${product.price}</TableCell>
                <TableCell>
                  <img
                    src={product.imageSrc}
                    alt={product.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                </TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    onClick={() => handleOpenDialog(product)}
                    sx={{ color: "#6366f1" }}
                  >
                    ✏️ Редактировать
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleDeleteProduct(product.id)}
                    sx={{ color: "#ef4444" }}
                  >
                    🗑️ Удалить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
            <DialogTitle>
              {editingProduct ? "Редактировать товар" : "Добавить новый товар"}
            </DialogTitle>
            <DialogContent className="space-y-4 mt-4">
              <TextField
                fullWidth
                label="Название товара"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="Цена"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="URL изображения"
                name="imageSrc"
                value={formData.imageSrc}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="Описание"
                name="description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Отмена</Button>
              <Button
                onClick={handleSaveProduct}
                variant="contained"
                sx={{ background: "linear-gradient(135deg, #0ea5e9, #0284c7)" }}
              >
                Сохранить
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}

      {tabValue === 1 && (
        <div className="flex flex-col gap-8 mb-12">
          {categories.map((category) => (
            <div key={category.key}>
              <div className="mb-6 flex items-center gap-3">
                <span className="text-3xl">{category.icon}</span>
                <Typography variant="h5" className="font-bold text-gray-800">
                  {category.label}
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  size="small"
                  sx={{
                    ml: "auto",
                    backgroundImage: "linear-gradient(135deg,#0ea5e9,#0284c7)",
                    textTransform: "none",
                  }}
                  onClick={() => handleOpenCatalogDialog(category.key)}
                >
                  Добавить
                </Button>
              </div>

              <Grid container spacing={2}>
                {catalogProducts[category.key].map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <Card
                      className="hover:shadow-lg transition-shadow h-full"
                      sx={{
                        borderRadius: 2,
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <Box sx={{ p: 2 }}>
                        <Typography variant="h6" className="font-semibold text-gray-800 mb-2">
                          {product.name}
                        </Typography>
                        {product.price && (
                          <Typography variant="body2" className="text-indigo-600 font-semibold mb-4">
                            ${product.price}
                          </Typography>
                        )}
                        <div className="flex gap-2">
                          <Button
                            size="small"
                            startIcon={<EditIcon />}
                            variant="outlined"
                            sx={{
                              flex: 1,
                              textTransform: "none",
                                borderColor: "#0ea5e9",
                                color: "#0ea5e9",
                            }}
                            onClick={() => handleOpenCatalogDialog(category.key, product)}
                          >
                            Изменить
                          </Button>
                          <Button
                            size="small"
                            startIcon={<DeleteIcon />}
                            variant="outlined"
                            color="error"
                            sx={{ flex: 1, textTransform: "none" }}
                            onClick={() => handleDeleteCatalogProduct(category.key, product.id)}
                          >
                            Удалить
                          </Button>
                        </div>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </div>
          ))}

          <Dialog open={openCatalogDialog} onClose={handleCloseCatalogDialog} maxWidth="sm" fullWidth>
            <DialogTitle>
              {editingCatalogProduct ? "Изменить продукт" : "Добавить продукт"}
            </DialogTitle>
            <DialogContent className="flex flex-col gap-4 mt-4">
              <TextField
                fullWidth
                label="Название продукта"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                placeholder="например: Картофель"
                size="small"
              />
              <TextField
                fullWidth
                label="Цена (опционально)"
                value={newProductPrice}
                onChange={(e) => setNewProductPrice(e.target.value)}
                placeholder="например: 2.99"
                size="small"
                type="number"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseCatalogDialog}>Отмена</Button>
              <Button
                onClick={handleSaveCatalogProduct}
                variant="contained"
                sx={{
                  backgroundImage: "linear-gradient(135deg,#0ea5e9,#0284c7)",
                  textTransform: "none",
                }}
              >
                {editingCatalogProduct ? "Обновить" : "Добавить"}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </Box>
  );
};

export default AdminProducts;
