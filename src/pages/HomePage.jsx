import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import ProductCard from '../components/products/ProductCard';
import FilterSidebar from '../components/products/FilterSidebar';
import { useProducts } from '../hooks/useProducts';
import '../assets/styles/HomePage.css';

const HomePage = () => {
  const [filters, setFilters] = useState({});
  const [paginaActual, setPaginaActual] = useState(1);
  const [sortOrder, setSortOrder] = useState(''); // <-- AGREGAR
  const [showOnlyOffers, setShowOnlyOffers] = useState(false); // <-- AGREGAR
  const productosPorPagina = 8;

  const { productos, loading, error } = useProducts(filters);

  // Filtrar productos con ofertas si showOnlyOffers está activo
  let productosFiltrados = showOnlyOffers 
    ? (productos || []).filter(p => p.porcentaje_descuento > 0)
    : (productos || []);

  // Ordenar productos según sortOrder
  if (sortOrder === 'asc') {
    productosFiltrados = [...productosFiltrados].sort((a, b) => a.precio - b.precio);
  } else if (sortOrder === 'desc') {
    productosFiltrados = [...productosFiltrados].sort((a, b) => b.precio - a.precio);
  }

  // Calcular productos a mostrar
  const indiceUltimo = paginaActual * productosPorPagina;
  const indicePrimero = indiceUltimo - productosPorPagina;
  const productosActuales = (productosFiltrados || []).slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  const cambiarPagina = (numero) => {
    setPaginaActual(numero);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPaginaActual(1);
    setShowOnlyOffers(false); // Resetear ofertas al cambiar filtros
  };

  const handleShowOffers = () => {
    setShowOnlyOffers(true);
    setPaginaActual(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          <button onClick={() => window.location.reload()}>Reintentar</button>
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
              <button className="hero-button" onClick={handleShowOffers}>
                Ver Ofertas
              </button>
            </div>
          </div>
        </div>

        <div className="main-content">
          <div className="content-layout">
            <aside className="sidebar">
              <FilterSidebar onFilterChange={handleFilterChange} />
            </aside>

            <div className="products-section">
              <div className="products-header">
                <h2 className="products-title">
                  {showOnlyOffers ? 'Ofertas ' : 'Productos '}
                  <span className="products-count">({productosFiltrados.length})</span>
                </h2>
                <select 
                  className="sort-select"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="">Ordenar por</option>
                  <option value="asc">Menor Precio</option>
                  <option value="desc">Mayor Precio</option>
                </select>
              </div>

              {showOnlyOffers && (
                <div className="offers-banner">
                  <p>Mostrando solo productos en oferta</p>
                  <button onClick={() => setShowOnlyOffers(false)} className="clear-offers-btn">
                    Ver todos los productos
                  </button>
                </div>
              )}

              {productosActuales.length === 0 ? (
                <div className="no-products">
                  <p>No se encontraron productos con los filtros seleccionados</p>
                </div>
              ) : (
                <>
                  <div className="products-grid">
                    {productosActuales.map((producto) => (
                      <ProductCard key={producto.id_producto} producto={producto} />
                    ))}
                  </div>

                  {totalPaginas > 1 && (
                    <div className="pagination">
                      <nav className="pagination-nav">
                        <button 
                          className="pagination-button"
                          onClick={() => cambiarPagina(paginaActual - 1)}
                          disabled={paginaActual === 1}
                        >
                          Anterior
                        </button>
                        {[...Array(totalPaginas)].map((_, index) => (
                          <button
                            key={index + 1}
                            className={`pagination-button ${paginaActual === index + 1 ? 'active' : ''}`}
                            onClick={() => cambiarPagina(index + 1)}
                          >
                            {index + 1}
                          </button>
                        ))}
                        <button 
                          className="pagination-button"
                          onClick={() => cambiarPagina(paginaActual + 1)}
                          disabled={paginaActual === totalPaginas}
                        >
                          Siguiente
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;