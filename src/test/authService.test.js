import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import authService from '../services/authService';
import apiClient from '../services/api';

vi.mock('../services/api');

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('register', () => {
    it('debe registrar un nuevo usuario exitosamente', async () => {
      const mockUsers = { data: { data: [] } };
      const mockResponse = { data: { success: true, data: { id_usuario: 1 } } };

      apiClient.get.mockResolvedValueOnce(mockUsers);
      apiClient.post.mockResolvedValueOnce(mockResponse);

      const userData = {
        nombre: 'Juan',
        apellido: 'Pérez',
        correo: 'juan@example.com',
        contrasena: 'password123',
        telefono: '1234567890'
      };

      const result = await authService.register(userData);

      expect(apiClient.get).toHaveBeenCalledWith('/usuarios');
      expect(apiClient.post).toHaveBeenCalledWith('/usuarios', {
        nombre: 'Juan',
        apellido: 'Pérez',
        correo: 'juan@example.com',
        contrasena: 'password123',
        telefono: '1234567890',
        rol: 'cliente'
      });
      expect(result.success).toBe(true);
    });

    it('debe rechazar registro si el correo ya existe', async () => {
      const existingUser = {
        id_usuario: 1,
        correo: 'juan@example.com',
        nombre: 'Juan'
      };
      const mockUsers = { data: { data: [existingUser] } };

      apiClient.get.mockResolvedValueOnce(mockUsers);

      const userData = {
        nombre: 'Pedro',
        correo: 'juan@example.com',
        contrasena: 'password123'
      };

      await expect(authService.register(userData)).rejects.toThrow(
        'El correo electrónico ya está registrado'
      );
    });
  });

  describe('login', () => {
    it('debe iniciar sesión exitosamente con credenciales correctas', async () => {
      const mockUsuario = {
        id_usuario: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        correo: 'juan@example.com',
        contrasena: 'password123',
        telefono: '1234567890',
        rol: 'cliente'
      };

      apiClient.get.mockResolvedValueOnce({
        data: { data: [mockUsuario] }
      });

      const result = await authService.login('juan@example.com', 'password123');

      expect(result).toEqual({
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        correo: 'juan@example.com',
        telefono: '1234567890',
        rol: 'cliente'
      });

      expect(localStorage.getItem('user')).toBeTruthy();
      expect(localStorage.getItem('isAuthenticated')).toBe('true');
    });

    it('debe rechazar login con credenciales incorrectas', async () => {
      const mockUsuario = {
        id_usuario: 1,
        correo: 'juan@example.com',
        contrasena: 'password123'
      };

      apiClient.get.mockResolvedValueOnce({
        data: { data: [mockUsuario] }
      });

      await expect(
        authService.login('juan@example.com', 'wrongpassword')
      ).rejects.toThrow('Correo o contraseña incorrectos');
    });
  });

  describe('logout', () => {
    it('debe limpiar localStorage al cerrar sesión', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Juan' }));
      localStorage.setItem('isAuthenticated', 'true');

      authService.logout();

      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('isAuthenticated')).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('debe retornar el usuario del localStorage', () => {
      const user = { id: 1, nombre: 'Juan', correo: 'juan@example.com' };
      localStorage.setItem('user', JSON.stringify(user));

      const result = authService.getCurrentUser();

      expect(result).toEqual(user);
    });

    it('debe retornar null si no hay usuario', () => {
      const result = authService.getCurrentUser();
      expect(result).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('debe retornar true si está autenticado', () => {
      localStorage.setItem('isAuthenticated', 'true');
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('debe retornar false si no está autenticado', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('debe retornar true si el usuario es administrador', () => {
      localStorage.setItem('user', JSON.stringify({ rol: 'administrador' }));
      expect(authService.isAdmin()).toBe(true);
    });

    it('debe retornar false si el usuario no es administrador', () => {
      localStorage.setItem('user', JSON.stringify({ rol: 'cliente' }));
      expect(authService.isAdmin()).toBe(false);
    });

    it('debe retornar false si no hay usuario', () => {
      expect(authService.isAdmin()).toBe(false);
    });
  });
});