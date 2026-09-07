"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import type { ProductId } from "@/lib/products";
import {
  addQuantity,
  decreaseQuantity,
  emptyCart,
  getCartItemCount,
  getLineQuantity,
  readCart,
  removeProduct,
  type CartState,
  writeCart
} from "@/lib/cart";

interface CartContextValue {
  cart: CartState;
  hydrated: boolean;
  itemCount: number;
  addItem: (productId: ProductId) => void;
  decreaseItem: (productId: ProductId) => void;
  removeItem: (productId: ProductId) => void;
  clearCart: () => void;
  getQuantity: (productId: ProductId) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartState>(emptyCart);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(readCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeCart(cart);
  }, [cart, hydrated]);

  const addItem = useCallback((productId: ProductId) => {
    setCart((current) => ({ lines: addQuantity(current.lines, productId) }));
  }, []);

  const decreaseItem = useCallback((productId: ProductId) => {
    setCart((current) => ({ lines: decreaseQuantity(current.lines, productId) }));
  }, []);

  const removeItem = useCallback((productId: ProductId) => {
    setCart((current) => ({ lines: removeProduct(current.lines, productId) }));
  }, []);

  const clearCart = useCallback(() => {
    setCart(emptyCart);
  }, []);

  const getQuantity = useCallback(
    (productId: ProductId) => getLineQuantity(cart.lines, productId),
    [cart.lines]
  );

  const value = useMemo(
    () => ({
      cart,
      hydrated,
      itemCount: getCartItemCount(cart.lines),
      addItem,
      decreaseItem,
      removeItem,
      clearCart,
      getQuantity
    }),
    [cart, hydrated, addItem, decreaseItem, removeItem, clearCart, getQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
