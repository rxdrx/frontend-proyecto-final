import apiClient from './api';

export const productService = {
  // Obtener todos los productos con filtros opcionales
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.categoria) params.append('categoria', filters.categoria);
    if (filters.precio_min) params.append('precio_min', filters.precio_min);
    if (filters.precio_max) params.append('precio_max', filters.precio_max);
    
    const response = await apiClient.get(`/productos?${params.toString()}`);
    console.log('Response completa:', response);        // <-- AGREGAR ESTA LÍNEA
    console.log('Response.data:', response.data);       // <-- AGREGAR ESTA LÍNEA
    return response.data;
  },

  // Obtener un producto por ID
  getById: async (id) => {
    const response = await apiClient.get(`/productos/${id}`);
    return response.data;
  },

  // Crear producto (admin)
  create: async (productoData) => {
    const response = await apiClient.post('/productos', productoData);
    return response.data;
  },

  // Actualizar producto (admin)
  update: async (id, productoData) => {
    const response = await apiClient.put(`/productos/${id}`, productoData);
    return response.data;
  },

  // Eliminar producto (admin)
  delete: async (id) => {
    const response = await apiClient.delete(`/productos/${id}`);
    return response.data;
  },
};