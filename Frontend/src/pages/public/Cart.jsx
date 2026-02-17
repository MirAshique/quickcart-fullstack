import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
  } = useCart();

  // ================= EMPTY STATE =================
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
        
        <div className="w-20 h-20 flex items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <FiShoppingCart size={36} />
        </div>

        <h1 className="text-3xl font-bold">
          Your Cart is Empty
        </h1>

        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          Looks like you haven’t added anything yet. Browse products and
          discover something you’ll love.
        </p>

        <Link
          to="/products"
          className="px-8 py-3 rounded-2xl bg-primary text-white hover:shadow-soft transition-all duration-300"
        >
          Browse Products
        </Link>

      </div>
    );
  }

  // ================= CART WITH ITEMS =================
  return (
    <div className="grid lg:grid-cols-3 gap-10">

      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>

        {cartItems.map((item) => (
          <div
            key={item.product._id}
            className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-soft"
          >
            <div>
              <h2 className="text-lg font-semibold">
                {item.product.name}
              </h2>

              <p className="text-gray-500">
                ${item.product.price}
              </p>

              <div className="flex items-center gap-3 mt-3">

                {/* Decrease Quantity */}
                <button
                  onClick={() =>
                    updateQuantity(
                      item.product._id,
                      item.quantity > 1
                        ? item.quantity - 1
                        : 1
                    )
                  }
                  className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 hover:opacity-80"
                >
                  -
                </button>

                <span className="font-medium">
                  Qty: {item.quantity}
                </span>

                {/* Increase Quantity */}
                <button
                  onClick={() =>
                    updateQuantity(
                      item.product._id,
                      item.quantity + 1
                    )
                  }
                  className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 hover:opacity-80"
                >
                  +
                </button>

                {/* Remove Item */}
                <button
                  onClick={() =>
                    removeFromCart(item.product._id)
                  }
                  className="px-3 py-1 rounded-lg bg-red-500 text-white hover:opacity-90"
                >
                  Remove
                </button>

              </div>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold">
                $
                {(
                  item.product.price * item.quantity
                ).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-soft h-fit space-y-6">
        <h2 className="text-2xl font-bold">Order Summary</h2>

        <div className="flex justify-between">
          <span>Total Items</span>
          <span>{totalItems}</span>
        </div>

        <div className="flex justify-between text-xl font-semibold">
          <span>Total Price</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>

        <Link
          to="/checkout"
          className="block w-full text-center px-6 py-3 rounded-xl bg-primary text-white hover:shadow-soft transition"
        >
          Proceed to Checkout
        </Link>
      </div>

    </div>
  );
};

export default Cart;
