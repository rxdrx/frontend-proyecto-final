import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/AdminDashboard.css';

const MENU_OPTIONS = [
  { key: 'principal', label: 'Principal' },
  { key: 'pedidos', label: 'Pedidos' },
  { key: 'usuarios', label: 'Usuarios' },
  { key: 'reportes', label: 'Reportes' },
  { key: 'facturas', label: 'Facturas' }
];

const estadisticas = [
  { title: 'Total Vendido', value: '$125,000', icon: '💰' },
  { title: 'Total Esperado', value: '$200,000', icon: '📈' },
  { title: 'Ventas Realizadas', value: '1,234', icon: '🛒' },
  { title: 'Visitantes', value: '8,900', icon: '👀' }
];

const pedidosMock = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  cliente: `Cliente ${i + 1}`,
  fecha: `2024-11-${10 + i}`,
  total: Math.floor(Math.random() * 10000 + 1000),
  estado: i % 2 === 0 ? 'Completado' : 'Pendiente'
}));

const usuariosMock = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  nombre: `Usuario ${i + 1}`,
  email: `usuario${i + 1}@correo.com`,
  fecha: `2024-10-${5 + i}`,
  estado: i % 2 === 0 ? 'Activo' : 'Suspendido'
}));

const facturasMock = Array.from({ length: 10 }, (_, i) => ({
  id: i + 100,
  cliente: `Cliente ${i + 1}`,
  fecha: `2024-09-${15 + i}`,
  total: Math.floor(Math.random() * 15000 + 2000),
  estado: i % 2 === 0 ? 'Pagada' : 'Pendiente'
}));

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState('principal');
  const [pedidosPage, setPedidosPage] = useState(1);
  const pedidosTotalPages = 5;
  const [usuariosPage, setUsuariosPage] = useState(1);
  const usuariosTotalPages = 3;
  const [facturasPage, setFacturasPage] = useState(1);
  const facturasTotalPages = 2;
  const navigate = useNavigate();

  return (
    <div className="admin-layout">
      {/* Menú lateral */}
      <aside className="admin-sidebar">
        <div className="admin-logo">Admin Panel</div>
        <nav className="admin-menu">
          {MENU_OPTIONS.map(opt => (
            <button
              key={opt.key}
              className={activeMenu === opt.key ? 'active' : ''}
              onClick={() => setActiveMenu(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </nav>
        <button
          className="admin-back-home"
          onClick={() => navigate('/')}
          type="button"
        >
          Volver al inicio
        </button>
      </aside>

      {/* Contenido principal */}
      <main className="admin-main">
        {/* Principal */}
        {activeMenu === 'principal' && (
          <div className="admin-principal">
            <h1 className="admin-title">Dashboard Principal</h1>
            <div className="admin-stats-row">
              <div className="admin-stats-col">
                {estadisticas.slice(0, 2).map(stat => (
                  <div className="admin-stat-card" key={stat.title}>
                    <div className="admin-stat-icon">{stat.icon}</div>
                    <div>
                      <div className="admin-stat-title">{stat.title}</div>
                      <div className="admin-stat-value">{stat.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="admin-stats-col">
                {estadisticas.slice(2, 4).map(stat => (
                  <div className="admin-stat-card" key={stat.title}>
                    <div className="admin-stat-icon">{stat.icon}</div>
                    <div>
                      <div className="admin-stat-title">{stat.title}</div>
                      <div className="admin-stat-value">{stat.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pedidos */}
        {activeMenu === 'pedidos' && (
          <div className="admin-section">
            <h1 className="admin-title">Gestión de Pedidos</h1>
            <div className="admin-toolbar">
              <button className="admin-add-btn">+ Añadir Pedido</button>
              <select className="admin-filter">
                <option>Filtrar por</option>
                <option>Más dinero</option>
                <option>Menos dinero</option>
              </select>
              <input className="admin-amount" type="number" min="1" max="100" defaultValue={10} />
              <input className="admin-search" type="text" placeholder="Buscar pedido..." />
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidosMock.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.cliente}</td>
                    <td>{p.fecha}</td>
                    <td>${p.total.toLocaleString('es-AR')}</td>
                    <td>{p.estado}</td>
                    <td>
                      <button className="admin-delete-btn">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="admin-pagination">
              <button
                disabled={pedidosPage === 1}
                onClick={() => setPedidosPage(pedidosPage - 1)}
              >
                &lt;
              </button>
              <span>Página {pedidosPage} de {pedidosTotalPages}</span>
              <button
                disabled={pedidosPage === pedidosTotalPages}
                onClick={() => setPedidosPage(pedidosPage + 1)}
              >
                &gt;
              </button>
            </div>
          </div>
        )}

        {/* Usuarios */}
        {activeMenu === 'usuarios' && (
          <div className="admin-section">
            <h1 className="admin-title">Gestión de Usuarios</h1>
            <div className="admin-toolbar">
              <button className="admin-add-btn">+ Añadir Usuario</button>
              <select className="admin-filter">
                <option>Filtrar por</option>
                <option>Activos</option>
                <option>Suspendidos</option>
              </select>
              <input className="admin-amount" type="number" min="1" max="100" defaultValue={10} />
              <input className="admin-search" type="text" placeholder="Buscar usuario..." />
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosMock.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.nombre}</td>
                    <td>{u.email}</td>
                    <td>{u.fecha}</td>
                    <td>{u.estado}</td>
                    <td>
                      <button className="admin-delete-btn">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="admin-pagination">
              <button
                disabled={usuariosPage === 1}
                onClick={() => setUsuariosPage(usuariosPage - 1)}
              >
                &lt;
              </button>
              <span>Página {usuariosPage} de {usuariosTotalPages}</span>
              <button
                disabled={usuariosPage === usuariosTotalPages}
                onClick={() => setUsuariosPage(usuariosPage + 1)}
              >
                &gt;
              </button>
            </div>
          </div>
        )}

        {/* Reportes */}
        {activeMenu === 'reportes' && (
          <div className="admin-section">
            <h1 className="admin-title">Reportes y Consultas</h1>
            <div className="admin-reportes-box">
              <p>Genera reportes personalizados sobre ventas, usuarios y pedidos.</p>
              <button className="admin-report-btn">Generar Reporte</button>
            </div>
          </div>
        )}

        {/* Facturas */}
        {activeMenu === 'facturas' && (
          <div className="admin-section">
            <h1 className="admin-title">Facturas</h1>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {facturasMock.map(f => (
                  <tr key={f.id}>
                    <td>{f.id}</td>
                    <td>{f.cliente}</td>
                    <td>{f.fecha}</td>
                    <td>${f.total.toLocaleString('es-AR')}</td>
                    <td>{f.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="admin-pagination">
              <button
                disabled={facturasPage === 1}
                onClick={() => setFacturasPage(facturasPage - 1)}
              >
                &lt;
              </button>
              <span>Página {facturasPage} de {facturasTotalPages}</span>
              <button
                disabled={facturasPage === facturasTotalPages}
                onClick={() => setFacturasPage(facturasPage + 1)}
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}