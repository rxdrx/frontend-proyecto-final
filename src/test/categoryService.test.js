import { describe, it, expect, vi, beforeEach } from 'vitest';
import { categoryService } from '../services/categoryService';
import apiClient from '../services/api';

vi.mock('../services/api');

describe('categoryService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('debe obtener todas las categorías', async () => {
      const mockCategorias = {
        data: {
          success: true,
          data: [
            { id_categoria: 1, nombre: 'Deportivas' },
            { id_categoria: 2, nombre: 'Casuales' }
          ]
        }
      };

      apiClient.get.mockResolvedValueOnce(mockCategorias);

      const result = await categoryService.getAll();

      expect(apiClient.get).toHaveBeenCalledWith('/categorias');
      expect(result).toEqual(mockCategorias.data);
      expect(result.data).toHaveLength(2);
    });

    it('debe manejar errores al obtener categorías', async () => {
      apiClient.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(categoryService.getAll()).rejects.toThrow('Network error');
    });
  });

  describe('getById', () => {
    it('debe obtener una categoría por ID', async () => {
      const mockCategoria = {
        data: {
          success: true,
          data: { id_categoria: 1, nombre: 'Deportivas' }
        }
      };

      apiClient.get.mockResolvedValueOnce(mockCategoria);

      const result = await categoryService.getById(1);

      expect(apiClient.get).toHaveBeenCalledWith('/categorias/1');
      expect(result.data.nombre).toBe('Deportivas');
    });
  });
});