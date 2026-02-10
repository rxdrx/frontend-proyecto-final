import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { userService } from '../services/userService';
import MainLayout from '../layouts/MainLayout';
import '../assets/styles/ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('perfil');
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Inicializar formulario de edición con datos del usuario
  useEffect(() => {
    if (user) {
      setEditForm({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        correo: user.correo || '',
        telefono: user.telefono || ''
      });
    }
  }, [user]);

  // Cargar pedidos del usuario al montar el componente
  useEffect(() => {
    const loadPedidos = async () => {
      if (user && user.id) {
        try {
          setLoading(true);
          const response = await orderService.getByUser(user.id);
          setPedidos(response.data || []);
        } catch (error) {
          console.error('Error al cargar pedidos:', error);
          setPedidos([]);
        } finally {
          setLoading(false);
        }
      }
    };

    // Cargar pedidos siempre al inicio
    loadPedidos();
  }, [user]);

  // Calcular estadísticas
  const stats = {
    totalPedidos: pedidos.length,
    pedidosEntregados: pedidos.filter(p => p.estado === 'entregado').length,
    pedidosEnviados: pedidos.filter(p => p.estado === 'enviado').length,
    pedidosPendientes: pedidos.filter(p => p.estado === 'pendiente').length,
    totalGastado: pedidos.reduce((acc, p) => acc + parseFloat(p.monto_total || 0), 0)
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await userService.update(user.id, editForm);
      
      // Actualizar el usuario en el contexto
      const updatedUser = { ...user, ...editForm };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      alert('Datos actualizados exitosamente');
      setIsEditing(false);
      window.location.reload(); // Recargar para actualizar el contexto
    } catch (error) {
      alert('Error al actualizar los datos');
      console.error(error);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      alert('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      await userService.updatePassword(
        user.id,
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      
      alert('Contraseña actualizada exitosamente');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      alert(error.message || 'Error al actualizar la contraseña');
    }
  };

  const getEstadoBadgeClass = (estado) => {
    switch (estado) {
      case 'entregado':
        return 'badge-success';
      case 'enviado':
      case 'en_proceso':
        return 'badge-warning';
      case 'pendiente':
        return 'badge-info';
      case 'cancelado':
        return 'badge-danger';
      default:
        return 'badge-default';
    }
  };

  const formatEstado = (estado) => {
    const estados = {
      'pendiente': 'Pendiente',
      'en_proceso': 'En Proceso',
      'enviado': 'Enviado',
      'entregado': 'Entregado',
      'cancelado': 'Cancelado'
    };
    return estados[estado] || estado;
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return null;
  }

  return (
    <MainLayout>
      <div className="profile-page-container">
        <div className="profile-layout-full">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="profile-avatar-large">
              {user.nombre?.charAt(0).toUpperCase()}
              {user.apellido?.charAt(0).toUpperCase()}
            </div>
            <div className="profile-brief">
              <p className="profile-brief-name">{user.nombre} {user.apellido}</p>
              <p className="profile-brief-email">{user.correo}</p>
            </div>
            
            <nav className="profile-menu">
              <button
                className={activeSection === 'perfil' ? 'active' : ''}
                onClick={() => setActiveSection('perfil')}
              >
                👤 Mi Perfil
              </button>
              <button
                className={activeSection === 'pedidos' ? 'active' : ''}
                onClick={() => setActiveSection('pedidos')}
              >
                📦 Mis Pedidos
              </button>
            </nav>
            
            <button className="profile-logout" onClick={() => {
              logout();
              navigate('/');
            }}>
              🚪 Cerrar Sesión
            </button>
          </aside>

          {/* Main Content */}
          <main className="profile-main-full">
            {activeSection === 'perfil' && (
              <div className="profile-content">
                <div className="profile-header">
                  <h1>Información Personal</h1>
                  {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="edit-profile-btn">
                      ✏️ Editar Datos
                    </button>
                  ) : (
                    <button onClick={() => setIsEditing(false)} className="cancel-edit-btn">
                      ✕ Cancelar
                    </button>
                  )}
                </div>

                <div className="profile-grid">
                  <div className="profile-section-box">
                    {!isEditing ? (
                      <div className="profile-data-view">
                        <div className="data-row">
                          <span className="data-label">Nombre:</span>
                          <span className="data-value">{user.nombre}</span>
                        </div>
                        <div className="data-row">
                          <span className="data-label">Apellido:</span>
                          <span className="data-value">{user.apellido}</span>
                        </div>
                        <div className="data-row">
                          <span className="data-label">Correo Electrónico:</span>
                          <span className="data-value">{user.correo}</span>
                        </div>
                        <div className="data-row">
                          <span className="data-label">Teléfono:</span>
                          <span className="data-value">{user.telefono || 'No especificado'}</span>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleEditSubmit} className="profile-edit-form">
                        <div className="form-group">
                          <label>Nombre</label>
                          <input
                            type="text"
                            name="nombre"
                            value={editForm.nombre}
                            onChange={handleEditChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Apellido</label>
                          <input
                            type="text"
                            name="apellido"
                            value={editForm.apellido}
                            onChange={handleEditChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Correo Electrónico</label>
                          <input
                            type="email"
                            name="correo"
                            value={editForm.correo}
                            onChange={handleEditChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Teléfono</label>
                          <input
                            type="tel"
                            name="telefono"
                            value={editForm.telefono}
                            onChange={handleEditChange}
                            placeholder="Opcional"
                          />
                        </div>
                        <button type="submit" className="save-btn">
                          💾 Guardar Cambios
                        </button>
                      </form>
                    )}
                  </div>

                  <div className="profile-section-box">
                    <h2>Cambiar Contraseña</h2>
                    <form onSubmit={handlePasswordSubmit} className="password-form">
                      <div className="form-group">
                        <label>Contraseña Actual</label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          placeholder="••••••••"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Nueva Contraseña</label>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="••••••••"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Confirmar Nueva Contraseña</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder="••••••••"
                          required
                        />
                      </div>
                      <button type="submit" className="save-btn">
                        🔒 Actualizar Contraseña
                      </button>
                    </form>
                  </div>
                </div>

                {/* Estadísticas */}
                <div className="stats-section">
                  <h2>Resumen de Compras</h2>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <span className="stat-icon">📦</span>
                      <div className="stat-content">
                        <span className="stat-value">{stats.totalPedidos}</span>
                        <span className="stat-label">Pedidos Totales</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <span className="stat-icon">✅</span>
                      <div className="stat-content">
                        <span className="stat-value">{stats.pedidosEntregados}</span>
                        <span className="stat-label">Entregados</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <span className="stat-icon">🚚</span>
                      <div className="stat-content">
                        <span className="stat-value">{stats.pedidosEnviados}</span>
                        <span className="stat-label">En Camino</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <span className="stat-icon">💰</span>
                      <div className="stat-content">
                        <span className="stat-value">${stats.totalGastado.toLocaleString('es-AR')}</span>
                        <span className="stat-label">Total Gastado</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === 'pedidos' && (
              <div className="profile-content">
                <h1>Historial de Pedidos</h1>
                
                {loading ? (
                  <p className="loading-message">Cargando pedidos...</p>
                ) : pedidos.length === 0 ? (
                  <div className="no-orders">
                    <p>No tienes pedidos aún</p>
                    <button onClick={() => navigate('/')} className="shop-now-btn">
                      Ir a la tienda
                    </button>
                  </div>
                ) : (
                  <div className="orders-list">
                    {pedidos.map(pedido => (
                      <div key={pedido.id_pedido} className="order-card">
                        <div className="order-header">
                          <div>
                            <h3>Pedido #{pedido.id_pedido}</h3>
                            <p className="order-date">{formatFecha(pedido.fecha_pedido)}</p>
                          </div>
                          <span className={`order-badge ${getEstadoBadgeClass(pedido.estado)}`}>
                            {formatEstado(pedido.estado)}
                          </span>
                        </div>
                        
                        <div className="order-details">
                          <div className="order-info">
                            <p><strong>Dirección:</strong> {pedido.calle}, {pedido.ciudad}, {pedido.provincia}</p>
                            <p><strong>Método de pago:</strong> {pedido.metodo_pago}</p>
                            <p><strong>Items:</strong> {pedido.items?.length || 0} producto(s)</p>
                          </div>
                          <div className="order-total">
                            <span className="total-label">Total:</span>
                            <span className="total-amount">${parseFloat(pedido.monto_total).toLocaleString('es-AR')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;