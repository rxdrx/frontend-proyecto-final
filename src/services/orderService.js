import apiClient from './api';

export const orderService = {
  // Crear pedido completo (pedido + items)
  createOrder: async (orderData, cartItems) => {
    try {
      // 1. Crear el pedido
      const pedidoResponse = await apiClient.post('/pedidos', {
        id_usuario: orderData.id_usuario,
        monto_total: orderData.monto_total,
        estado: 'pendiente',
        calle: orderData.calle,
        ciudad: orderData.ciudad,
        provincia: orderData.provincia,
        codigo_postal: orderData.codigo_postal,
        pais: orderData.pais || 'Argentina',
        metodo_pago: orderData.metodo_pago
      });

      const pedido = pedidoResponse.data.data;
      const idPedido = pedido.id_pedido;

      // 2. Crear los items del pedido
      const itemsPromises = cartItems.map(item => {
        const precioOriginal = item.precio;
        const descuento = item.porcentaje_descuento || 0;
        const precioFinal = precioOriginal - (precioOriginal * descuento / 100);
        
        return apiClient.post('/items-pedido', {
          id_pedido: idPedido,
          id_producto: item.id_producto,
          talla: item.talle.toString(),
          cantidad: item.cantidad,
          precio_unitario: precioFinal,
          subtotal: precioFinal * item.cantidad
        });
      });

      await Promise.all(itemsPromises);

      return {
        success: true,
        pedido: pedido
      };
    } catch (error) {
      console.error('Error al crear pedido:', error);
      throw error;
    }
  },

  // Obtener pedidos del usuario
  getByUser: async (idUsuario) => {
    try {
      const response = await apiClient.get('/pedidos');
      const pedidos = response.data.data || [];
      
      // Filtrar pedidos del usuario
      const pedidosUsuario = pedidos.filter(p => p.id_usuario === idUsuario);
      
      // Obtener items de cada pedido
      const pedidosConItems = await Promise.all(
        pedidosUsuario.map(async (pedido) => {
          try {
            const itemsResponse = await apiClient.get('/items-pedido');
            const todosItems = itemsResponse.data.data || [];
            const items = todosItems.filter(item => item.id_pedido === pedido.id_pedido);
            
            return {
              ...pedido,
              items
            };
          } catch (error) {
            return {
              ...pedido,
              items: []
            };
          }
        })
      );
      
      return {
        success: true,
        data: pedidosConItems
      };
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      throw error;
    }
  },

  // Obtener pedido por ID con items
  getById: async (idPedido) => {
    try {
      const pedidoResponse = await apiClient.get(`/pedidos/${idPedido}`);
      return pedidoResponse.data;
    } catch (error) {
      console.error('Error al obtener pedido:', error);
      throw error;
    }
  }
};