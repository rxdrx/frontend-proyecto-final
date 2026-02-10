import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from '../pages/RegisterPage';

const mockNavigate = vi.fn();
const mockRegister = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    register: mockRegister
  })
}));

const Wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderizado', () => {
    it('debe renderizar el formulario de registro', () => {
      render(
        <Wrapper>
          <RegisterPage />
        </Wrapper>
      );

      expect(screen.getByText('Crear Cuenta')).toBeInTheDocument();
      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument();
    });
  });

  describe('Validación de campos', () => {
    it('debe validar que el nombre no esté vacío', async () => {
      render(
        <Wrapper>
          <RegisterPage />
        </Wrapper>
      );

      const nombreInput = screen.getByLabelText(/nombre/i);
      fireEvent.blur(nombreInput);

      await waitFor(() => {
        expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument();
      });
    });

    it('debe validar que el nombre tenga al menos 2 caracteres', async () => {
      render(
        <Wrapper>
          <RegisterPage />
        </Wrapper>
      );

      const nombreInput = screen.getByLabelText(/nombre/i);
      fireEvent.change(nombreInput, { target: { value: 'A' } });
      fireEvent.blur(nombreInput);

      await waitFor(() => {
        expect(screen.getByText('El nombre debe tener al menos 2 caracteres')).toBeInTheDocument();
      });
    });

    it('debe validar formato de email', async () => {
      render(
        <Wrapper>
          <RegisterPage />
        </Wrapper>
      );

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      fireEvent.change(emailInput, { target: { value: 'emailinvalido' } });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(screen.getByText('El formato del correo no es válido')).toBeInTheDocument();
      });
    });

    it('debe validar que la contraseña tenga al menos 8 caracteres', async () => {
      render(
        <Wrapper>
          <RegisterPage />
        </Wrapper>
      );

      const passwordInput = screen.getByLabelText(/^contraseña$/i);
      fireEvent.change(passwordInput, { target: { value: 'Pass1' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(screen.getByText('La contraseña debe tener al menos 8 caracteres')).toBeInTheDocument();
      });
    });

    it('debe validar que la contraseña tenga mayúscula', async () => {
      render(
        <Wrapper>
          <RegisterPage />
        </Wrapper>
      );

      const passwordInput = screen.getByLabelText(/^contraseña$/i);
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(screen.getByText('Debe contener al menos una letra mayúscula')).toBeInTheDocument();
      });
    });

    it('debe validar que las contraseñas coincidan', async () => {
      render(
        <Wrapper>
          <RegisterPage />
        </Wrapper>
      );

      const passwordInput = screen.getByLabelText(/^contraseña$/i);
      const confirmInput = screen.getByLabelText(/confirmar contraseña/i);

      fireEvent.change(passwordInput, { target: { value: 'Password123' } });
      fireEvent.change(confirmInput, { target: { value: 'Password456' } });
      fireEvent.blur(confirmInput);

      await waitFor(() => {
        expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
      });
    });
  });

  describe('Submit del formulario', () => {
    it('debe registrar usuario exitosamente con datos válidos', async () => {
      mockRegister.mockResolvedValueOnce({ success: true });

      render(
        <Wrapper>
          <RegisterPage />
        </Wrapper>
      );

      fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Juan' } });
      fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'Pérez' } });
      fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'juan@example.com' } });
      fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'Password123' } });
      fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'Password123' } });

      const submitButton = screen.getByRole('button', { name: /registrarse/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          nombre: 'Juan',
          apellido: 'Pérez',
          correo: 'juan@example.com',
          contrasena: 'Password123',
          telefono: null
        });
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });

    it('debe mostrar error si el email ya está registrado', async () => {
      mockRegister.mockResolvedValueOnce({
        success: false,
        error: 'El correo electrónico ya está registrado'
      });

      render(
        <Wrapper>
          <RegisterPage />
        </Wrapper>
      );

      fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Juan' } });
      fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'Pérez' } });
      fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'existe@example.com' } });
      fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'Password123' } });
      fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'Password123' } });

      fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

      await waitFor(() => {
        expect(screen.getByText('El correo electrónico ya está registrado')).toBeInTheDocument();
      });
    });

    it('no debe enviar si hay errores de validación', async () => {
      render(
        <Wrapper>
          <RegisterPage />
        </Wrapper>
      );

      const submitButton = screen.getByRole('button', { name: /registrarse/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).not.toHaveBeenCalled();
      });
    });
  });

  describe('Navegación', () => {
    it('debe tener enlace para ir a login', () => {
      render(
        <Wrapper>
          <RegisterPage />
        </Wrapper>
      );

      const loginLink = screen.getByText(/inicia sesión/i);
      expect(loginLink).toBeInTheDocument();
    });
  });
});