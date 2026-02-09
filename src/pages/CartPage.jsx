import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useCart } from '../context/CartContext';
import '../assets/styles/CartPage.css';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState({
    calle: '',
    ciudad: '',
    provincia: '',
    codigo_postal: '',
    metodo_pago: 'tarjeta'
  });

  const handleQuantityChange = (idProducto, talle, newQuantity) => {
    const quantity = parseInt(newQuantity);
    if (quantity >= 1) {
      updateQuantity(idProducto, talle, quantity);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckout = () => {
    // Validación simple
    if (!formData.calle || !formData.ciudad || !formData.provincia || !formData.codigo_postal) {
      alert('Por favor completa todos los campos de dirección');
      return;
    }

    // Aquí iría la lógica para crear el pedido
    alert('Funcionalidad de checkout - Por implementar con autenticación');
    // En producción: 
    // 1. Verificar que el usuario esté autenticado
    // 2. Crear pedido con orderService.create()
    // 3. Crear items del pedido
    // 4. Limpiar carrito
    // 5. Redirigir a página de confirmación
  };

  const subtotal = getCartTotal();
  const envio = subtotal > 0 ? 2500 : 0; // Envío gratis si no hay productos
  const total = subtotal + envio;

  if (cartItems.length === 0) {
    return (
      <MainLayout>
        <div className="cart-page">
          <div className="empty-cart">
            <svg className="empty-cart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2>Tu carrito está vacío</h2>
            <p>¡Agrega productos para comenzar tu compra!</p>
            <button onClick={() => navigate('/')} className="continue-shopping-btn">
              Ir a la tienda
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="cart-page">
        <div className="cart-container">
          <h1 className="cart-title">Carrito de Compras</h1>

          <div className="cart-content">
            <div className="cart-items-section">
              {cartItems.map((item) => {
                const precioOriginal = item.precio;
                const descuento = item.porcentaje_descuento || 0;
                const precioFinal = precioOriginal - (precioOriginal * descuento / 100);

                return (
                  <div key={`${item.id_producto}-${item.talle}`} className="cart-item">
                    <img 
                      src={item.url_imagen || 'https://via.placeholder.com/150'} 
                      alt={item.nombre}
                      className="cart-item-image"
                    />
                    
                    <div className="cart-item-details">
                      <h3 className="cart-item-name">{item.nombre}</h3>
                      <p className="cart-item-brand">{item.marca}</p>
                      <p className="cart-item-size">Talle: {item.talle}</p>
                      {item.color && <p className="cart-item-color">Color: {item.color}</p>}
                    </div>

                    <div className="cart-item-quantity">
                      <label>Cantidad:</label>
                      <input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) => handleQuantityChange(item.id_producto, item.talle, e.target.value)}
                        className="quantity-input"
                      />
                    </div>

                    <div className="cart-item-price">
                      {descuento > 0 ? (
                        <>
                          <p className="price-final">${(precioFinal * item.cantidad).toLocaleString('es-AR')}</p>
                          <p className="price-original">${(precioOriginal * item.cantidad).toLocaleString('es-AR')}</p>
                        </>
                      ) : (
                        <p className="price-final">${(precioOriginal * item.cantidad).toLocaleString('es-AR')}</p>
                      )}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id_producto, item.talle)}
                      className="remove-item-btn"
                      title="Eliminar del carrito"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}

              <button onClick={clearCart} className="clear-cart-btn">
                Vaciar carrito
              </button>
            </div>

            <div className="cart-summary">
              <h2 className="summary-title">Resumen del Pedido</h2>
              
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${subtotal.toLocaleString('es-AR')}</span>
              </div>

              <div className="summary-row">
                <span>Envío:</span>
                <span>{envio === 0 ? 'Gratis' : `$${envio.toLocaleString('es-AR')}`}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total">
                <span>Total:</span>
                <span>${total.toLocaleString('es-AR')}</span>
              </div>

              {!showCheckout ? (
                <button 
                  onClick={() => setShowCheckout(true)}
                  className="checkout-btn"
                >
                  Proceder al Pago
                </button>
              ) : (
                <div className="checkout-form">
                  <h3>Información de Envío</h3>
                  
                  <input
                    type="text"
                    name="calle"
                    placeholder="Calle y número"
                    value={formData.calle}
                    onChange={handleInputChange}
                    className="form-input"
                  />

                  <input
                    type="text"
                    name="ciudad"
                    placeholder="Ciudad"
                    value={formData.ciudad}
                    onChange={handleInputChange}
                    className="form-input"
                  />

                  <input
                    type="text"
                    name="provincia"
                    placeholder="Provincia"
                    value={formData.provincia}
                    onChange={handleInputChange}
                    className="form-input"
                  />

                  <input
                    type="text"
                    name="codigo_postal"
                    placeholder="Código Postal"
                    value={formData.codigo_postal}
                    onChange={handleInputChange}
                    className="form-input"
                  />

                  <select
                    name="metodo_pago"
                    value={formData.metodo_pago}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                    <option value="transferencia">Transferencia Bancaria</option>
                    <option value="efectivo">Efectivo contra entrega</option>
                  </select>

                  <button onClick={handleCheckout} className="confirm-checkout-btn">
                    Confirmar Pedido
                  </button>

                  <button 
                    onClick={() => setShowCheckout(false)}
                    className="cancel-checkout-btn"
                  >
                    Cancelar
                  </button>
                </div>
              )}

              <button 
                onClick={() => navigate('/')}
                className="continue-shopping-link"
              >
                ← Continuar comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;