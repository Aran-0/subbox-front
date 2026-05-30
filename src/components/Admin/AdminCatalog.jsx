import { useState } from "react";
import { Grid, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const AdminCatalog = () => {
  const [products, setProducts] = useState({
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

  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");

  const categories = [
    { key: "vegetables", label: "🥦 Овощи", icon: "🥦" },
    { key: "dairy", label: "🥛 Молочные продукты", icon: "🥛" },
    { key: "bakery", label: "🍞 Хлеб и выпечка", icon: "🍞" },
    { key: "meatFish", label: "🥩 Мясо и рыба", icon: "🥩" },
  ];

  const handleOpenDialog = (category, product = null) => {
    setEditingCategory(category);
    if (product) {
      setEditingProduct(product);
      setNewProductName(product.name);
      setNewProductPrice(product.price || "");
    } else {
      setEditingProduct(null);
      setNewProductName("");
      setNewProductPrice("");
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setNewProductName("");
    setNewProductPrice("");
  };

  const handleSaveProduct = () => {
    if (!newProductName.trim()) return;

    if (editingProduct) {
      // Обновить продукт
      setProducts((prev) => ({
        ...prev,
        [editingCategory]: prev[editingCategory].map((p) =>
          p.id === editingProduct.id
            ? { ...p, name: newProductName, price: newProductPrice }
            : p
        ),
      }));
    } else {
      // Добавить новый продукт
      const newId = Math.max(...Object.values(products).flat().map((p) => p.id), 0) + 1;
      setProducts((prev) => ({
        ...prev,
        [editingCategory]: [
          ...prev[editingCategory],
          { id: newId, name: newProductName, price: newProductPrice },
        ],
      }));
    }
    handleCloseDialog();
  };

  const handleDeleteProduct = (category, productId) => {
    setProducts((prev) => ({
      ...prev,
      [category]: prev[category].filter((p) => p.id !== productId),
    }));
  };

  return (
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
                backgroundImage: "linear-gradient(90deg,#6366f1,#ec4899)",
                textTransform: "none",
              }}
              onClick={() => handleOpenDialog(category.key)}
            >
              Добавить
            </Button>
          </div>

          <Grid container spacing={2}>
            {products[category.key].map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Card
                  className="hover:shadow-lg transition-shadow h-full"
                  sx={{
                    borderRadius: 2,
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <CardContent>
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
                          borderColor: "#6366f1",
                          color: "#6366f1",
                        }}
                        onClick={() => handleOpenDialog(category.key, product)}
                      >
                        Изменить
                      </Button>
                      <Button
                        size="small"
                        startIcon={<DeleteIcon />}
                        variant="outlined"
                        color="error"
                        sx={{ flex: 1, textTransform: "none" }}
                        onClick={() => handleDeleteProduct(category.key, product.id)}
                      >
                        Удалить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      ))}

      {/* Dialog для добавления/редактирования */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingProduct ? "Изменить продукт" : "Добавить продукт"}
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
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button
            onClick={handleSaveProduct}
            variant="contained"
            sx={{
              backgroundImage: "linear-gradient(90deg,#6366f1,#ec4899)",
              textTransform: "none",
            }}
          >
            {editingProduct ? "Обновить" : "Добавить"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminCatalog;
