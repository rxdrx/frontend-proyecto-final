import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../context/CartContext';
import { inventoryService } from '../services/inventoryService';
import '../assets/styles/ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { producto, loading, error } = useProduct(id);
  const { addToCart } = useCart();
  
  const [talleSeleccionado, setTalleSeleccionado] = useState(null);
  const [inventario, setInventario] = useState([]);
  const [loadingInventory, setLoadingInventory] = useState(true);
  const [mensaje, setMensaje] = useState('');

  // Cargar inventario del producto
  useEffect(() => {
    const fetchInventario = async () => {
      if (!id) return;
      
      try {
        setLoadingInventory(true);
        const data = await inventoryService.getByProduct(id);
        setInventario(data.data || []);
      } catch (err) {
        console.error('Error al cargar inventario:', err);
      } finally {
        setLoadingInventory(false);
      }
    };

    fetchInventario();
  }, [id]);

  const handleAddToCart = () => {
    if (!talleSeleccionado) {
      setMensaje('Por favor selecciona un talle');
      return;
    }

    const stockItem = inventario.find(inv => inv.talla === talleSeleccionado.toString());
    if (!stockItem || stockItem.cantidad_stock <= 0) {
      setMensaje('Talle sin stock disponible');
      return;
    }

    addToCart(producto, talleSeleccionado, 1);
    setMensaje('¡Producto agregado al carrito!');
    
    setTimeout(() => {
      setMensaje('');
    }, 3000);
  };

  const getTallesDisponibles = () => {
    return inventario
      .filter(inv => inv.cantidad_stock > 0)
      .map(inv => parseInt(inv.talla));
  };

  const istalleDisponible = (talle) => {
    const stockItem = inventario.find(inv => inv.talla === talle.toString());
    return stockItem && stockItem.cantidad_stock > 0;
  };

  if (loading || loadingInventory) {
    return (
      <MainLayout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando producto...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !producto) {
    return (
      <MainLayout>
        <div className="error-container">
          <p>{error || 'Producto no encontrado'}</p>
          <button onClick={() => navigate('/')}>Volver al inicio</button>
        </div>
      </MainLayout>
    );
  }

  const precioOriginal = producto.precio;
  const descuento = producto.porcentaje_descuento || 0;
  const precioFinal = precioOriginal - (precioOriginal * descuento / 100);
  const tallesDisponibles = getTallesDisponibles();

  return (
    <MainLayout>
      <div className="product-detail-page">
        <div className="product-detail-container">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Volver
          </button>

          <div className="product-detail-content">
            <div className="product-detail-image">
              <img src={producto.url_imagen} alt={producto.nombre} />
            </div>

            <div className="product-detail-info">
              <p className="product-detail-brand">{producto.marca}</p>
              <h1 className="product-detail-title">{producto.nombre}</h1>

              <div className="product-detail-pricing">
                {descuento > 0 ? (
                  <>
                    <p className="product-detail-price">
                      ${precioFinal.toLocaleString('es-AR')}
                    </p>
                    <p className="product-detail-original-price">
                      ${precioOriginal.toLocaleString('es-AR')}
                    </p>
                    <span className="product-detail-discount">-{descuento}%</span>
                  </>
                ) : (
                  <p className="product-detail-price">
                    ${precioOriginal.toLocaleString('es-AR')}
                  </p>
                )}
              </div>

              <p className="product-detail-description">
                {producto.descripcion}
              </p>

              {producto.color && (
                <p className="product-detail-specs">
                  <strong>Color:</strong> {producto.color}
                </p>
              )}

              {producto.material && (
                <p className="product-detail-specs">
                  <strong>Material:</strong> {producto.material}
                </p>
              )}

              <div className="size-selector">
                <h3 className="size-selector-title">
                  Selecciona tu talle
                  {tallesDisponibles.length === 0 && (
                    <span className="no-stock-message"> - Sin stock disponible</span>
                  )}
                </h3>
                <div className="size-grid">
                  {[36, 37, 38, 39, 40, 41, 42, 43, 44, 45].map((talle) => (
                    <button
                      key={talle}
                      className={`size-button ${talleSeleccionado === talle ? 'selected' : ''} ${!istalleDisponible(talle) ? 'disabled' : ''}`}
                      onClick={() => istalleDisponible(talle) && setTalleSeleccionado(talle)}
                      disabled={!istalleDisponible(talle)}
                    >
                      {talle}
                    </button>
                  ))}
                </div>
              </div>

              {mensaje && (
                <div className={`message ${mensaje.includes('agregado') ? 'success' : 'warning'}`}>
                  {mensaje}
                </div>
              )}

              <div className="product-actions">
                <button 
                  className="add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={!talleSeleccionado || tallesDisponibles.length === 0}
                >
                  {tallesDisponibles.length === 0 
                    ? 'Sin stock' 
                    : !talleSeleccionado 
                    ? 'Selecciona un talle' 
                    : 'Agregar al carrito'
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;