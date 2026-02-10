import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import '../assets/styles/CartPage.css';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para realizar una compra');
      navigate('/login');
      return;
    }
    setShowCheckout(true);
  };

  const handleCheckout = async () => {
    // Validación de campos
    if (!formData.calle || !formData.ciudad || !formData.provincia || !formData.codigo_postal) {
      alert('Por favor completa todos los campos de dirección');
      return;
    }

    setIsProcessing(true);

    try {
      const subtotal = getCartTotal();
      const envio = subtotal > 0 ? 2500 : 0;
      const total = subtotal + envio;

      // Crear el pedido
      const orderData = {
        id_usuario: user.id,
        monto_total: total,
        calle: formData.calle,
        ciudad: formData.ciudad,
        provincia: formData.provincia,
        codigo_postal: formData.codigo_postal,
        pais: 'Argentina',
        metodo_pago: formData.metodo_pago
      };

      const result = await orderService.createOrder(orderData, cartItems);

      if (result.success) {
        // Limpiar el carrito
        clearCart();
        
        // Mostrar mensaje de éxito
        alert(`¡Pedido confirmado! 
        
Número de pedido: #${result.pedido.id_pedido}
Total: $${total.toLocaleString('es-AR')}

Recibirás un correo de confirmación en ${user.correo}`);
        
        // Redirigir al inicio o a una página de confirmación
        navigate('/');
      }
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      alert('Hubo un error al procesar tu pedido. Por favor, intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = getCartTotal();
  const envio = subtotal > 0 ? 2500 : 0;
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
                      <p className="cart-item-info">Talle: {item.talle}</p>
                      {item.color && <p className="cart-item-info">Color: {item.color}</p>}
                    </div>

                    <div className="cart-item-quantity">
                      <label className="quantity-label">Cantidad</label>
                      <div className="quantity-controls">
                        <button 
                          onClick={() => handleQuantityChange(item.id_producto, item.talle, item.cantidad - 1)}
                          className="quantity-btn"
                          disabled={item.cantidad <= 1}
                        >
                          −
                        </button>
                        <span className="quantity-value">{item.cantidad}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.id_producto, item.talle, item.cantidad + 1)}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="cart-item-price">
                      <p className="price-final">${(precioFinal * item.cantidad).toLocaleString('es-AR')}</p>
                      {descuento > 0 && (
                        <p className="price-original">${(precioOriginal * item.cantidad).toLocaleString('es-AR')}</p>
                      )}
                      {item.cantidad > 1 && (
                        <p className="price-unit">
                          ${precioFinal.toLocaleString('es-AR')} c/u
                        </p>
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

              <div className="cart-actions">
                <button onClick={clearCart} className="clear-cart-btn">
                  🗑️ Vaciar carrito
                </button>
                <button onClick={() => navigate('/')} className="continue-shopping-link">
                  ← Seguir comprando
                </button>
              </div>
            </div>

            <div className="cart-summary">
              <h2 className="summary-title">Resumen del Pedido</h2>
              
              <div className="summary-items">
                <div className="summary-row">
                  <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.cantidad, 0)} productos)</span>
                  <span className="summary-value">${subtotal.toLocaleString('es-AR')}</span>
                </div>

                <div className="summary-row">
                  <span>Envío</span>
                  <span className="summary-value shipping">{envio === 0 ? 'Gratis' : `$${envio.toLocaleString('es-AR')}`}</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row summary-total">
                  <span>Total</span>
                  <span className="total-value">${total.toLocaleString('es-AR')}</span>
                </div>
              </div>

              {!showCheckout ? (
                <>
                  {!isAuthenticated && (
                    <div className="auth-warning">
                      <p>⚠️ Debes iniciar sesión para continuar</p>
                    </div>
                  )}
                  <button 
                    onClick={handleProceedToCheckout}
                    className="checkout-btn"
                  >
                    {isAuthenticated ? 'Proceder al Pago' : 'Iniciar Sesión para Comprar'}
                  </button>
                </>
              ) : (
                <div className="checkout-form">
                  <h3 className="form-title">📦 Información de Envío</h3>
                  
                  <div className="user-info">
                    <p><strong>Cliente:</strong> {user?.nombre} {user?.apellido}</p>
                    <p><strong>Email:</strong> {user?.correo}</p>
                  </div>

                  <div className="form-group">
                    <label>Calle y Número *</label>
                    <input
                      type="text"
                      name="calle"
                      placeholder="Ej: Av. Corrientes 1234"
                      value={formData.calle}
                      onChange={handleInputChange}
                      className="form-input"
                      disabled={isProcessing}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Ciudad *</label>
                      <input
                        type="text"
                        name="ciudad"
                        placeholder="Ej: Buenos Aires"
                        value={formData.ciudad}
                        onChange={handleInputChange}
                        className="form-input"
                        disabled={isProcessing}
                      />
                    </div>

                    <div className="form-group">
                      <label>Provincia *</label>
                      <input
                        type="text"
                        name="provincia"
                        placeholder="Ej: CABA"
                        value={formData.provincia}
                        onChange={handleInputChange}
                        className="form-input"
                        disabled={isProcessing}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Código Postal *</label>
                    <input
                      type="text"
                      name="codigo_postal"
                      placeholder="Ej: 1000"
                      value={formData.codigo_postal}
                      onChange={handleInputChange}
                      className="form-input"
                      disabled={isProcessing}
                    />
                  </div>

                  <div className="form-group">
                    <label>Método de Pago *</label>
                    <select
                      name="metodo_pago"
                      value={formData.metodo_pago}
                      onChange={handleInputChange}
                      className="form-input"
                      disabled={isProcessing}
                    >
                      <option value="tarjeta">💳 Tarjeta de Crédito/Débito</option>
                      <option value="transferencia">🏦 Transferencia Bancaria</option>
                      <option value="efectivo">💵 Efectivo contra entrega</option>
                    </select>
                  </div>

                  <button 
                    onClick={handleCheckout} 
                    className="confirm-checkout-btn"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Procesando...' : `✓ Confirmar Pedido - $${total.toLocaleString('es-AR')}`}
                  </button>

                  <button 
                    onClick={() => setShowCheckout(false)}
                    className="cancel-checkout-btn"
                    disabled={isProcessing}
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;