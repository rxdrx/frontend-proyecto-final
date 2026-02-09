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
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validaciones
  const validateNombre = (nombre) => {
    if (!nombre.trim()) return 'El nombre es obligatorio';
    if (nombre.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres';
    return '';
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'El correo electrónico es obligatorio';
    if (!emailRegex.test(email)) return 'El formato del correo no es válido';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'La contraseña es obligatoria';
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    if (!/(?=.*[a-z])/.test(password)) return 'Debe contener al menos una letra minúscula';
    if (!/(?=.*[A-Z])/.test(password)) return 'Debe contener al menos una letra mayúscula';
    if (!/(?=.*\d)/.test(password)) return 'Debe contener al menos un número';
    return '';
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return 'Debes confirmar la contraseña';
    if (confirmPassword !== password) return 'Las contraseñas no coinciden';
    return '';
  };

  // Validar todo el formulario
  const validateForm = () => {
    const newErrors = {};
    const nombreError = validateNombre(formData.nombre);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);

    if (nombreError) newErrors.nombre = nombreError;
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validar en tiempo real si el campo ya fue tocado
    if (touched[name]) {
      let error = '';
      switch (name) {
        case 'nombre':
          error = validateNombre(value);
          break;
        case 'email':
          error = validateEmail(value);
          break;
        case 'password':
          error = validatePassword(value);
          // Si cambia la contraseña, revalidar confirmPassword también
          if (touched.confirmPassword) {
            const confirmError = validateConfirmPassword(formData.confirmPassword, value);
            setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
          }
          break;
        case 'confirmPassword':
          error = validateConfirmPassword(value, formData.password);
          break;
        default:
          break;
      }
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    let error = '';
    switch (field) {
      case 'nombre':
        error = validateNombre(formData.nombre);
        break;
      case 'email':
        error = validateEmail(formData.email);
        break;
      case 'password':
        error = validatePassword(formData.password);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(formData.confirmPassword, formData.password);
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Marcar todos los campos como tocados
    setTouched({
      nombre: true,
      email: true,
      password: true,
      confirmPassword: true
    });
    
    if (validateForm()) {
      // Aquí iría la lógica de registro
      console.log('Formulario válido', formData);
      alert('¡Registro exitoso! (Simulado)');
      // navigate('/login'); // Redirigir al login después del registro
    }
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
                onBlur={() => handleBlur('nombre')}
                placeholder="Juan Pérez"
                className={errors.nombre && touched.nombre ? 'input-error' : ''}
              />
              {errors.nombre && touched.nombre && (
                <span className="error-message">{errors.nombre}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                placeholder="ejemplo@correo.com"
                className={errors.email && touched.email ? 'input-error' : ''}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur('password')}
                placeholder="••••••••"
                className={errors.password && touched.password ? 'input-error' : ''}
              />
              {errors.password && touched.password && (
                <span className="error-message">{errors.password}</span>
              )}
              <small className="password-hint">Mínimo 8 caracteres, una mayúscula, una minúscula y un número</small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={() => handleBlur('confirmPassword')}
                placeholder="••••••••"
                className={errors.confirmPassword && touched.confirmPassword ? 'input-error' : ''}
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>

            <button type="submit" className="register-button">
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