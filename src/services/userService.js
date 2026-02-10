import apiClient from './api';

export const userService = {
  // Obtener usuario por ID
  getById: async (idUsuario) => {
    try {
      const response = await apiClient.get(`/usuarios/${idUsuario}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw error;
    }
  },

  // Actualizar usuario
  update: async (idUsuario, userData) => {
    try {
      const response = await apiClient.put(`/usuarios/${idUsuario}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  },

  // Actualizar contraseña
  updatePassword: async (idUsuario, currentPassword, newPassword) => {
    try {
      // Primero verificar la contraseña actual
      const userResponse = await apiClient.get(`/usuarios/${idUsuario}`);
      const user = userResponse.data.data;
      
      if (user.contrasena !== currentPassword) {
        throw new Error('La contraseña actual es incorrecta');
      }
      
      // Actualizar contraseña
      const response = await apiClient.put(`/usuarios/${idUsuario}`, {
        contrasena: newPassword
      });
      
      return response.data;
    } catch (error) {
      console.error('Error al actualizar contraseña:', error);
      throw error;
    }
  }
};