import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/cart");

      // IMPORTANT FIX
      setCartItems(data.cart || []);

    } catch (error) {
      console.log("Fetch Cart Error:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // Add to cart
  const addToCart = async (product) => {
    try {
      await API.post("/cart", {
        productId: product._id,
        quantity: 1,
      });

      fetchCart();
    } catch (error) {
      console.log("Add Cart Error:", error.response?.data);
    }
  };

  // Update quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      await API.put(`/cart/${productId}`, { quantity });
      fetchCart();
    } catch (error) {
      console.log("Update Cart Error:", error.response?.data);
    }
  };

  // Remove item
  const removeFromCart = async (productId) => {
    try {
      await API.delete(`/cart/${productId}`);
      fetchCart();
    } catch (error) {
      console.log("Remove Cart Error:", error.response?.data);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const totalItems = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const totalPrice = cartItems.reduce(
    (acc, item) =>
      acc + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
