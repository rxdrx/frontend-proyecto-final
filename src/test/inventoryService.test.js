import { describe, it, expect, vi, beforeEach } from 'vitest';
import { inventoryService } from '../services/inventoryService';
import apiClient from '../services/api';

vi.mock('../services/api');

describe('inventoryService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getByProduct', () => {
    it('debe obtener inventario por producto', async () => {
      const mockInventario = {
        data: {
          success: true,
          data: [
            { id_inventario: 1, id_producto: 1, talla: '40', cantidad_stock: 10 },
            { id_inventario: 2, id_producto: 1, talla: '41', cantidad_stock: 5 }
          ]
        }
      };

      apiClient.get.mockResolvedValueOnce(mockInventario);

      const result = await inventoryService.getByProduct(1);

      expect(apiClient.get).toHaveBeenCalledWith('/inventario?id_producto=1');
      expect(result.data).toHaveLength(2);
    });
  });

  describe('checkStock', () => {
    it('debe retornar cantidad de stock disponible para una talla', async () => {
      const mockInventario = {
        data: {
          data: [
            { talla: '40', cantidad_stock: 10 },
            { talla: '41', cantidad_stock: 5 }
          ]
        }
      };

      apiClient.get.mockResolvedValueOnce(mockInventario);

      const stock = await inventoryService.checkStock(1, '40');

      expect(stock).toBe(10);
    });

    it('debe retornar 0 si no hay stock para la talla', async () => {
      const mockInventario = {
        data: {
          data: [
            { talla: '40', cantidad_stock: 10 }
          ]
        }
      };

      apiClient.get.mockResolvedValueOnce(mockInventario);

      const stock = await inventoryService.checkStock(1, '42');

      expect(stock).toBe(0);
    });

    it('debe retornar 0 si el inventario está vacío', async () => {
      apiClient.get.mockResolvedValueOnce({ data: { data: [] } });

      const stock = await inventoryService.checkStock(1, '40');

      expect(stock).toBe(0);
    });
  });
});