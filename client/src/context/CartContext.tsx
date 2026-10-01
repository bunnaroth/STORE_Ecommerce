import React, { createContext, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { CartItemModel, IRawCartItem } from '../types/cart.js';
import { cartApi } from '../api/cartApi.js';
import { productApi } from '../api/productApi.js';
import { useAuth } from '../hooks/useAuth.js';

const GUEST_CART_KEY = 'guest-cart-items';

const readGuestCart = (): CartItemModel[] => {
  try {
    const savedCart = localStorage.getItem(GUEST_CART_KEY);
    if (!savedCart) return [];
    const items = JSON.parse(savedCart) as IRawCartItem[];
    if (!Array.isArray(items)) throw new Error('Invalid guest cart data.');
    return items.map((item) => new CartItemModel(item));
  } catch {
    localStorage.removeItem(GUEST_CART_KEY);
    return [];
  }
};

const saveGuestCart = (items: CartItemModel[]) => {
  if (items.length === 0) {
    localStorage.removeItem(GUEST_CART_KEY);
    return;
  }

  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items.map((item) => ({
    cartItemId: item.cartItemId,
    productId: item.productId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    images: item.images,
    stock: item.stock,
  }))));
};

export interface CartContextType {
  cartItems: CartItemModel[];
  isLoading: boolean;
  error: string | null;
  totalItemCount: number;
  cartTotalAmount: number;
  formattedCartTotal: string;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemModel[]>(readGuestCart);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);
  const syncingUserId = useRef<number | null>(null);
  const loadedUserId = useRef<number | null>(null);

  const fetchCart = useCallback(async (force = false) => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      requestId.current += 1;
      syncingUserId.current = null;
      loadedUserId.current = null;
      setCartItems(readGuestCart());
      setError(null);
      setIsLoading(false);
      return;
    }

    const userId = user?.id;
    if (!userId || syncingUserId.current === userId || (!force && loadedUserId.current === userId)) return;

    const currentRequestId = ++requestId.current;
    syncingUserId.current = userId;
    setIsLoading(true);
    setError(null);

    try {
      let items = await cartApi.getCart();
      const guestItems = readGuestCart();

      for (const guestItem of guestItems) {
        const existingItem = items.find((item) => item.productId === guestItem.productId);
        if (existingItem) {
          await cartApi.updateQuantity(guestItem.productId, existingItem.quantity + guestItem.quantity);
        } else {
          await cartApi.addToCart(guestItem.productId, guestItem.quantity);
        }
      }

      if (guestItems.length > 0) {
        items = await cartApi.getCart();
        saveGuestCart([]);
      }

      if (currentRequestId === requestId.current) {
        setCartItems(items);
        loadedUserId.current = userId;
      }
    } catch (err) {
      if (currentRequestId === requestId.current) {
        setError(err instanceof Error ? err.message : 'Failed to refresh your cart.');
        loadedUserId.current = userId;
      }
      throw err;
    } finally {
      if (currentRequestId === requestId.current) {
        syncingUserId.current = null;
        setIsLoading(false);
      }
    }
  }, [isAuthenticated, isAuthLoading, user?.id]);

  useEffect(() => {
    void fetchCart().catch(() => {});
  }, [fetchCart]);

  const addToCart = useCallback(async (productId: number, quantity = 1) => {
    setError(null);

    if (isAuthLoading) throw new Error('Your account is still loading. Try again in a moment.');

    if (!isAuthenticated) {
      try {
        const product = await productApi.getById(productId);
        if (product.isOutOfStock) throw new Error('This item is out of stock.');

        const guestItems = readGuestCart();
        const existingItem = guestItems.find((item) => item.productId === productId);
        const nextQuantity = (existingItem?.quantity ?? 0) + quantity;
        if (nextQuantity > product.stock) {
          throw new Error(`Only ${product.stock} of this item are currently available.`);
        }

        const updatedItem = new CartItemModel({
          cartItemId: productId,
          productId,
          name: product.name,
          price: product.price,
          quantity: nextQuantity,
          images: product.images,
          stock: product.stock,
        });
        const updatedItems = existingItem
          ? guestItems.map((item) => item.productId === productId ? updatedItem : item)
          : [...guestItems, updatedItem];

        saveGuestCart(updatedItems);
        setCartItems(updatedItems);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not add this item to your cart.');
        throw err;
      }
      return;
    }

    try {
      await cartApi.addToCart(productId, quantity);
      await fetchCart(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add this item to your cart.');
      throw err;
    }
  }, [fetchCart, isAuthenticated, isAuthLoading]);

  const removeItem = useCallback(async (productId: number) => {
    if (!isAuthenticated) {
      const updatedItems = readGuestCart().filter((item) => item.productId !== productId);
      saveGuestCart(updatedItems);
      setCartItems(updatedItems);
      setError(null);
      return;
    }

    setError(null);
    try {
      await cartApi.removeFromCart(productId);
      await fetchCart(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not remove this item from your cart.');
    }
  }, [fetchCart, isAuthenticated]);

  const updateQuantity = useCallback(async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }

    if (!isAuthenticated) {
      const guestItems = readGuestCart();
      const existingItem = guestItems.find((item) => item.productId === productId);
      if (!existingItem) return;
      if (quantity > existingItem.stock) {
        setError(`Only ${existingItem.stock} of this item are currently available.`);
        return;
      }

      const updatedItems = guestItems.map((item) => item.productId === productId
        ? new CartItemModel({ ...item, quantity })
        : item);
      saveGuestCart(updatedItems);
      setCartItems(updatedItems);
      setError(null);
      return;
    }

    setError(null);
    try {
      await cartApi.updateQuantity(productId, quantity);
      await fetchCart(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update the item quantity.');
    }
  }, [fetchCart, isAuthenticated, removeItem]);

  const clearCart = useCallback(async () => {
    if (!isAuthenticated) {
      saveGuestCart([]);
      setCartItems([]);
      setError(null);
      return;
    }

    const currentRequestId = ++requestId.current;
    setIsLoading(true);
    setError(null);

    try {
      await cartApi.clearCart();
      if (currentRequestId === requestId.current) {
        setCartItems([]);
        saveGuestCart([]);
      }
    } catch (err) {
      if (currentRequestId === requestId.current) {
        setError(err instanceof Error ? err.message : 'Could not clear your cart.');
      }
    } finally {
      if (currentRequestId === requestId.current) setIsLoading(false);
    }
  }, [isAuthenticated]);

  const totalItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotalAmount = cartItems.reduce((total, item) => total + item.subtotal, 0);
  const formattedCartTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cartTotalAmount);

  return (
    <CartContext.Provider value={{
      cartItems,
      isLoading: isLoading || isAuthLoading,
      error,
      totalItemCount,
      cartTotalAmount,
      formattedCartTotal,
      addToCart,
      updateQuantity,
      clearCart,
      refreshCart: fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};