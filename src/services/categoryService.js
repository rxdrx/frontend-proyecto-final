import apiClient from './api';

export const categoryService = {
  getAll: async () => {
    const response = await apiClient.get('/categorias');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/categorias/${id}`);
    return response.data;
  },
};