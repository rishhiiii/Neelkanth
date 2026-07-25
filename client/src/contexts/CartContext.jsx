import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as cartApi from '../api/cart.js';
import { useAuth } from './AuthContext.jsx';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

const EMPTY_CART = { items: [], itemCount: 0, subtotal: 0, shippingFee: 0, grandTotal: 0 };

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(EMPTY_CART);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) { setCart(EMPTY_CART); return; }
    setLoading(true);
    try {
      const { data } = await cartApi.getCart();
      setCart(data.data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addItem = useCallback(async (productId, quantity = 1) => {
    const { data } = await cartApi.addItem(productId, quantity);
    setCart(data.data);
    toast.success('Added to cart');
  }, []);

  const updateQuantity = useCallback(async (productId, quantity) => {
    const { data } = await cartApi.updateQuantity(productId, quantity);
    setCart(data.data);
  }, []);

  const removeItem = useCallback(async (productId) => {
    const { data } = await cartApi.removeItem(productId);
    setCart(data.data);
    toast.success('Removed from cart');
  }, []);

  const clearAll = useCallback(async () => {
    const { data } = await cartApi.clearCart();
    setCart(data.data);
    toast.success('Cart cleared');
  }, []);

  const value = { cart, loading, fetchCart, addItem, updateQuantity, removeItem, clearAll };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
