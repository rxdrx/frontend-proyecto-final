import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FilterSidebar from '../components/products/FilterSidebar';

// Mock del hook useCategories
vi.mock('../hooks/useCategories', () => ({
  useCategories: vi.fn()
}));

import { useCategories } from '../hooks/useCategories';

describe('FilterSidebar', () => {
  const mockOnFilterChange = vi.fn();
  const mockCategorias = [
    { id_categoria: 1, nombre: 'Deportivas' },
    { id_categoria: 2, nombre: 'Casuales' },
    { id_categoria: 3, nombre: 'Formales' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useCategories.mockReturnValue({
      categorias: mockCategorias,
      loading: false
    });
  });

  describe('Renderizado', () => {
    it('debe renderizar el componente correctamente', () => {
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      expect(screen.getByText('Filtros')).toBeInTheDocument();
      expect(screen.getByText('Limpiar')).toBeInTheDocument();
      expect(screen.getByText('Categorías')).toBeInTheDocument();
      expect(screen.getByText('Rango de Precio')).toBeInTheDocument();
    });

    it('debe mostrar todas las categorías', () => {
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      expect(screen.getByText('Deportivas')).toBeInTheDocument();
      expect(screen.getByText('Casuales')).toBeInTheDocument();
      expect(screen.getByText('Formales')).toBeInTheDocument();
    });

    it('debe mostrar mensaje de carga cuando las categorías están cargando', () => {
      useCategories.mockReturnValue({
        categorias: [],
        loading: true
      });

      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      expect(screen.getByText('Cargando categorías...')).toBeInTheDocument();
    });
  });



  describe('Limpiar filtros', () => {
    it('debe limpiar todos los filtros', () => {
      render(<FilterSidebar onFilterChange={mockOnFilterChange} />);

      // Aplicar filtros
      const deportivasRadio = screen.getByLabelText('Deportivas');
      fireEvent.click(deportivasRadio);

      const minInput = screen.getByPlaceholderText('Mínimo');
      fireEvent.change(minInput, { target: { value: '10000' } });

      // Limpiar
      const clearButton = screen.getByText('Limpiar');
      fireEvent.click(clearButton);

      expect(screen.getByLabelText('Todas')).toBeChecked();
      expect(minInput).toHaveValue(null);
      expect(mockOnFilterChange).toHaveBeenCalledWith({});
    });
  });

  describe('Sincronización con currentFilters', () => {
    it('debe sincronizar con filtros externos', () => {
      const currentFilters = {
        categoria: '2',
        precio_min: '15000',
        precio_max: '40000'
      };

      render(
        <FilterSidebar
          onFilterChange={mockOnFilterChange}
          currentFilters={currentFilters}
        />
      );

      const casualesRadio = screen.getByLabelText('Casuales');
      expect(casualesRadio).toBeChecked();

      const minInput = screen.getByPlaceholderText('Mínimo');
      const maxInput = screen.getByPlaceholderText('Máximo');
      expect(minInput).toHaveValue(15000);
      expect(maxInput).toHaveValue(40000);
    });
  });
});