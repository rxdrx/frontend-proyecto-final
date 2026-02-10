import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProductDetailPage from '../pages/ProductDetailPage';

const mockNavigate = vi.fn();
const mockAddToCart = vi.fn();

const mockProducto = {
  id_producto: 1,
  nombre: 'Nike Air Max 270',
  marca: 'Nike',
  descripcion: 'Zapatillas deportivas con tecnología Air',
  precio: 45000,
  porcentaje_descuento: 15,
  color: 'Negro',
  material: 'Sintético',
  url_imagen: 'https://example.com/nike.jpg'
};

const mockInventario = [
  { id_inventario: 1, talla: '40', cantidad_stock: 5 },
  { id_inventario: 2, talla: '41', cantidad_stock: 3 },
  { id_inventario: 3, talla: '42', cantidad_stock: 0 }
];

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '1' })
  };
});

vi.mock('../hooks/useProduct', () => ({
  useProduct: () => ({
    producto: mockProducto,
    loading: false,
    error: null
  })
}));

vi.mock('../context/CartContext', () => ({
  useCart: () => ({
    addToCart: mockAddToCart
  })
}));

vi.mock('../services/inventoryService', () => ({
  inventoryService: {
    getByProduct: vi.fn(() => Promise.resolve({ data: mockInventario }))
  }
}));

vi.mock('../layouts/MainLayout', () => ({
  default: ({ children }) => <div>{children}</div>
}));

describe('ProductDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderizado del producto', () => {
    it('debe mostrar la información del producto', async () => {
      render(
        <BrowserRouter>
          <ProductDetailPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Nike Air Max 270')).toBeInTheDocument();
        expect(screen.getByText('Nike')).toBeInTheDocument();
        expect(screen.getByText(/Zapatillas deportivas/)).toBeInTheDocument();
      });
    });

    it('debe mostrar la imagen del producto', async () => {
      render(
        <BrowserRouter>
          <ProductDetailPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        const img = screen.getByAltText('Nike Air Max 270');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', 'https://example.com/nike.jpg');
      });
    });

    it('debe mostrar precio con descuento', async () => {
      render(
        <BrowserRouter>
          <ProductDetailPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        // Precio original: 45000
        // Descuento: 15%
        // Precio final: 38250
        expect(screen.getByText(/38\.250/)).toBeInTheDocument();
        expect(screen.getByText(/45\.000/)).toBeInTheDocument();
        expect(screen.getByText('-15%')).toBeInTheDocument();
      });
    });

    it('debe mostrar especificaciones del producto', async () => {
      render(
        <BrowserRouter>
          <ProductDetailPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Color:/)).toBeInTheDocument();
        expect(screen.getByText(/Negro/)).toBeInTheDocument();
        expect(screen.getByText(/Material:/)).toBeInTheDocument();
        expect(screen.getByText(/Sintético/)).toBeInTheDocument();
      });
    });
  });

  describe('Selector de talle', () => {
    it('debe mostrar talles disponibles', async () => {
      render(
        <BrowserRouter>
          <ProductDetailPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('40')).toBeInTheDocument();
        expect(screen.getByText('41')).toBeInTheDocument();
      });
    });



 
  });


  describe('Navegación', () => {
    it('debe tener botón para volver', async () => {
      render(
        <BrowserRouter>
          <ProductDetailPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        const backButton = screen.getByText(/volver/i);
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith(-1);
      });
    });
  });

});