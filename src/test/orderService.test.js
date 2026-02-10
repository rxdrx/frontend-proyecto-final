import { describe, it, expect, vi, beforeEach } from 'vitest';
import { orderService } from '../services/orderService';
import apiClient from '../services/api';

vi.mock('../services/api');

describe('orderService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createOrder', () => {
    it('debe crear un pedido con items exitosamente', async () => {
      const orderData = {
        id_usuario: 1,
        monto_total: 50000,
        calle: 'Av. Principal 123',
        ciudad: 'Buenos Aires',
        provincia: 'CABA',
        codigo_postal: '1000',
        pais: 'Argentina',
        metodo_pago: 'tarjeta'
      };

      const cartItems = [
        {
          id_producto: 1,
          nombre: 'Nike Air Max',
          precio: 45000,
          porcentaje_descuento: 0,
          talle: '42',
          cantidad: 1
        }
      ];

      const mockPedido = {
        data: {
          success: true,
          data: { id_pedido: 1, ...orderData }
        }
      };

      const mockItem = {
        data: { success: true, data: { id_item_pedido: 1 } }
      };

      apiClient.post
        .mockResolvedValueOnce(mockPedido)
        .mockResolvedValueOnce(mockItem);

      const result = await orderService.createOrder(orderData, cartItems);

      expect(result.success).toBe(true);
      expect(result.pedido.id_pedido).toBe(1);
      expect(apiClient.post).toHaveBeenCalledTimes(2); // Pedido + item
    });

    it('debe calcular correctamente el precio con descuento', async () => {
      const orderData = {
        id_usuario: 1,
        monto_total: 40000,
        calle: 'Test',
        ciudad: 'Test',
        provincia: 'Test',
        codigo_postal: '1000',
        metodo_pago: 'efectivo'
      };

      const cartItems = [
        {
          id_producto: 1,
          precio: 50000,
          porcentaje_descuento: 20, // 20% de descuento
          talle: '40',
          cantidad: 1
        }
      ];

      apiClient.post
        .mockResolvedValueOnce({
          data: { data: { id_pedido: 1 } }
        })
        .mockResolvedValueOnce({
          data: { data: { id_item_pedido: 1 } }
        });

      await orderService.createOrder(orderData, cartItems);

      const itemCall = apiClient.post.mock.calls[1][1];
      expect(itemCall.precio_unitario).toBe(40000); // 50000 - 20%
    });
  });

  describe('getByUser', () => {
    it('debe obtener pedidos de un usuario con sus items', async () => {
      const mockPedidos = {
        data: {
          data: [
            { id_pedido: 1, id_usuario: 1, monto_total: 50000 },
            { id_pedido: 2, id_usuario: 2, monto_total: 30000 }
          ]
        }
      };

      const mockItems = {
        data: {
          data: [
            { id_item_pedido: 1, id_pedido: 1, id_producto: 1 }
          ]
        }
      };

      apiClient.get
        .mockResolvedValueOnce(mockPedidos)
        .mockResolvedValue(mockItems);

      const result = await orderService.getByUser(1);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].id_pedido).toBe(1);
      expect(result.data[0].items).toBeDefined();
    });

    it('debe manejar usuario sin pedidos', async () => {
      apiClient.get
        .mockResolvedValueOnce({ data: { data: [] } });

      const result = await orderService.getByUser(999);

      expect(result.data).toHaveLength(0);
    });
  });

  describe('getById', () => {
    it('debe obtener un pedido por ID', async () => {
      const mockPedido = {
        data: {
          success: true,
          data: { id_pedido: 1, monto_total: 50000 }
        }
      };

      apiClient.get.mockResolvedValueOnce(mockPedido);

      const result = await orderService.getById(1);

      expect(apiClient.get).toHaveBeenCalledWith('/pedidos/1');
      expect(result.data.id_pedido).toBe(1);
    });
  });
});