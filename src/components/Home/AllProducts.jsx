import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { loadProducts } from "../../data/products";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingId, setAddingId] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await loadProducts();
        setProducts(data);
      } catch (err) {
        console.error("Ошибка загрузки товаров:", err);
        setError("Не удалось загрузить товары. Попробуйте обновить страницу.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    setAddingId(product.id);
    const success = await addToCart(product.id, 1);
    setAddingId(null);

    if (success) {
      alert(`✅ ${product.title} добавлен в корзину!`);
    } else {
      alert("❌ Не удалось добавить товар в корзину.");
    }
  };

  if (loading) {
    return <div className="loading">Загрузка товаров...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="all-products-page">
      <h1>Исследуйте наши товары</h1>
      
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.title} />
            <h3>{product.title}</h3>
            <p className="category">{product.category}</p>
            <p className="price">{product.price} ₸</p>
            <p className="description">{product.description}</p>
            
            <button 
              className="add-to-cart-btn"
              disabled={addingId === product.id}
              onClick={() => handleAddToCart(product)}
            >
              {addingId === product.id ? "Добавляем..." : "В корзину"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;