import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import apiClient from '../services/api';
import MainLayout from '../layouts/MainLayout';
import '../assets/styles/AdminDashboard.css';

const MENU_OPTIONS = [
  { key: 'principal', label: 'Principal' },
  { key: 'pedidos', label: 'Pedidos' },
  { key: 'usuarios', label: 'Usuarios' },
  { key: 'productos', label: 'Productos' },
  { key: 'reportes', label: 'Reportes' }
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState('principal');
  const [loading, setLoading] = useState(true);
  
  // Estados de datos
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  
  // Estados de filtros
  const [pedidosFilter, setPedidosFilter] = useState('');
  const [usuariosFilter, setUsuariosFilter] = useState('');
  const [searchPedidos, setSearchPedidos] = useState('');
  const [searchUsuarios, setSearchUsuarios] = useState('');
  const [searchProductos, setSearchProductos] = useState('');

  // Estados para modal de producto
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    nombre: '',
    descripcion: '',
    marca: '',
    precio: '',
    porcentaje_descuento: 0,
    id_categoria: '',
    url_imagen: '',
    genero: 'unisex',
    color: ''
  });

  // Estados para reportes
  const [reportType, setReportType] = useState('ventas');
  const [reportPeriod, setReportPeriod] = useState('mes');

  // Redirigir si no es admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadPedidos(),
        loadUsuarios(),
        loadProductos(),
        loadCategorias()
      ]);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPedidos = async () => {
    try {
      const response = await apiClient.get('/pedidos');
      setPedidos(response.data.data || []);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      setPedidos([]);
    }
  };

  const loadUsuarios = async () => {
    try {
      const response = await apiClient.get('/usuarios');
      setUsuarios(response.data.data || []);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setUsuarios([]);
    }
  };

  const loadProductos = async () => {
    try {
      const response = await productService.getAll();
      setProductos(response.data || []);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setProductos([]);
    }
  };

  const loadCategorias = async () => {
    try {
      const response = await apiClient.get('/categorias');
      setCategorias(response.data.data || []);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setCategorias([]);
    }
  };

  // Calcular estadísticas
  const stats = {
    totalVendido: pedidos
      .filter(p => p.estado === 'entregado')
      .reduce((acc, p) => acc + parseFloat(p.monto_total || 0), 0),
    totalPendiente: pedidos
      .filter(p => p.estado !== 'entregado' && p.estado !== 'cancelado')
      .reduce((acc, p) => acc + parseFloat(p.monto_total || 0), 0),
    ventasRealizadas: pedidos.filter(p => p.estado === 'entregado').length,
    totalUsuarios: usuarios.length,
    totalProductos: productos.length,
    pedidosPendientes: pedidos.filter(p => p.estado === 'pendiente').length
  };

  // Filtrar datos
  const pedidosFiltrados = pedidos.filter(pedido => {
    const matchesSearch = searchPedidos === '' || 
      pedido.id_pedido.toString().includes(searchPedidos) ||
      pedido.id_usuario.toString().includes(searchPedidos);
    const matchesFilter = pedidosFilter === '' || pedido.estado === pedidosFilter;
    return matchesSearch && matchesFilter;
  });

  const usuariosFiltrados = usuarios.filter(usuario => {
    const matchesSearch = searchUsuarios === '' ||
      usuario.nombre.toLowerCase().includes(searchUsuarios.toLowerCase()) ||
      usuario.correo.toLowerCase().includes(searchUsuarios.toLowerCase());
    const matchesFilter = usuariosFilter === '' || usuario.rol === usuariosFilter;
    return matchesSearch && matchesFilter;
  });

  const productosFiltrados = productos.filter(producto => {
    const matchesSearch = searchProductos === '' ||
      producto.nombre.toLowerCase().includes(searchProductos.toLowerCase()) ||
      producto.marca.toLowerCase().includes(searchProductos.toLowerCase());
    return matchesSearch;
  });

  // Handlers
  const handleDeletePedido = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este pedido?')) {
      try {
        await apiClient.delete(`/pedidos/${id}`);
        alert('Pedido eliminado exitosamente');
        loadPedidos();
      } catch (error) {
        alert('Error al eliminar el pedido');
        console.error(error);
      }
    }
  };

  const handleDeleteUsuario = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await apiClient.delete(`/usuarios/${id}`);
        alert('Usuario eliminado exitosamente');
        loadUsuarios();
      } catch (error) {
        alert('Error al eliminar el usuario');
        console.error(error);
      }
    }
  };

  const handleDeleteProducto = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await productService.delete(id);
        alert('Producto eliminado exitosamente');
        loadProductos();
      } catch (error) {
        alert('Error al eliminar el producto');
        console.error(error);
      }
    }
  };

  const handleUpdatePedidoEstado = async (id, nuevoEstado) => {
    try {
      await apiClient.put(`/pedidos/${id}`, { estado: nuevoEstado });
      alert('Estado actualizado exitosamente');
      loadPedidos();
    } catch (error) {
      alert('Error al actualizar el estado');
      console.error(error);
    }
  };

  // Producto Modal
  const openProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        nombre: product.nombre,
        descripcion: product.descripcion || '',
        marca: product.marca,
        precio: product.precio,
        porcentaje_descuento: product.porcentaje_descuento || 0,
        id_categoria: product.id_categoria,
        url_imagen: product.url_imagen || '',
        genero: product.genero || 'unisex',
        color: product.color || ''
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        nombre: '',
        descripcion: '',
        marca: '',
        precio: '',
        porcentaje_descuento: 0,
        id_categoria: '',
        url_imagen: '',
        genero: 'unisex',
        color: ''
      });
    }
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        await productService.update(editingProduct.id_producto, productForm);
        alert('Producto actualizado exitosamente');
      } else {
        await productService.create(productForm);
        alert('Producto creado exitosamente');
      }
      closeProductModal();
      loadProductos();
    } catch (error) {
      alert('Error al guardar el producto');
      console.error(error);
    }
  };

  // Generar Reportes
  const generarReporte = () => {
    let data = [];
    let filename = '';
    let headers = [];

    if (reportType === 'ventas') {
      const pedidosFiltrados = filtrarPedidosPorPeriodo(pedidos);
      data = pedidosFiltrados.map(p => ({
        'ID Pedido': p.id_pedido,
        'Fecha': formatFecha(p.fecha_pedido),
        'Cliente ID': p.id_usuario,
        'Total': parseFloat(p.monto_total).toFixed(2),
        'Estado': formatEstado(p.estado),
        'Ciudad': p.ciudad,
        'Método Pago': p.metodo_pago
      }));
      filename = `reporte_ventas_${reportPeriod}_${new Date().toISOString().split('T')[0]}.csv`;
      headers = ['ID Pedido', 'Fecha', 'Cliente ID', 'Total', 'Estado', 'Ciudad', 'Método Pago'];
    } else if (reportType === 'productos') {
      data = productos.map(p => ({
        'ID': p.id_producto,
        'Nombre': p.nombre,
        'Marca': p.marca,
        'Precio': parseFloat(p.precio).toFixed(2),
        'Descuento': p.porcentaje_descuento + '%',
        'Categoría': p.id_categoria,
        'Género': p.genero,
        'Color': p.color || 'N/A'
      }));
      filename = `reporte_productos_${new Date().toISOString().split('T')[0]}.csv`;
      headers = ['ID', 'Nombre', 'Marca', 'Precio', 'Descuento', 'Categoría', 'Género', 'Color'];
    } else if (reportType === 'usuarios') {
      data = usuarios.map(u => ({
        'ID': u.id_usuario,
        'Nombre': `${u.nombre} ${u.apellido}`,
        'Email': u.correo,
        'Teléfono': u.telefono || 'N/A',
        'Rol': u.rol,
        'Fecha Registro': formatFecha(u.fecha_creacion)
      }));
      filename = `reporte_usuarios_${new Date().toISOString().split('T')[0]}.csv`;
      headers = ['ID', 'Nombre', 'Email', 'Teléfono', 'Rol', 'Fecha Registro'];
    }

    descargarCSV(data, headers, filename);
  };

  const filtrarPedidosPorPeriodo = (pedidos) => {
    const ahora = new Date();
    const filtrados = pedidos.filter(p => {
      const fechaPedido = new Date(p.fecha_pedido);
      
      if (reportPeriod === 'hoy') {
        return fechaPedido.toDateString() === ahora.toDateString();
      } else if (reportPeriod === 'semana') {
        const unaSemanaAtras = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
        return fechaPedido >= unaSemanaAtras;
      } else if (reportPeriod === 'mes') {
        return fechaPedido.getMonth() === ahora.getMonth() && 
               fechaPedido.getFullYear() === ahora.getFullYear();
      } else if (reportPeriod === 'año') {
        return fechaPedido.getFullYear() === ahora.getFullYear();
      }
      return true;
    });
    
    return filtrados;
  };

  const descargarCSV = (data, headers, filename) => {
    if (data.length === 0) {
      alert('No hay datos para generar el reporte');
      return;
    }

    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Utilidades
  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getEstadoClass = (estado) => {
    switch (estado) {
      case 'entregado': return 'status-success';
      case 'enviado':
      case 'en_proceso': return 'status-warning';
      case 'pendiente': return 'status-info';
      case 'cancelado': return 'status-danger';
      default: return 'status-default';
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

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <MainLayout>
      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-logo">
            <span className="admin-logo-icon">⚙️</span>
            <span>Admin Panel</span>
          </div>
          <div className="admin-user-info">
            <div className="admin-avatar">
              {user.nombre?.charAt(0).toUpperCase()}
            </div>
            <div className="admin-user-details">
              <p className="admin-user-name">{user.nombre}</p>
              <p className="admin-user-role">Administrador</p>
            </div>
          </div>
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
            className="admin-logout"
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            🚪 Cerrar Sesión
          </button>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {loading ? (
            <div className="admin-loading">Cargando datos...</div>
          ) : (
            <>
              {/* Principal */}
              {activeMenu === 'principal' && (
                <div className="admin-principal">
                  <h1 className="admin-title">Dashboard Principal</h1>
                  
                  <div className="admin-stats-grid">
                    <div className="admin-stat-card">
                      <div className="admin-stat-icon">💰</div>
                      <div className="admin-stat-content">
                        <div className="admin-stat-title">Total Vendido</div>
                        <div className="admin-stat-value">${stats.totalVendido.toLocaleString('es-AR')}</div>
                      </div>
                    </div>
                    
                    <div className="admin-stat-card">
                      <div className="admin-stat-icon">⏳</div>
                      <div className="admin-stat-content">
                        <div className="admin-stat-title">Total Pendiente</div>
                        <div className="admin-stat-value">${stats.totalPendiente.toLocaleString('es-AR')}</div>
                      </div>
                    </div>
                    
                    <div className="admin-stat-card">
                      <div className="admin-stat-icon">✅</div>
                      <div className="admin-stat-content">
                        <div className="admin-stat-title">Ventas Realizadas</div>
                        <div className="admin-stat-value">{stats.ventasRealizadas}</div>
                      </div>
                    </div>
                    
                    <div className="admin-stat-card">
                      <div className="admin-stat-icon">📦</div>
                      <div className="admin-stat-content">
                        <div className="admin-stat-title">Pedidos Pendientes</div>
                        <div className="admin-stat-value">{stats.pedidosPendientes}</div>
                      </div>
                    </div>
                    
                    <div className="admin-stat-card">
                      <div className="admin-stat-icon">👥</div>
                      <div className="admin-stat-content">
                        <div className="admin-stat-title">Total Usuarios</div>
                        <div className="admin-stat-value">{stats.totalUsuarios}</div>
                      </div>
                    </div>
                    
                    <div className="admin-stat-card">
                      <div className="admin-stat-icon">👟</div>
                      <div className="admin-stat-content">
                        <div className="admin-stat-title">Total Productos</div>
                        <div className="admin-stat-value">{stats.totalProductos}</div>
                      </div>
                    </div>
                  </div>

                  <div className="admin-recent-section">
                    <h2>Pedidos Recientes</h2>
                    <div className="admin-recent-list">
                      {pedidos.slice(0, 5).map(pedido => (
                        <div key={pedido.id_pedido} className="admin-recent-item">
                          <div className="admin-recent-info">
                            <span className="admin-recent-title">Pedido #{pedido.id_pedido}</span>
                            <span className="admin-recent-date">{formatFecha(pedido.fecha_pedido)}</span>
                          </div>
                          <div className="admin-recent-details">
                            <span className={`admin-status-badge ${getEstadoClass(pedido.estado)}`}>
                              {formatEstado(pedido.estado)}
                            </span>
                            <span className="admin-recent-amount">${parseFloat(pedido.monto_total).toLocaleString('es-AR')}</span>
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
                    <select 
                      className="admin-filter"
                      value={pedidosFilter}
                      onChange={(e) => setPedidosFilter(e.target.value)}
                    >
                      <option value="">Todos los estados</option>
                      <option value="pendiente">Pendientes</option>
                      <option value="en_proceso">En Proceso</option>
                      <option value="enviado">Enviados</option>
                      <option value="entregado">Entregados</option>
                      <option value="cancelado">Cancelados</option>
                    </select>
                    <input 
                      className="admin-search" 
                      type="text" 
                      placeholder="Buscar por ID..." 
                      value={searchPedidos}
                      onChange={(e) => setSearchPedidos(e.target.value)}
                    />
                    <button className="admin-refresh-btn" onClick={loadPedidos}>
                      🔄 Actualizar
                    </button>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Usuario ID</th>
                          <th>Fecha</th>
                          <th>Total</th>
                          <th>Estado</th>
                          <th>Dirección</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pedidosFiltrados.length === 0 ? (
                          <tr>
                            <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                              No hay pedidos que mostrar
                            </td>
                          </tr>
                        ) : (
                          pedidosFiltrados.map(pedido => (
                            <tr key={pedido.id_pedido}>
                              <td>#{pedido.id_pedido}</td>
                              <td>{pedido.id_usuario}</td>
                              <td>{formatFecha(pedido.fecha_pedido)}</td>
                              <td>${parseFloat(pedido.monto_total).toLocaleString('es-AR')}</td>
                              <td>
                                <span className={`admin-status-badge ${getEstadoClass(pedido.estado)}`}>
                                  {formatEstado(pedido.estado)}
                                </span>
                              </td>
                              <td>{pedido.ciudad}, {pedido.provincia}</td>
                              <td>
                                <div className="admin-actions">
                                  <select 
                                    value={pedido.estado}
                                    onChange={(e) => handleUpdatePedidoEstado(pedido.id_pedido, e.target.value)}
                                    className="admin-status-select"
                                  >
                                    <option value="pendiente">Pendiente</option>
                                    <option value="en_proceso">En Proceso</option>
                                    <option value="enviado">Enviado</option>
                                    <option value="entregado">Entregado</option>
                                    <option value="cancelado">Cancelado</option>
                                  </select>
                                  <button 
                                    className="admin-delete-btn"
                                    onClick={() => handleDeletePedido(pedido.id_pedido)}
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="admin-table-footer">
                    <p>Total: {pedidosFiltrados.length} pedidos</p>
                  </div>
                </div>
              )}

              {/* Usuarios */}
              {activeMenu === 'usuarios' && (
                <div className="admin-section">
                  <h1 className="admin-title">Gestión de Usuarios</h1>
                  
                  <div className="admin-toolbar">
                    <select 
                      className="admin-filter"
                      value={usuariosFilter}
                      onChange={(e) => setUsuariosFilter(e.target.value)}
                    >
                      <option value="">Todos los roles</option>
                      <option value="cliente">Clientes</option>
                      <option value="administrador">Administradores</option>
                    </select>
                    <input 
                      className="admin-search" 
                      type="text" 
                      placeholder="Buscar por nombre o email..." 
                      value={searchUsuarios}
                      onChange={(e) => setSearchUsuarios(e.target.value)}
                    />
                    <button className="admin-refresh-btn" onClick={loadUsuarios}>
                      🔄 Actualizar
                    </button>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Email</th>
                          <th>Teléfono</th>
                          <th>Rol</th>
                          <th>Fecha Registro</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usuariosFiltrados.length === 0 ? (
                          <tr>
                            <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                              No hay usuarios que mostrar
                            </td>
                          </tr>
                        ) : (
                          usuariosFiltrados.map(usuario => (
                            <tr key={usuario.id_usuario}>
                              <td>{usuario.id_usuario}</td>
                              <td>{usuario.nombre} {usuario.apellido}</td>
                              <td>{usuario.correo}</td>
                              <td>{usuario.telefono || 'N/A'}</td>
                              <td>
                                <span className={`admin-role-badge ${usuario.rol === 'administrador' ? 'role-admin' : 'role-client'}`}>
                                  {usuario.rol === 'administrador' ? '👑 Admin' : '👤 Cliente'}
                                </span>
                              </td>
                              <td>{formatFecha(usuario.fecha_creacion)}</td>
                              <td>
                                <button 
                                  className="admin-delete-btn"
                                  onClick={() => handleDeleteUsuario(usuario.id_usuario)}
                                  disabled={usuario.id_usuario === user.id}
                                >
                                  🗑️
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="admin-table-footer">
                    <p>Total: {usuariosFiltrados.length} usuarios</p>
                  </div>
                </div>
              )}

              {/* Productos */}
              {activeMenu === 'productos' && (
                <div className="admin-section">
                  <h1 className="admin-title">Gestión de Productos</h1>
                  
                  <div className="admin-toolbar">
                    <button className="admin-add-btn" onClick={() => openProductModal()}>
                      + Añadir Producto
                    </button>
                    <input 
                      className="admin-search" 
                      type="text" 
                      placeholder="Buscar producto..." 
                      value={searchProductos}
                      onChange={(e) => setSearchProductos(e.target.value)}
                    />
                    <button className="admin-refresh-btn" onClick={loadProductos}>
                      🔄 Actualizar
                    </button>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Imagen</th>
                          <th>Nombre</th>
                          <th>Marca</th>
                          <th>Precio</th>
                          <th>Descuento</th>
                          <th>Categoría</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productosFiltrados.length === 0 ? (
                          <tr>
                            <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                              No hay productos que mostrar
                            </td>
                          </tr>
                        ) : (
                          productosFiltrados.map(producto => (
                            <tr key={producto.id_producto}>
                              <td>{producto.id_producto}</td>
                              <td>
                                <img 
                                  src={producto.url_imagen || 'https://via.placeholder.com/50'} 
                                  alt={producto.nombre}
                                  className="admin-product-img"
                                />
                              </td>
                              <td>{producto.nombre}</td>
                              <td>{producto.marca}</td>
                              <td>${parseFloat(producto.precio).toLocaleString('es-AR')}</td>
                              <td>{producto.porcentaje_descuento}%</td>
                              <td>{producto.id_categoria}</td>
                              <td>
                                <div className="admin-actions">
                                  <button 
                                    className="admin-edit-btn"
                                    onClick={() => openProductModal(producto)}
                                  >
                                    ✏️
                                  </button>
                                  <button 
                                    className="admin-delete-btn"
                                    onClick={() => handleDeleteProducto(producto.id_producto)}
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="admin-table-footer">
                    <p>Total: {productosFiltrados.length} productos</p>
                  </div>
                </div>
              )}

              {/* Reportes */}
              {activeMenu === 'reportes' && (
                <div className="admin-section">
                  <h1 className="admin-title">Generador de Reportes</h1>
                  
                  <div className="admin-reportes-container">
                    <div className="admin-reportes-card">
                      <h2>📊 Configuración del Reporte</h2>
                      
                      <div className="report-form">
                        <div className="form-group">
                          <label>Tipo de Reporte</label>
                          <select 
                            value={reportType} 
                            onChange={(e) => setReportType(e.target.value)}
                            className="report-select"
                          >
                            <option value="ventas">Reporte de Ventas</option>
                            <option value="productos">Reporte de Productos</option>
                            <option value="usuarios">Reporte de Usuarios</option>
                          </select>
                        </div>
                        
                        {reportType === 'ventas' && (
                          <div className="form-group">
                            <label>Período</label>
                            <select 
                              value={reportPeriod} 
                              onChange={(e) => setReportPeriod(e.target.value)}
                              className="report-select"
                            >
                              <option value="hoy">Hoy</option>
                              <option value="semana">Última Semana</option>
                              <option value="mes">Este Mes</option>
                              <option value="año">Este Año</option>
                              <option value="total">Todo el Tiempo</option>
                            </select>
                          </div>
                        )}
                        
                        <button className="generate-report-btn" onClick={generarReporte}>
                          📥 Descargar Reporte (CSV)
                        </button>
                      </div>
                    </div>

                    <div className="admin-reportes-card">
                      <h2>📈 Resumen</h2>
                      <div className="report-summary">
                        {reportType === 'ventas' && (
                          <>
                            <div className="summary-item">
                              <span className="summary-label">Total de Ventas:</span>
                              <span className="summary-value">{filtrarPedidosPorPeriodo(pedidos).length}</span>
                            </div>
                            <div className="summary-item">
                              <span className="summary-label">Monto Total:</span>
                              <span className="summary-value">
                                ${filtrarPedidosPorPeriodo(pedidos).reduce((acc, p) => acc + parseFloat(p.monto_total || 0), 0).toLocaleString('es-AR')}
                              </span>
                            </div>
                            <div className="summary-item">
                              <span className="summary-label">Ventas Completadas:</span>
                              <span className="summary-value">
                                {filtrarPedidosPorPeriodo(pedidos).filter(p => p.estado === 'entregado').length}
                              </span>
                            </div>
                          </>
                        )}
                        {reportType === 'productos' && (
                          <>
                            <div className="summary-item">
                              <span className="summary-label">Total de Productos:</span>
                              <span className="summary-value">{productos.length}</span>
                            </div>
                            <div className="summary-item">
                              <span className="summary-label">Productos con Descuento:</span>
                              <span className="summary-value">
                                {productos.filter(p => p.porcentaje_descuento > 0).length}
                              </span>
                            </div>
                          </>
                        )}
                        {reportType === 'usuarios' && (
                          <>
                            <div className="summary-item">
                              <span className="summary-label">Total de Usuarios:</span>
                              <span className="summary-value">{usuarios.length}</span>
                            </div>
                            <div className="summary-item">
                              <span className="summary-label">Clientes:</span>
                              <span className="summary-value">
                                {usuarios.filter(u => u.rol === 'cliente').length}
                              </span>
                            </div>
                            <div className="summary-item">
                              <span className="summary-label">Administradores:</span>
                              <span className="summary-value">
                                {usuarios.filter(u => u.rol === 'administrador').length}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Modal de Producto */}
      {showProductModal && (
        <div className="modal-overlay" onClick={closeProductModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button className="modal-close" onClick={closeProductModal}>✕</button>
            </div>
            
            <form className="modal-form" onSubmit={handleProductSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={productForm.nombre}
                    onChange={handleProductFormChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Marca *</label>
                  <input
                    type="text"
                    name="marca"
                    value={productForm.marca}
                    onChange={handleProductFormChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={productForm.descripcion}
                  onChange={handleProductFormChange}
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Precio *</label>
                  <input
                    type="number"
                    name="precio"
                    value={productForm.precio}
                    onChange={handleProductFormChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Descuento (%)</label>
                  <input
                    type="number"
                    name="porcentaje_descuento"
                    value={productForm.porcentaje_descuento}
                    onChange={handleProductFormChange}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Categoría *</label>
                  <select
                    name="id_categoria"
                    value={productForm.id_categoria}
                    onChange={handleProductFormChange}
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map(cat => (
                      <option key={cat.id_categoria} value={cat.id_categoria}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Género</label>
                  <select
                    name="genero"
                    value={productForm.genero}
                    onChange={handleProductFormChange}
                  >
                    <option value="hombre">Hombre</option>
                    <option value="mujer">Mujer</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Color</label>
                  <input
                    type="text"
                    name="color"
                    value={productForm.color}
                    onChange={handleProductFormChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>URL Imagen</label>
                  <input
                    type="url"
                    name="url_imagen"
                    value={productForm.url_imagen}
                    onChange={handleProductFormChange}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeProductModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  {editingProduct ? 'Actualizar' : 'Crear'} Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}