import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';

// Mock del useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Componente wrapper para el router
const Wrapper = ({ children }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

describe('ProductCard Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const productoSinDescuento = {
    id_producto: 1,
    nombre: 'Nike Air Max 270',
    marca: 'Nike',
    precio: 45999.99,
    porcentaje_descuento: 0,
    url_imagen: 'https://example.com/image.jpg',
  };

  const productoConDescuento = {
    id_producto: 2,
    nombre: 'Adidas Ultraboost',
    marca: 'Adidas',
    precio: 52999.99,
    porcentaje_descuento: 15,
    url_imagen: 'https://example.com/image2.jpg',
  };

  describe('Renderizado básico', () => {
    it('debe renderizar el componente correctamente', () => {
      render(
        <Wrapper>
          <ProductCard producto={productoSinDescuento} />
        </Wrapper>
      );

      expect(screen.getByText('Nike Air Max 270')).toBeInTheDocument();
      expect(screen.getByText('Nike')).toBeInTheDocument();
    });

    it('debe mostrar la imagen del producto', () => {
      render(
        <Wrapper>
          <ProductCard producto={productoSinDescuento} />
        </Wrapper>
      );

      const img = screen.getByAltText('Nike Air Max 270');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('debe mostrar imagen placeholder si no hay url_imagen', () => {
      const productoSinImagen = { ...productoSinDescuento, url_imagen: null };
      render(
        <Wrapper>
          <ProductCard producto={productoSinImagen} />
        </Wrapper>
      );

      const img = screen.getByAltText('Nike Air Max 270');
      expect(img).toHaveAttribute('src', expect.stringContaining('placeholder'));
    });
  });

  describe('Precios y descuentos', () => {
    it('debe mostrar el precio regular cuando no hay descuento', () => {
      render(
        <Wrapper>
          <ProductCard producto={productoSinDescuento} />
        </Wrapper>
      );

      expect(screen.getByText(/45\.999/)).toBeInTheDocument();
      expect(screen.queryByText(/-%/)).not.toBeInTheDocument();
    });

    it('debe mostrar el badge de descuento cuando hay descuento', () => {
      render(
        <Wrapper>
          <ProductCard producto={productoConDescuento} />
        </Wrapper>
      );

      expect(screen.getByText('-15%')).toBeInTheDocument();
    });

    it('debe calcular y mostrar el precio con descuento correctamente', () => {
      render(
        <Wrapper>
          <ProductCard producto={productoConDescuento} />
        </Wrapper>
      );

      // Precio original: 52999.99
      // Descuento: 15%
      // Precio final: 52999.99 - (52999.99 * 0.15) = 45049.99
      expect(screen.getByText(/45\.049/)).toBeInTheDocument();
    });

    it('debe mostrar el precio original tachado cuando hay descuento', () => {
      render(
        <Wrapper>
          <ProductCard producto={productoConDescuento} />
        </Wrapper>
      );

      const precioOriginal = screen.getByText(/52\.999/);
      expect(precioOriginal).toBeInTheDocument();
      expect(precioOriginal.className).toContain('original-price');
    });
  });

  describe('Navegación', () => {
    it('debe navegar al detalle del producto al hacer click', () => {
      render(
        <Wrapper>
          <ProductCard producto={productoSinDescuento} />
        </Wrapper>
      );

      const card = screen.getByText('Nike Air Max 270').closest('.product-card');
      fireEvent.click(card);

      expect(mockNavigate).toHaveBeenCalledWith('/product/1');
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    it('debe usar el id_producto correcto en la navegación', () => {
      render(
        <Wrapper>
          <ProductCard producto={productoConDescuento} />
        </Wrapper>
      );

      const card = screen.getByText('Adidas Ultraboost').closest('.product-card');
      fireEvent.click(card);

      expect(mockNavigate).toHaveBeenCalledWith('/product/2');
    });
  });

  describe('Propiedades del producto', () => {
    it('debe manejar nombres largos correctamente', () => {
      const productoNombreLargo = {
        ...productoSinDescuento,
        nombre: 'Este es un nombre muy largo para un producto de zapatillas deportivas',
      };

      render(
        <Wrapper>
          <ProductCard producto={productoNombreLargo} />
        </Wrapper>
      );

      expect(screen.getByText(/Este es un nombre muy largo/)).toBeInTheDocument();
    });

    it('debe manejar descuentos de 0%', () => {
      const productoDescuentoCero = {
        ...productoSinDescuento,
        porcentaje_descuento: 0,
      };

      render(
        <Wrapper>
          <ProductCard producto={productoDescuentoCero} />
        </Wrapper>
      );

      expect(screen.queryByText(/-%/)).not.toBeInTheDocument();
    });

    it('debe manejar descuentos del 100%', () => {
      const productoDescuento100 = {
        ...productoSinDescuento,
        porcentaje_descuento: 100,
      };

      render(
        <Wrapper>
          <ProductCard producto={productoDescuento100} />
        </Wrapper>
      );

      expect(screen.getByText('-100%')).toBeInTheDocument();
      // Precio final debería ser 0
      expect(screen.getByText('$0')).toBeInTheDocument();
    });
  });

  describe('Accesibilidad', () => {
    it('debe tener texto alternativo en la imagen', () => {
      render(
        <Wrapper>
          <ProductCard producto={productoSinDescuento} />
        </Wrapper>
      );

      const img = screen.getByAltText('Nike Air Max 270');
      expect(img).toBeInTheDocument();
    });

    it('la card debe ser clickeable', () => {
      render(
        <Wrapper>
          <ProductCard producto={productoSinDescuento} />
        </Wrapper>
      );

      const card = screen.getByText('Nike Air Max 270').closest('.product-card');
      expect(card).toBeInTheDocument();
      
      // Verificar que tiene el evento onClick
      fireEvent.click(card);
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('debe manejar precios decimales correctamente', () => {
      const productoConDecimales = {
        ...productoSinDescuento,
        precio: 1234.56,
      };

      render(
        <Wrapper>
          <ProductCard producto={productoConDecimales} />
        </Wrapper>
      );

      expect(screen.getByText(/1\.234/)).toBeInTheDocument();
    });

    it('debe manejar marcas vacías', () => {
      const productoSinMarca = {
        ...productoSinDescuento,
        marca: '',
      };

      render(
        <Wrapper>
          <ProductCard producto={productoSinMarca} />
        </Wrapper>
      );

      // El componente debe seguir renderizando sin errores
      expect(screen.getByText('Nike Air Max 270')).toBeInTheDocument();
    });
  });
});