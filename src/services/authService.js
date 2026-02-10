import apiClient from './api';

const authService = {
  // Registrar nuevo usuario
  register: async (userData) => {
    try {
      // Buscar si el usuario ya existe
      const existingUsers = await apiClient.get('/usuarios');
      const userExists = existingUsers.data.data.find(
        user => user.correo === userData.correo
      );
      
      if (userExists) {
        throw new Error('El correo electrónico ya está registrado');
      }

      // Crear nuevo usuario
      const response = await apiClient.post('/usuarios', {
        nombre: userData.nombre,
        apellido: userData.apellido || '',
        correo: userData.correo,
        contrasena: userData.contrasena,
        telefono: userData.telefono || null,
        rol: 'cliente' // Por defecto, todos los nuevos usuarios son clientes
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Iniciar sesión
  login: async (correo, contrasena) => {
    try {
      // Obtener todos los usuarios y buscar el que coincida
      const response = await apiClient.get('/usuarios');
      const usuarios = response.data.data;
      
      const usuario = usuarios.find(
        u => u.correo === correo && u.contrasena === contrasena
      );

      if (!usuario) {
        throw new Error('Correo o contraseña incorrectos');
      }

      // Guardar datos del usuario en localStorage
      const userData = {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        telefono: usuario.telefono,
        rol: usuario.rol
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');

      return userData;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    return localStorage.getItem('isAuthenticated') === 'true';
  },

  // Verificar si es administrador
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.rol === 'administrador';
  }
};

export default authService;