import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';

const mockNavigate = vi.fn();
let mockAuthContext = {
  user: { id: 1, nombre: 'Admin', rol: 'administrador' },
  isAuthenticated: true,
  isAdmin: true,
  logout: vi.fn()
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

vi.mock('../context/AuthContext', () => ({
  useAuth: () => mockAuthContext
}));

vi.mock('../services/productService', () => ({
  productService: {
    getAll: vi.fn(() => Promise.resolve({ data: [] }))
  }
}));

vi.mock('../layouts/MainLayout', () => ({
  default: ({ children }) => <div>{children}</div>
}));

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: [] })
  })
);

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    // Resetear auth context al admin por defecto
    mockAuthContext = {
      user: { id: 1, nombre: 'Admin', rol: 'administrador' },
      isAuthenticated: true,
      isAdmin: true,
      logout: vi.fn()
    };
  });

  describe('Renderizado', () => {
    it('debe renderizar el dashboard para admin', async () => {
      render(
        <BrowserRouter>
          <AdminDashboard />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/principal/i)).toBeInTheDocument();
      });
    });

    it('debe mostrar menú de navegación', async () => {
      render(
        <BrowserRouter>
          <AdminDashboard />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/principal/i)).toBeInTheDocument();
        expect(screen.getByText(/pedidos/i)).toBeInTheDocument();
        expect(screen.getByText(/productos/i)).toBeInTheDocument();
      });
    });
  });

  describe('Restricción de acceso', () => {
    it('debe redirigir si no está autenticado', () => {
      mockAuthContext.isAuthenticated = false;
      mockAuthContext.isAdmin = false;
      mockAuthContext.user = null;

      render(
        <BrowserRouter>
          <AdminDashboard />
        </BrowserRouter>
      );

      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('debe redirigir si no es admin', () => {
      mockAuthContext.isAuthenticated = true;
      mockAuthContext.isAdmin = false;
      mockAuthContext.user = { id: 1, nombre: 'User', rol: 'cliente' };

      render(
        <BrowserRouter>
          <AdminDashboard />
        </BrowserRouter>
      );

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});