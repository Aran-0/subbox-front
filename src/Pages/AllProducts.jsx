import { useState, useEffect } from 'react';
import { loadProducts } from '../data/products';
import { useCart } from '../context/CartContext';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleAddToCart = async (product) => {
    setAddingId(product.id);
    const success = await addToCart(product.id, 1);
    
    if (success) {
      alert(`✅ ${product.title} добавлен в корзину!`);
    } else {
      alert("❌ Не удалось добавить товар");
    }
    setAddingId(null);
  };

  if (loading) return <div className="text-center py-20">Загрузка товаров...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-10">Исследуйте наши товары</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white border rounded-xl overflow-hidden shadow hover:shadow-lg transition">
            <img 
              src={product.image} 
              alt={product.title} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg">{product.title}</h3>
              <p className="text-sm text-gray-500">{product.category}</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{product.price} ₸</p>
              
              <button 
                onClick={() => handleAddToCart(product)}
                disabled={addingId === product.id}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium"
              >
                {addingId === product.id ? "Добавляем..." : "В корзину"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;