import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/styles/MainLayout.css';

const MainLayout = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="main-layout">
      <header className="header">
        <nav className="header-nav">
          <div className="header-content">
            <Link to="/" className="logo">
              <div className="logo-text">Tienda de calzado</div>
            </Link>

            <div className="search-bar">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="search-input"
              />
            </div>

            <div className="nav-links">
              <Link to="/auth" className="nav-link">
                Iniciar Sesión
              </Link>
              <button 
                //onClick={() => navigate('/cart')}
                className="cart-button"
              >
                <svg className="cart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="cart-badge"></span>
              </button>
            </div>
          </div>
        </nav>

        <div className="categories-bar">
          <div className="categories-content">
            <div className="categories-list">
              <button className="category-button">Todas</button>
              <button className="category-button">Zapatillas Deportivas</button>
              <button className="category-button">Zapatos Formales</button>
              <button className="category-button">Botas</button>
              <button className="category-button">Sandalias</button>
              <button className="category-button">Zapatillas Urbanas</button>
            </div>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-grid">
            <div>
              <h4 className="footer-section-title">Tienda de calzado</h4>
              <p className="footer-description">
                Tu tienda online de calzado de confianza
              </p>
            </div>
            <div>
              <h4 className="footer-section-title">Atención al Cliente</h4>
              <ul className="footer-list">
                <li><a href="#" className="footer-link">Contacto</a></li>
                <li><a href="#" className="footer-link">Preguntas Frecuentes</a></li>
                <li><a href="#" className="footer-link">Cambios y Devoluciones</a></li>
              </ul>
            </div>
            <div>
              <h4 className="footer-section-title">Información</h4>
              <ul className="footer-list">
                <li><a href="#" className="footer-link">Sobre Nosotros</a></li>
                <li><a href="#" className="footer-link">Términos y Condiciones</a></li>
                <li><a href="#" className="footer-link">Política de Privacidad</a></li>
              </ul>
            </div>
            <div>
              <h4 className="footer-section-title">Síguenos</h4>
              <ul className="footer-list">
                <li><a href="#" className="footer-link">Facebook</a></li>
                <li><a href="#" className="footer-link">Instagram</a></li>
                <li><a href="#" className="footer-link">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Tienda de Calzado - Grupo 10 UTN Bahía Blanca</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;