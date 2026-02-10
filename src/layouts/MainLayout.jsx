import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../assets/styles/MainLayout.css';

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartItemsCount } = useCart();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const cartCount = getCartItemsCount();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    setShowUserMenu(false);
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/profile');
    }
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
            
            {isAuthenticated ? (
              <div className="user-menu-container">
                <button 
                  className="nav-link user-button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  {user?.nombre || 'Usuario'}
                </button>
                
                {showUserMenu && (
                  <div className="user-dropdown">
                    <button 
                      className="dropdown-item"
                      onClick={handleProfileClick}
                    >
                      {isAdmin ? 'Panel Admin' : 'Mi Perfil'}
                    </button>
                    <button 
                      className="dropdown-item logout"
                      onClick={handleLogout}
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                className={`nav-link ${isActive('/login')}`}
                onClick={() => navigate('/login')}
              >
                Iniciar Sesión
              </button>
            )}
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