import React, { useState } from 'react';
import '../../assets/styles/FilterSidebar.css';

const FilterSidebar = () => {
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');

  const categorias = [
    "Zapatillas deportivas",
    "Zapatos formales",
    "Botas",
    "Sandalias",
    "Zapatillas urbanas"
  ];

  const marcas = ["Nike", "Adidas", "Puma", "Topper", "Reef"];

  const colores = [
    { nombre: 'Negro', codigo: '#000000' },
    { nombre: 'Blanco', codigo: '#FFFFFF' },
    { nombre: 'Rojo', codigo: '#EF4444' },
    { nombre: 'Azul', codigo: '#3B82F6' },
    { nombre: 'Verde', codigo: '#10B981' },
    { nombre: 'Gris', codigo: '#6B7280' },
  ];

  return (
    <div className="filter-sidebar">
      <h2 className="filter-title">Filtros</h2>

      <div className="filter-section">
        <h3 className="filter-section-title">Categorías</h3>
        <div className="filter-options">
          {categorias.map((cat) => (
            <label key={cat} className="filter-checkbox-label">
              <input type="checkbox" className="filter-checkbox" />
              <span className="filter-text">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3 className="filter-section-title">Marcas</h3>
        <div className="filter-options">
          {marcas.map((marca) => (
            <label key={marca} className="filter-checkbox-label">
              <input type="checkbox" className="filter-checkbox" />
              <span className="filter-text">{marca}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3 className="filter-section-title">Precio</h3>
        <div className="price-inputs">
          <div className="price-input-group">
            <label>Mínimo</label>
            <input
              type="number"
              min="0"
              value={precioMin}
              onChange={(e) => setPrecioMin(e.target.value)}
              className="price-input"
              placeholder="$0"
            />
          </div>
          <div className="price-input-group">
            <label>Máximo</label>
            <input
              type="number"
              min="0"
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value)}
              className="price-input"
              placeholder="$100000"
            />
          </div>
        </div>
      </div>

      <div className="filter-section">
        <h3 className="filter-section-title">Tallas</h3>
        <div className="size-grid">
          {['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'].map((talla) => (
            <button key={talla} className="size-button">
              {talla}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3 className="filter-section-title">Color</h3>
        <div className="color-options">
          {colores.map((color) => (
            <button
              key={color.nombre}
              className="color-button"
              style={{ 
                backgroundColor: color.codigo,
                border: color.codigo === '#FFFFFF' ? '2px solid #d1d5db' : 'none'
              }}
              title={color.nombre}
            />
          ))}
        </div>
      </div>

      <div className="filter-actions">
        <button className="apply-filters-button">
          Aplicar Filtros
        </button>
        <button className="clear-filters-button">
          Limpiar Filtros
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;