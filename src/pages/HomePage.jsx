import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import ProductCard from '../components/products/ProductCard';
import FilterSidebar from '../components/products/FilterSidebar';
//import { productsService } from '../../services/api.service';
import '../assets/styles/HomePage.css';

const HomePage = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const productosMock = [
      { id_producto: 1, nombre: "Nike Air Max 270", marca: "Nike", precio: 25000, url_imagen: "https://via.placeholder.com/300x300?text=Nike+Air+Max" },
      { id_producto: 2, nombre: "Adidas Ultraboost", marca: "Adidas", precio: 28000, url_imagen: "https://via.placeholder.com/300x300?text=Adidas+Ultraboost" },
      { id_producto: 3, nombre: "Puma RS-X", marca: "Puma", precio: 18000, url_imagen: "https://via.placeholder.com/300x300?text=Puma+RS-X" },
      { id_producto: 4, nombre: "Reebok Classic", marca: "Reebok", precio: 15000, url_imagen: "https://via.placeholder.com/300x300?text=Reebok+Classic" },
      { id_producto: 5, nombre: "New Balance 574", marca: "New Balance", precio: 22000, url_imagen: "https://via.placeholder.com/300x300?text=New+Balance" },
      { id_producto: 6, nombre: "Converse Chuck Taylor", marca: "Converse", precio: 12000, url_imagen: "https://via.placeholder.com/300x300?text=Converse" },
    ];

    setTimeout(() => {
      setProductos(productosMock);
      setLoading(false);
    }, 500);
    /*
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const response = await productsService.getAll();
        setProductos(response.data || []);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
    */
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando productos...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="error-container">
          <p>{error}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="home-page">
        <div className="hero-banner">
          <div className="hero-content">
            <div className="hero-text-center">
              <h1 className="hero-title">
                Encuentra el Calzado Perfecto
              </h1>
              <p className="hero-subtitle">
                Las mejores marcas al mejor precio
              </p>
              <button className="hero-button">
                Ver Ofertas
              </button>
            </div>
          </div>
        </div>

        <div className="main-content">
          <div className="content-layout">
            <aside className="sidebar">
              <FilterSidebar />
            </aside>

            <div className="products-section">
              <div className="products-header">
                <h2 className="products-title">
                  Productos 
                  <span className="products-count">({productos.length})</span>
                </h2>
                <select className="sort-select">
                  <option>Menor Precio</option>
                  <option>Mayor Precio</option>
                </select>
              </div>

              <div className="products-grid">
                {productos.map((producto) => (
                  <ProductCard key={producto.id_producto} producto={producto} />))}</div>
              <div className="pagination">
              <nav className="pagination-nav">
              <button className="pagination-button">
                Anterior
              </button>
              <button className="pagination-button active">
                1
              </button>
              <button className="pagination-button">
                2
              </button>
              <button className="pagination-button">
                3
              </button>
              <button className="pagination-button">
                Siguiente
              </button>
            </nav>
          </div>
        </div>
      </div>
     </div>
     </div>
  </MainLayout>
  );
};

export default HomePage;