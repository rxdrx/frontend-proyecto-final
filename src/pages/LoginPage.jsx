import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../assets/styles/LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Validar email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'El correo electrónico es obligatorio';
    if (!emailRegex.test(email)) return 'El formato del correo no es válido';
    return '';
  };

  // Validar password
  const validatePassword = (password) => {
    if (!password) return 'La contraseña es obligatoria';
    if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    return '';
  };

  // Validar todos los campos
  const validateForm = () => {
    const newErrors = {};
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambio de email
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setLoginError(''); // Limpiar error de login
    if (touched.email) {
      const error = validateEmail(value);
      setErrors(prev => ({ ...prev, email: error }));
    }
  };

  // Manejar cambio de password
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setLoginError(''); // Limpiar error de login
    if (touched.password) {
      const error = validatePassword(value);
      setErrors(prev => ({ ...prev, password: error }));
    }
  };

  // Manejar blur (cuando el usuario sale del campo)
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (field === 'email') {
      const error = validateEmail(email);
      setErrors(prev => ({ ...prev, email: error }));
    } else if (field === 'password') {
      const error = validatePassword(password);
      setErrors(prev => ({ ...prev, password: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setLoginError('');
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        const result = await login(email, password);
        
        if (result.success) {
          // Redirigir a home para todos los usuarios
          navigate('/');
        } else {
          setLoginError(result.error);
        }
      } catch (error) {
        setLoginError('Error al conectar con el servidor');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <h1>Iniciar Sesión</h1>
            <p>Ingresa tus credenciales para continuar</p>
          </div>

          {loginError && (
            <div className="alert alert-error">
              {loginError}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => handleBlur('email')}
                placeholder="ejemplo@correo.com"
                className={errors.email && touched.email ? 'input-error' : ''}
                disabled={isLoading}
              />
              {errors.email && touched.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => handleBlur('password')}
                placeholder="••••••••"
                className={errors.password && touched.password ? 'input-error' : ''}
                disabled={isLoading}
              />
              {errors.password && touched.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="login-footer">
            <p>¿No tienes cuenta? <span className="link" onClick={() => navigate('/register')}>Regístrate</span></p>
            <button onClick={() => navigate('/')} className="back-home-button" type="button">
              Volver al inicio
            </button>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default LoginPage;