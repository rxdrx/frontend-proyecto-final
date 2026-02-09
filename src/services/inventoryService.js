import apiClient from './api';

export const inventoryService = {
  // Obtener inventario por producto
  getByProduct: async (idProducto) => {
    const response = await apiClient.get(`/inventario?id_producto=${idProducto}`);
    return response.data;
  },

  // Verificar stock disponible
  checkStock: async (idProducto, talla) => {
    const response = await apiClient.get(`/inventario?id_producto=${idProducto}`);
    const inventario = response.data.data || [];
    const item = inventario.find(inv => inv.talla === talla.toString());
    return item ? item.cantidad_stock : 0;
  },
};