import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userService } from '../services/userService';
import apiClient from '../services/api';

vi.mock('../services/api');

describe('userService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getById', () => {
    it('debe obtener un usuario por ID', async () => {
      const mockUser = {
        data: {
          success: true,
          data: {
            id_usuario: 1,
            nombre: 'Juan',
            correo: 'juan@example.com'
          }
        }
      };

      apiClient.get.mockResolvedValueOnce(mockUser);

      const result = await userService.getById(1);

      expect(apiClient.get).toHaveBeenCalledWith('/usuarios/1');
      expect(result.data.nombre).toBe('Juan');
    });

    it('debe manejar errores al obtener usuario', async () => {
      apiClient.get.mockRejectedValueOnce(new Error('User not found'));

      await expect(userService.getById(999)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('debe actualizar datos del usuario', async () => {
      const userData = {
        nombre: 'Juan Actualizado',
        telefono: '9876543210'
      };

      const mockResponse = {
        data: {
          success: true,
          data: { id_usuario: 1, ...userData }
        }
      };

      apiClient.put.mockResolvedValueOnce(mockResponse);

      const result = await userService.update(1, userData);

      expect(apiClient.put).toHaveBeenCalledWith('/usuarios/1', userData);
      expect(result.data.nombre).toBe('Juan Actualizado');
    });
  });

  describe('updatePassword', () => {
    it('debe actualizar contraseña con password actual correcto', async () => {
      const mockUser = {
        data: {
          data: {
            id_usuario: 1,
            contrasena: 'oldpassword'
          }
        }
      };

      const mockUpdate = {
        data: { success: true }
      };

      apiClient.get.mockResolvedValueOnce(mockUser);
      apiClient.put.mockResolvedValueOnce(mockUpdate);

      const result = await userService.updatePassword(1, 'oldpassword', 'newpassword');

      expect(apiClient.put).toHaveBeenCalledWith('/usuarios/1', {
        contrasena: 'newpassword'
      });
      expect(result.success).toBe(true);
    });

    it('debe rechazar si la contraseña actual es incorrecta', async () => {
      const mockUser = {
        data: {
          data: {
            id_usuario: 1,
            contrasena: 'oldpassword'
          }
        }
      };

      apiClient.get.mockResolvedValueOnce(mockUser);

      await expect(
        userService.updatePassword(1, 'wrongpassword', 'newpassword')
      ).rejects.toThrow('La contraseña actual es incorrecta');
    });
  });
});