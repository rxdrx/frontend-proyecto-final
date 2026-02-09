import apiClient from './api';

export const orderService = {
  // Crear pedido
  create: async (pedidoData) => {
    const response = await apiClient.post('/pedidos', pedidoData);
    return response.data;
  },

  // Obtener pedidos del usuario
  getByUser: async (idUsuario) => {
    const response = await apiClient.get(`/pedidos?id_usuario=${idUsuario}`);
    return response.data;
  },

  // Crear items del pedido
  createItems: async (items) => {
    const promises = items.map(item => 
      apiClient.post('/items-pedido', item)
    );
    const responses = await Promise.all(promises);
    return responses.map(r => r.data);
  },
};