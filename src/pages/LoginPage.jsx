import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <h1>Iniciar Sesión</h1>
            <p>Ingresa tus credenciales para continuar</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button type="button" className="login-button">
              Iniciar Sesión
            </button>
          </form>

          <div className="login-footer">
            <p>¿No tienes cuenta? <span className="link" onClick={() => navigate('/register')}>Regístrate</span></p>
            <button onClick={() => navigate('/')} className="back-home-button" type="button">
              Volver al inicio
            </button>
          </div>
        </div>

        {/* Botones temporales fuera de la caja */}
        <div className="temp-buttons">
          <p className="temp-label">Accesos temporales (solo prueba):</p>
          <button 
            type="button" 
            className="temp-button user-button"
            onClick={() => navigate('/profile')}
          >
            Ir a Perfil Usuario
          </button>
          <button 
            type="button" 
            className="temp-button admin-button"
            onClick={() => navigate('/admin')}
          >
            Ir a Dashboard Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;