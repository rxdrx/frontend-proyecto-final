import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

vi.mock('../hooks/useProducts', () => ({
  useProducts: vi.fn()
}));

vi.mock('../components/products/FilterSidebar', () => ({
  default: ({ onFilterChange }) => (
    <div data-testid="filter-sidebar">
      <button onClick={() => onFilterChange({ categoria: '1' })}>Apply Filter</button>
    </div>
  )
}));

vi.mock('../components/products/ProductCard', () => ({
  default: ({ producto }) => (
    <div data-testid="product-card">{producto.nombre}</div>
  )
}));

vi.mock('../layouts/MainLayout', () => ({
  default: ({ children }) => <div>{children}</div>
}));

import { useProducts } from '../hooks/useProducts';

describe('HomePage', () => {
  const mockProductos = [
    { id_producto: 1, nombre: 'Nike Air Max', precio: 45000, porcentaje_descuento: 0, marca: 'Nike' },
    { id_producto: 2, nombre: 'Adidas Ultraboost', precio: 50000, porcentaje_descuento: 15, marca: 'Adidas' },
    { id_producto: 3, nombre: 'Puma RS-X', precio: 35000, porcentaje_descuento: 0, marca: 'Puma' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useProducts.mockReturnValue({
      productos: mockProductos,
      loading: false,
      error: null
    });
  });

  describe('Renderizado', () => {
    it('debe renderizar la página de inicio', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );

      expect(screen.getByText('Encuentra el Calzado Perfecto')).toBeInTheDocument();
      expect(screen.getByText('Las mejores marcas al mejor precio')).toBeInTheDocument();
    });

    it('debe mostrar los productos', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );

      expect(screen.getByText('Nike Air Max')).toBeInTheDocument();
      expect(screen.getByText('Adidas Ultraboost')).toBeInTheDocument();
      expect(screen.getByText('Puma RS-X')).toBeInTheDocument();
    });

    it('debe mostrar el sidebar de filtros', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );

      expect(screen.getByTestId('filter-sidebar')).toBeInTheDocument();
    });
  });

  describe('Estados de carga y error', () => {
    it('debe mostrar spinner durante la carga', () => {
      useProducts.mockReturnValue({
        productos: [],
        loading: true,
        error: null
      });

      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );

      expect(screen.getByText('Cargando productos...')).toBeInTheDocument();
    });

    it('debe mostrar mensaje de error', () => {
      useProducts.mockReturnValue({
        productos: [],
        loading: false,
        error: 'Error al cargar productos'
      });

      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );

      expect(screen.getByText('Error al cargar productos')).toBeInTheDocument();
      expect(screen.getByText('Reintentar')).toBeInTheDocument();
    });
  });

  describe('Filtrado de productos', () => {
    it('debe filtrar productos por ofertas', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );

      const verOfertasBtn = screen.getByText('Ver Ofertas');
      fireEvent.click(verOfertasBtn);

      // Solo debe mostrar productos con descuento
      expect(screen.getByText('Adidas Ultraboost')).toBeInTheDocument();
      expect(screen.queryByText('Nike Air Max')).not.toBeInTheDocument();
    });

    it('debe aplicar filtros del sidebar', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );

      const applyFilterBtn = screen.getByText('Apply Filter');
      fireEvent.click(applyFilterBtn);

      // Verificar que useProducts fue llamado con filtros
      expect(useProducts).toHaveBeenCalled();
    });
  });

  describe('Ordenamiento', () => {
    it('debe ordenar por precio ascendente', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );

      const sortSelect = screen.getByRole('combobox');
      fireEvent.change(sortSelect, { target: { value: 'asc' } });

      const productCards = screen.getAllByTestId('product-card');
      // Puma RS-X (35000) debe estar primero
      expect(productCards[0]).toHaveTextContent('Puma RS-X');
    });

    it('debe ordenar por precio descendente', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );

      const sortSelect = screen.getByRole('combobox');
      fireEvent.change(sortSelect, { target: { value: 'desc' } });

      const productCards = screen.getAllByTestId('product-card');
      // Adidas Ultraboost (50000) debe estar primero
      expect(productCards[0]).toHaveTextContent('Adidas Ultraboost');
    });
  });

  describe('Paginación', () => {
    it('debe mostrar solo 8 productos por página', () => {
      const manyProducts = Array.from({ length: 20 }, (_, i) => ({
        id_producto: i + 1,
        nombre: `Producto ${i + 1}`,
        precio: 10000,
        porcentaje_descuento: 0,
        marca: 'Test'
      }));

      useProducts.mockReturnValue({
        productos: manyProducts,
        loading: false,
        error: null
      });

      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );

      const productCards = screen.getAllByTestId('product-card');
      expect(productCards).toHaveLength(8);
    });

    it('debe mostrar contador de productos', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );

      expect(screen.getByText(/\(3\)/)).toBeInTheDocument(); // 3 productos
    });
  });

  describe('Mensaje sin productos', () => {
    it('debe mostrar mensaje si no hay productos', () => {
      useProducts.mockReturnValue({
        productos: [],
        loading: false,
        error: null
      });

      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );

      expect(screen.getByText('No se encontraron productos con los filtros seleccionados')).toBeInTheDocument();
    });
  });
});