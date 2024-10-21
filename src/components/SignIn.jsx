import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Asegúrate de que esta API esté correctamente configurada
import AuthContext from '../context/AuthContext'; // Importar el contexto

function SignInForm() {
  const [state, setState] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Para deshabilitar el botón
  const navigate = useNavigate();
  
  const { login } = useContext(AuthContext); // Usar la función de login del contexto

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const validateForm = () => {
    const { email, password } = state;
    if (!email || !password) {
      setError('Por favor, completa ambos campos.');
      return false;
    }
    return true;
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsSubmitting(true); // Deshabilitar el botón mientras se envía la solicitud
    try {
      const response = await api.post('/auth/login', state);

      if (response.data && response.data.token) {
        // Llamar a la función login del contexto con el token
        login(response.data.token);

        // Limpiar el formulario
        setState({ email: '', password: '' });

        // Redirigir al usuario autenticado
        navigate('/usuario');
      } else {
        throw new Error('Token no recibido');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setIsSubmitting(false); // Rehabilitar el botón
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Login</h1>

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={state.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={state.password}
          onChange={handleChange}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Iniciando sesión...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

export default SignInForm;
