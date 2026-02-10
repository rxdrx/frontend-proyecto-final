import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  const [cartItems, setCartItems] = useState(() => {
    // Solo cargar carrito si hay sesión activa
    if (isAuthenticated && user) {
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // Guardar en localStorage cada vez que cambie el carrito (solo si hay sesión)
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated, user]);

  // Limpiar carrito cuando se cierra sesión
  useEffect(() => {
    if (!isAuthenticated) {
      setCartItems([]);
      // Limpiar todos los carritos del localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cart_')) {
          localStorage.removeItem(key);
        }
      });
    } else if (user) {
      // Cargar carrito del usuario cuando inicia sesión
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    }
  }, [isAuthenticated, user]);

  // Agregar producto al carrito
  const addToCart = (producto, talle, cantidad = 1) => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.id_producto === producto.id_producto && item.talle === talle
      );

      if (existingItem) {
        return prevItems.map(item =>
          item.id_producto === producto.id_producto && item.talle === talle
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      } else {
        return [...prevItems, { ...producto, talle, cantidad }];
      }
    });
  };

  // Eliminar producto del carrito
  const removeFromCart = (idProducto, talle) => {
    setCartItems(prevItems =>
      prevItems.filter(
        item => !(item.id_producto === idProducto && item.talle === talle)
      )
    );
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (idProducto, talle, cantidad) => {
    if (cantidad <= 0) {
      removeFromCart(idProducto, talle);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id_producto === idProducto && item.talle === talle
          ? { ...item, cantidad }
          : item
      )
    );
  };

  // Limpiar carrito
  const clearCart = () => {
    setCartItems([]);
    if (user) {
      localStorage.removeItem(`cart_${user.id}`);
    }
  };

  // Calcular total del carrito
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const precio = item.precio || 0;
      const descuento = item.porcentaje_descuento || 0;
      const precioFinal = precio - (precio * descuento / 100);
      return total + (precioFinal * item.cantidad);
    }, 0);
  };

  // Obtener cantidad total de items
  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.cantidad, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};