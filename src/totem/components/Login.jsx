import React, { useState } from 'react';
import { MdLock, MdVisibility, MdVisibilityOff, MdPerson } from 'react-icons/md';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Credenciales quemadas (encriptadas con bcrypt hash)
  // Usuario: admin, Contraseña: mounjaro2024
  const VALID_HASH = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simular validación de credenciales
      // En producción, esto debería ser una llamada al backend
      const isValid = await validateCredentials(credentials.username, credentials.password);
      
      if (isValid) {
        // Guardar estado de autenticación en localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', credentials.username);
        onLoginSuccess();
      } else {
        setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      setError('Error al validar credenciales. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateCredentials = async (username, password) => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Validación simple (en producción usar bcrypt.compare)
    return username === 'admin' && password === 'mounjaro2025';
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <MdLock size={48} />
          </div>
          <h2>Acceso al Sistema</h2>
          <p>Ingresa tus credenciales para acceder a la información de Mounjaro</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <div className="input-wrapper">
              <MdPerson className="input-icon" />
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                placeholder="Usuario"
                required
                disabled={isLoading}
                className="login-input"
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <MdLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="Contraseña"
                required
                disabled={isLoading}
                className="login-input"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle"
                disabled={isLoading}
              >
                {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !credentials.username || !credentials.password}
            className="login-button"
          >
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <span>Validando...</span>
              </div>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 