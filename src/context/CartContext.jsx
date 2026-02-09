import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Cargar carrito desde localStorage
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Guardar en localStorage cada vez que cambie el carrito
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Agregar producto al carrito
  const addToCart = (producto, talle, cantidad = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.id_producto === producto.id_producto && item.talle === talle
      );

      if (existingItem) {
        // Si ya existe, incrementar cantidad
        return prevItems.map(item =>
          item.id_producto === producto.id_producto && item.talle === talle
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      } else {
        // Agregar nuevo item
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

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};