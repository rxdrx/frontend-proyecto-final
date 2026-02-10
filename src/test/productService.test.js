import { describe, it, expect, vi, beforeEach } from 'vitest';
import { productService } from '../services/productService';
import apiClient from '../services/api';

vi.mock('../services/api');

// Mock console.log para evitar logs en los tests
vi.spyOn(console, 'log').mockImplementation(() => {});

describe('productService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('debe obtener todos los productos sin filtros', async () => {
      const mockProductos = {
        data: {
          success: true,
          data: [
            { id_producto: 1, nombre: 'Nike Air Max' },
            { id_producto: 2, nombre: 'Adidas Ultraboost' }
          ]
        }
      };

      apiClient.get.mockResolvedValueOnce(mockProductos);

      const result = await productService.getAll();

      expect(apiClient.get).toHaveBeenCalledWith('/productos?');
      expect(result.data).toHaveLength(2);
    });

    it('debe aplicar filtros correctamente', async () => {
      const mockProductos = { data: { success: true, data: [] } };
      apiClient.get.mockResolvedValueOnce(mockProductos);

      await productService.getAll({
        categoria: '1',
        precio_min: '10000',
        precio_max: '50000'
      });

      expect(apiClient.get).toHaveBeenCalledWith(
        expect.stringContaining('categoria=1')
      );
      expect(apiClient.get).toHaveBeenCalledWith(
        expect.stringContaining('precio_min=10000')
      );
      expect(apiClient.get).toHaveBeenCalledWith(
        expect.stringContaining('precio_max=50000')
      );
    });
  });

  describe('getById', () => {
    it('debe obtener un producto por ID', async () => {
      const mockProducto = {
        data: {
          success: true,
          data: { id_producto: 1, nombre: 'Nike Air Max' }
        }
      };

      apiClient.get.mockResolvedValueOnce(mockProducto);

      const result = await productService.getById(1);

      expect(apiClient.get).toHaveBeenCalledWith('/productos/1');
      expect(result.data.nombre).toBe('Nike Air Max');
    });
  });

  describe('create', () => {
    it('debe crear un producto nuevo', async () => {
      const productoData = {
        nombre: 'Nike Revolution',
        precio: 35000,
        marca: 'Nike'
      };

      const mockResponse = {
        data: { success: true, data: { id_producto: 3, ...productoData } }
      };

      apiClient.post.mockResolvedValueOnce(mockResponse);

      const result = await productService.create(productoData);

      expect(apiClient.post).toHaveBeenCalledWith('/productos', productoData);
      expect(result.data.nombre).toBe('Nike Revolution');
    });
  });

  describe('update', () => {
    it('debe actualizar un producto existente', async () => {
      const productoData = { nombre: 'Nike Air Max 2024', precio: 48000 };
      const mockResponse = {
        data: { success: true, data: { id_producto: 1, ...productoData } }
      };

      apiClient.put.mockResolvedValueOnce(mockResponse);

      const result = await productService.update(1, productoData);

      expect(apiClient.put).toHaveBeenCalledWith('/productos/1', productoData);
      expect(result.data.nombre).toBe('Nike Air Max 2024');
    });
  });

  describe('delete', () => {
    it('debe eliminar un producto', async () => {
      const mockResponse = { data: { success: true, message: 'Producto eliminado' } };

      apiClient.delete.mockResolvedValueOnce(mockResponse);

      const result = await productService.delete(1);

      expect(apiClient.delete).toHaveBeenCalledWith('/productos/1');
      expect(result.success).toBe(true);
    });
  });
});