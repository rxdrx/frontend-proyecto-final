import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../assets/styles/MainLayout.css';

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartItemsCount } = useCart();
  const cartCount = getCartItemsCount();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="main-layout">
      <header className="header">
        <div className="header-container">
          <div className="logo" onClick={() => navigate('/')}>
            <span className="logo-text">CalzaStore</span>
          </div>

          <nav className="nav">
            <button 
              className={`nav-link ${isActive('/')}`}
              onClick={() => navigate('/')}
            >
              Inicio
            </button>
            <button 
              className={`nav-link ${isActive('/cart')}`}
              onClick={() => navigate('/cart')}
            >
              Carrito
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </button>
            <button 
              className={`nav-link ${isActive('/login')}`}
              onClick={() => navigate('/login')}
            >
              Iniciar Sesión
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3>Sobre Nosotros</h3>
            <p>Tu tienda de confianza para calzado de calidad</p>
          </div>
          <div className="footer-section">
            <h3>Contacto</h3>
            <p>Email: contacto@calzastore.com</p>
            <p>Tel: (123) 456-7890</p>
          </div>
          <div className="footer-section">
            <h3>Síguenos</h3>
            <p>Facebook | Instagram | Twitter</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 CalzaStore - Grupo 10 UTN</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;