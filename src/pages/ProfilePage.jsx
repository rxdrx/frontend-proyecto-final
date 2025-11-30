import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('perfil');

  // Datos mockeados
  const usuario = {
    nombre: 'Juan Pérez',
    email: 'juan.perez@email.com',
    direccion: 'Av. Siempre Viva 123, Buenos Aires',
    telefono: '+54 9 11 1234-5678',
    fechaRegistro: '2024-01-15'
  };

  const pedidosMock = [
    { id: 1, producto: 'Nike Air Max 270', fecha: '2024-05-10', estado: 'Entregado', total: 25000 },
    { id: 2, producto: 'Adidas Ultraboost', fecha: '2024-04-22', estado: 'En camino', total: 28000 }
  ];

  // Estadísticas mockeadas
  const stats = {
    totalPedidos: pedidosMock.length,
    pedidosRecibidos: pedidosMock.filter(p => p.estado === 'Entregado').length,
    pedidosEnCamino: pedidosMock.filter(p => p.estado === 'En camino').length,
    totalGastado: pedidosMock.reduce((acc, p) => acc + p.total, 0)
  };

  return (
    <div className="profile-layout">
      {/* Sidebar */}
      <aside className="profile-sidebar">
        <nav className="profile-menu">
          <button
            className={activeSection === 'perfil' ? 'active' : ''}
            onClick={() => setActiveSection('perfil')}
          >
            👤 Perfil
          </button>
          <button
            className={activeSection === 'pedidos' ? 'active' : ''}
            onClick={() => setActiveSection('pedidos')}
          >
            📦 Pedidos
          </button>
        </nav>
        <button className="profile-logout" onClick={() => navigate('/')}>
          Volver al inicio
        </button>
      </aside>

      {/* Main Content: 3 columns */}
      <main className="profile-main profile-main-3col">
        {/* Columna 1: Foto y datos breves */}
        <section className="profile-col profile-col-left">
          <div className="profile-avatar-large">JP</div>
          <div className="profile-brief">
            <p className="profile-brief-name">{usuario.nombre}</p>
            <p className="profile-brief-email">{usuario.email}</p>
            <p className="profile-brief-date">Miembro desde {usuario.fechaRegistro}</p>
          </div>
        </section>

        {/* Columna 2: Datos completos y cambio de contraseña */}
        <section className="profile-col profile-col-center">
          {activeSection === 'perfil' && (
            <div className="profile-section">
              <h1>Datos de Usuario</h1>
              <div className="profile-card">
                <div className="profile-card-details">
                  <div className="profile-row">
                    <span className="profile-label">Nombre:</span>
                    <span className="profile-value">{usuario.nombre}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Email:</span>
                    <span className="profile-value">{usuario.email}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Dirección:</span>
                    <span className="profile-value">{usuario.direccion}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Teléfono:</span>
                    <span className="profile-value">{usuario.telefono}</span>
                  </div>
                </div>
                <button className="edit-profile-btn">
                  Editar datos
                </button>
              </div>
              <div className="profile-change-form">
                <h2>Cambiar Contraseña</h2>
                <form>
                  <div className="form-group">
                    <label htmlFor="current-password">Contraseña Actual</label>
                    <input
                      type="password"
                      id="current-password"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="new-password">Nueva Contraseña</label>
                    <input
                      type="password"
                      id="new-password"
                      placeholder="••••••••"
                    />
                  </div>
                  <button type="button" className="change-btn">
                    Guardar Cambios
                  </button>
                </form>
              </div>
            </div>
          )}
          {activeSection === 'pedidos' && (
            <div className="profile-section">
              <h1>Mis Pedidos</h1>
              <table className="profile-orders">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Producto</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosMock.map(pedido => (
                    <tr key={pedido.id}>
                      <td>{pedido.id}</td>
                      <td>{pedido.producto}</td>
                      <td>{pedido.fecha}</td>
                      <td>{pedido.estado}</td>
                      <td>${pedido.total.toLocaleString('es-AR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Columna 3: Estadísticas */}
        <section className="profile-col profile-col-right">
          <div className="profile-stats-card">
            <h2>Estadísticas</h2>
            <div className="profile-stat">
              <span>Pedidos totales:</span>
              <strong>{stats.totalPedidos}</strong>
            </div>
            <div className="profile-stat">
              <span>Pedidos recibidos:</span>
              <strong>{stats.pedidosRecibidos}</strong>
            </div>
            <div className="profile-stat">
              <span>Pedidos en camino:</span>
              <strong>{stats.pedidosEnCamino}</strong>
            </div>
            <div className="profile-stat">
              <span>Total gastado:</span>
              <strong>${stats.totalGastado.toLocaleString('es-AR')}</strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;