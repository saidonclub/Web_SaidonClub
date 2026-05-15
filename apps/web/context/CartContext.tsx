"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getCartCount } from "@/app/carrito/actions";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [serverTotal, setServerTotal] = useState<number | null>(null);

  const refreshCart = useCallback(async () => {
    const serverCount = await getCartCount();
    if (serverCount > 0) {
      setServerTotal(serverCount);
    }
  }, []);

  // Cargar carrito de localStorage al iniciar
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedCart = localStorage.getItem("saidonclub_cart");
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (parseError) {
          console.error("Error parsing cart from localStorage", parseError);
        }
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
    refreshCart();
  }, [refreshCart]);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem("saidonclub_cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    // Si estuviéramos logueados, el server action ya se encargó del DB.
    // Aquí solo refrescamos el count visual.
    setTimeout(refreshCart, 500);
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((i) => i.id !== id));
    setTimeout(refreshCart, 500);
  };

  const clearCart = () => {
    setCart([]);
    setServerTotal(0);
  };

  const totalItems =
    serverTotal !== null
      ? serverTotal
      : cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        totalItems,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
