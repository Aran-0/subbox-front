import { useCart } from "../context/CartContext";
import CartItem from "../components/Cart/CartItem";
import WhiteButton from "../components/common/components/WhiteButton";
import RedButton from "../components/common/components/RedButton";
import ActiveLastBreadcrumb from "../components/common/components/Link";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cartItems, loading } = useCart();

  const total = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  if (loading) {
    return <div className="text-center py-20 text-xl">Загрузка корзины...</div>;
  }

  return (
    <div className="max-w-screen-lg mx-auto mt-32 px-4 flex flex-col gap-10">
      <ActiveLastBreadcrumb path="Home/Cart" />

      <div className="bg-white shadow rounded p-6">
        <div className="hidden md:grid grid-cols-12 gap-4 py-4 border-b font-medium text-gray-600">
          <div className="col-span-6">Товар</div>
          <div className="col-span-2 text-center">Цена</div>
          <div className="col-span-2 text-center">Количество</div>
          <div className="col-span-2 text-right">Итого</div>
        </div>

        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <CartItem key={item.id || index} item={item} index={index} />
          ))
        ) : (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-400">Корзина пуста</p>
            <Link to="/allProducts" className="mt-6 inline-block">
              <WhiteButton name="Перейти в магазин" />
            </Link>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Link to="/allProducts">
          <WhiteButton name="Вернуться в магазин" />
        </Link>
        <WhiteButton name="Обновить корзину" />
      </div>

      {/* Итого */}
      <div className="border p-8 rounded-xl bg-white max-w-md ml-auto">
        <h2 className="text-2xl font-semibold mb-6">Итого корзина</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between text-lg">
            <span>Промежуточный итог:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span>Доставка:</span>
            <span className="text-green-600">Бесплатно</span>
          </div>
          <div className="flex justify-between text-2xl font-bold border-t pt-4">
            <span>Итого:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <Link to="/checkout" className="block mt-8">
          <RedButton name="Перейти к оплате" className="w-full" />
        </Link>
      </div>
    </div>
  );
};

export default Cart;