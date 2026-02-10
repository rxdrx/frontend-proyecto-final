import React, { useState, useEffect } from 'react';
import { useCategories } from '../../hooks/useCategories';
import '../../assets/styles/FilterSidebar.css';

const FilterSidebar = ({ onFilterChange, currentFilters = {} }) => {
  const { categorias, loading } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  // Sincronizar el estado interno con los filtros actuales
  useEffect(() => {
    setSelectedCategory(currentFilters.categoria || '');
    setPriceMin(currentFilters.precio_min || '');
    setPriceMax(currentFilters.precio_max || '');
  }, [currentFilters]);

  const handleApplyFilters = () => {
    const filters = {};
    
    if (selectedCategory) {
      filters.categoria = selectedCategory;
    }
    if (priceMin) {
      filters.precio_min = priceMin;
    }
    if (priceMax) {
      filters.precio_max = priceMax;
    }

    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    setSelectedCategory('');
    setPriceMin('');
    setPriceMax('');
    onFilterChange({});
  };

  return (
    <div className="filter-sidebar">
      <div className="filter-header">
        <h3>Filtros</h3>
        <button onClick={handleClearFilters} className="clear-filters">
          Limpiar
        </button>
      </div>

      <div className="filter-section">
        <h4>Categorías</h4>
        {loading ? (
          <p>Cargando categorías...</p>
        ) : (
          <div className="filter-options">
            <label className="filter-option">
              <input
                type="radio"
                name="categoria"
                value=""
                checked={selectedCategory === ''}
                onChange={(e) => setSelectedCategory(e.target.value)}
              />
              <span>Todas</span>
            </label>
            {categorias.map((cat) => (
              <label key={cat.id_categoria} className="filter-option">
                <input
                  type="radio"
                  name="categoria"
                  value={cat.id_categoria.toString()}
                  checked={selectedCategory === cat.id_categoria.toString()}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                />
                <span>{cat.nombre}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="filter-section">
        <h4>Rango de Precio</h4>
        <div className="price-inputs">
          <input
            type="number"
            placeholder="Mínimo"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="price-input"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Máximo"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="price-input"
          />
        </div>
      </div>

      <button onClick={handleApplyFilters} className="apply-filters-btn">
        Aplicar Filtros
      </button>
    </div>
  );
};

export default FilterSidebar;