import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as wishlistApi from '../api/wishlist.js';
import { useAuth } from './AuthContext.jsx';
import { useCart } from './CartContext.jsx';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

const EMPTY = { items: [], itemCount: 0 };

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const { fetchCart } = useCart();
  const [wishlist, setWishlist] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) { setWishlist(EMPTY); return; }
    setLoading(true);
    try {
      const { data } = await wishlistApi.getWishlist();
      setWishlist(data.data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const addItem = useCallback(async (productId) => {
    const { data } = await wishlistApi.addItem(productId);
    setWishlist(data.data);
    toast.success('Added to wishlist');
  }, []);

  const removeItem = useCallback(async (productId) => {
    const { data } = await wishlistApi.removeItem(productId);
    setWishlist(data.data);
    toast.success('Removed from wishlist');
  }, []);

  const moveToCart = useCallback(async (productId) => {
    const { data } = await wishlistApi.moveToCart(productId);
    setWishlist(data.data.wishlist);
    await fetchCart();
    toast.success('Moved to cart');
  }, [fetchCart]);

  const isInWishlist = useCallback(
    (productId) => wishlist.items.some((i) => i.product?._id === productId),
    [wishlist.items]
  );

  const value = { wishlist, loading, fetchWishlist, addItem, removeItem, moveToCart, isInWishlist };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
