import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Sin funcionalidad, solo visual
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-box">
          <div className="register-header">
            <h1>Crear Cuenta</h1>
            <p>Completa el formulario para registrarte</p>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Juan Pérez"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>

            <button type="button" className="register-button">
              Registrarse
            </button>
          </form>

          <div className="register-footer">
            <p>¿Ya tienes cuenta? <span className="link" onClick={() => navigate('/login')}>Inicia Sesión</span></p>
            <button onClick={() => navigate('/')} className="back-home-button" type="button">
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;