import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import '../assets/styles/CartPage.css';

const CartPage = () => {
  const navigate = useNavigate();

  // 3 productos mockeados estáticos
  const carritoMock = [
    { 
      id_producto: 1, 
      nombre: "Nike Air Max 270", 
      marca: "Nike", 
      precio: 25000, 
      url_imagen: "https://m.media-amazon.com/images/I/61TpwR4jLIL.jpg",
      talle: 42,
      cantidad: 1
    },
    { 
      id_producto: 2, 
      nombre: "Adidas Ultraboost", 
      marca: "Adidas", 
      precio: 28000, 
      url_imagen: "https://m.media-amazon.com/images/I/51UQ1rYgFFL._AC_SL1000_.jpg",
      talle: 40,
      cantidad: 2
    },
    { 
      id_producto: 5, 
      nombre: "New Balance 574", 
      marca: "New Balance", 
      precio: 22000, 
      url_imagen: "https://www.newbalance.com.ar/on/demandware.static/-/Sites-siteCatalog_NBEU/default/dw6eaffbdb/new_images/N1T000089408/N1T000089408-IMAGE-1.webp",
      talle: 41,
      cantidad: 1
    }
  ];

  const totalPrecio = carritoMock.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  return (
    <MainLayout>
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-header">
            <h1>Carrito de Compras</h1>
          </div>

          <div className="cart-content">
            <div className="cart-items">
              {carritoMock.map((item) => (
                <div key={`${item.id_producto}-${item.talle}`} className="cart-item">
                  <img src={item.url_imagen} alt={item.nombre} className="cart-item-image" />
                  
                  <div className="cart-item-details">
                    <h3>{item.nombre}</h3>
                    <p className="cart-item-brand">{item.marca}</p>
                    <p className="cart-item-size">Talle: {item.talle}</p>
                  </div>

                  <div className="cart-item-quantity">
                    <span className="quantity-label">Cantidad:</span>
                    <span className="quantity-value">{item.cantidad}</span>
                  </div>

                  <div className="cart-item-price">
                    <p className="item-price">${(item.precio * item.cantidad).toLocaleString('es-AR')}</p>
                    <p className="item-unit-price">${item.precio.toLocaleString('es-AR')} c/u</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Resumen del Pedido</h2>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${totalPrecio.toLocaleString('es-AR')}</span>
              </div>
              <div className="summary-row">
                <span>Envío:</span>
                <span>Gratis</span>
              </div>
              <div className="summary-total">
                <span>Total:</span>
                <span>${totalPrecio.toLocaleString('es-AR')}</span>
              </div>
              <button className="checkout-btn">
                Finalizar Compra
              </button>
              <button onClick={() => navigate('/')} className="continue-shopping-btn">
                Continuar Comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;