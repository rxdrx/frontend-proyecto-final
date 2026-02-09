import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import '../../assets/styles/ProductCard.css';

const ProductCard = ({ producto }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    // Agregar con talle por defecto (40) para quick add
    addToCart(producto, 40, 1);
  };

  const precioOriginal = producto.precio;
  const descuento = producto.porcentaje_descuento || 0;
  const precioFinal = precioOriginal - (precioOriginal * descuento / 100);

  return (
    <div 
      className="product-card"
      onClick={() => navigate(`/product/${producto.id_producto}`)}
    >
      {descuento > 0 && (
        <span className="discount-badge">-{descuento}%</span>
      )}
      
      <div className="product-image-container">
        <img
          src={producto.url_imagen || 'https://via.placeholder.com/300x300?text=Producto'}
          alt={producto.nombre}
          className="product-image"
        />
      </div>

      <div className="product-info">
        <p className="product-brand">{producto.marca}</p>
        <h3 className="product-name">{producto.nombre}</h3>
        
        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="star-icon" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="rating-count">(45)</span>
        </div>

        <div className="product-footer">
          <div className="product-prices">
            {descuento > 0 ? (
              <>
                <p className="current-price">
                  ${precioFinal.toLocaleString('es-AR')}
                </p>
                <p className="original-price">
                  ${precioOriginal.toLocaleString('es-AR')}
                </p>
              </>
            ) : (
              <p className="regular-price">
                ${precioOriginal.toLocaleString('es-AR')}
              </p>
            )}
          </div>
          <button
            onClick={handleQuickAdd}
            className="add-to-cart-button"
            title="Agregar al carrito (talle 40)"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;