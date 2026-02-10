import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CartPage from '../pages/CartPage';

const mockNavigate = vi.fn();
const mockRemoveFromCart = vi.fn();
const mockUpdateQuantity = vi.fn();
const mockGetCartTotal = vi.fn();
const mockClearCart = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

vi.mock('../context/CartContext', () => ({
  useCart: () => ({
    cartItems: [],
    removeFromCart: mockRemoveFromCart,
    updateQuantity: mockUpdateQuantity,
    getCartTotal: mockGetCartTotal,
    clearCart: mockClearCart
  })
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { id: 1, correo: 'test@example.com' }
  })
}));

vi.mock('../services/orderService', () => ({
  orderService: {
    createOrder: vi.fn()
  }
}));

vi.mock('../layouts/MainLayout', () => ({
  default: ({ children }) => <div>{children}</div>
}));

describe('CartPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCartTotal.mockReturnValue(0);
  });

  describe('Carrito vacío', () => {
    it('debe mostrar mensaje de carrito vacío', () => {
      render(
        <BrowserRouter>
          <CartPage />
        </BrowserRouter>
      );

      expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument();
      expect(screen.getByText('Ir a la tienda')).toBeInTheDocument();
    });
  });
});