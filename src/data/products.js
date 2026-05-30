import { productAPI } from '../services/api';

const normalizeProduct = (p, index) => ({
  id: p.id,
  title: p.name,
  name: p.name,
  category: p.category,
  price: Number(p.price),
  image: `https://picsum.photos/id/${100 + (p.id || index)}/300/200`,
  imageSrc: `https://picsum.photos/id/${100 + (p.id || index)}/300/200`,
  description: p.description || "Описание товара",
  stars: p.stars || 4,
  rates: p.rates || 45,
  quantity: p.quantity || 1,
  colors: p.colors || ["#111827", "#F97316", "#10B981", "#3B82F6"],
});

export const loadProducts = async (category) => {
  try {
    const data = category
      ? await productAPI.getByCategory(category)
      : await productAPI.getAll();

    return data.map(normalizeProduct);
  } catch (error) {
    console.error("Ошибка загрузки товаров:", error);
    return [];
  }
};

export const loadProductByTitle = async (title) => {
  const products = await loadProducts();
  return products.find((p) => p.title === title || p.name === title) || null;
};

export default [];
