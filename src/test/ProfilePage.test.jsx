import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProfilePage from '../pages/ProfilePage';

const mockNavigate = vi.fn();
const mockLogout = vi.fn();
const mockUser = {
  id: 1,
  nombre: 'Juan',
  apellido: 'Pérez',
  correo: 'juan@example.com',
  telefono: '1234567890',
  rol: 'cliente'
};

const mockPedidos = [
  {
    id_pedido: 1,
    monto_total: 50000,
    estado: 'entregado',
    fecha_pedido: '2026-01-15',
    items: []
  },
  {
    id_pedido: 2,
    monto_total: 30000,
    estado: 'pendiente',
    fecha_pedido: '2026-02-05',
    items: []
  }
];

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: true,
    logout: mockLogout
  })
}));

vi.mock('../services/orderService', () => ({
  orderService: {
    getByUser: vi.fn(() => Promise.resolve({ data: mockPedidos }))
  }
}));

vi.mock('../services/userService', () => ({
  userService: {
    update: vi.fn(() => Promise.resolve({ success: true })),
    updatePassword: vi.fn(() => Promise.resolve({ success: true }))
  }
}));

vi.mock('../layouts/MainLayout', () => ({
  default: ({ children }) => <div>{children}</div>
}));

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Renderizado del perfil', () => {

    it('debe mostrar estadísticas de pedidos', async () => {
      render(
        <BrowserRouter>
          <ProfilePage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('2')).toBeInTheDocument(); // Total pedidos
        expect(screen.getByText(/80\.000/)).toBeInTheDocument(); // Total gastado
      });
    });
  });

  describe('Navegación entre secciones', () => {
    it('debe cambiar a la sección de pedidos', async () => {
      render(
        <BrowserRouter>
          <ProfilePage />
        </BrowserRouter>
      );

      await waitFor(() => {
        const pedidosTab = screen.getByText(/mis pedidos/i);
        fireEvent.click(pedidosTab);

        expect(screen.getByText(/Pedido #1/)).toBeInTheDocument();
      });
    });
  });

  describe('Edición de perfil', () => {
    it('debe permitir editar datos del usuario', async () => {
      const { userService } = await import('../services/userService');
      
      render(
        <BrowserRouter>
          <ProfilePage />
        </BrowserRouter>
      );

      await waitFor(() => {
        const editButton = screen.getByText(/editar datos/i);
        fireEvent.click(editButton);

        const nombreInput = screen.getByDisplayValue('Juan');
        fireEvent.change(nombreInput, { target: { value: 'Juan Carlos' } });

        const saveButton = screen.getByText(/guardar cambios/i);
        fireEvent.click(saveButton);
      });

      await waitFor(() => {
        expect(userService.update).toHaveBeenCalledWith(1, expect.objectContaining({
          nombre: 'Juan Carlos'
        }));
      });
    });

    it('debe cancelar edición', async () => {
      render(
        <BrowserRouter>
          <ProfilePage />
        </BrowserRouter>
      );

      await waitFor(() => {
        const editButton = screen.getByText(/editar datos/i);
        fireEvent.click(editButton);

        const cancelButton = screen.getByText(/cancelar/i);
        fireEvent.click(cancelButton);

        expect(screen.queryByDisplayValue('Juan')).not.toBeInTheDocument();
      });
    });
  });

  describe('Listado de pedidos', () => {
    it('debe mostrar todos los pedidos del usuario', async () => {
      render(
        <BrowserRouter>
          <ProfilePage />
        </BrowserRouter>
      );

      await waitFor(() => {
        const pedidosTab = screen.getByText(/mis pedidos/i);
        fireEvent.click(pedidosTab);

        expect(screen.getByText(/Pedido #1/)).toBeInTheDocument();
        expect(screen.getByText(/Pedido #2/)).toBeInTheDocument();
      });
    });

    it('debe mostrar estado de cada pedido', async () => {
      render(
        <BrowserRouter>
          <ProfilePage />
        </BrowserRouter>
      );

      await waitFor(() => {
        const pedidosTab = screen.getByText(/mis pedidos/i);
        fireEvent.click(pedidosTab);

        expect(screen.getByText(/entregado/i)).toBeInTheDocument();
        expect(screen.getByText(/pendiente/i)).toBeInTheDocument();
      });
    });
  });

  describe('Cerrar sesión', () => {
    it('debe cerrar sesión y redirigir', async () => {
      render(
        <BrowserRouter>
          <ProfilePage />
        </BrowserRouter>
      );

      await waitFor(() => {
        const logoutButton = screen.getByText(/cerrar sesión/i);
        fireEvent.click(logoutButton);

        expect(mockLogout).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });
});