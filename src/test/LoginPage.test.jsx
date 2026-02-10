import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

const mockNavigate = vi.fn();
const mockLogin = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin
  })
}));

const Wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderizado', () => {
    it('debe renderizar el formulario de login', () => {
      render(
        <Wrapper>
          <LoginPage />
        </Wrapper>
      );
      expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    });
  });

  describe('Validación de campos', () => {
    it('debe mostrar error si el email está vacío', async () => {
      render(
        <Wrapper>
          <LoginPage />
        </Wrapper>
      );

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(screen.getByText('El correo electrónico es obligatorio')).toBeInTheDocument();
      });
    });

    it('debe mostrar error si el email no es válido', async () => {
      render(
        <Wrapper>
          <LoginPage />
        </Wrapper>
      );

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      fireEvent.change(emailInput, { target: { value: 'emailinvalido' } });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(screen.getByText('El formato del correo no es válido')).toBeInTheDocument();
      });
    });

    it('debe mostrar error si la contraseña es muy corta', async () => {
      render(
        <Wrapper>
          <LoginPage />
        </Wrapper>
      );

      const passwordInput = screen.getByLabelText(/contraseña/i);
      fireEvent.change(passwordInput, { target: { value: '123' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();
      });
    });
  });

  describe('Submit del formulario', () => {
    it('debe hacer login exitoso con credenciales válidas', async () => {
      mockLogin.mockResolvedValueOnce({ success: true });

      render(
        <Wrapper>
          <LoginPage />
        </Wrapper>
      );

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('debe mostrar error con credenciales incorrectas', async () => {
      mockLogin.mockResolvedValueOnce({
        success: false,
        error: 'Correo o contraseña incorrectos'
      });

      render(
        <Wrapper>
          <LoginPage />
        </Wrapper>
      );

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Correo o contraseña incorrectos')).toBeInTheDocument();
      });
    });

    it('no debe enviar formulario si hay errores de validación', async () => {
      render(
        <Wrapper>
          <LoginPage />
        </Wrapper>
      );

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).not.toHaveBeenCalled();
      });
    });
  });


});