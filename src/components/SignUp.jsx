import React, { useState } from "react";
import api from '../api'; // Importar la instancia de Axios

function SignUpForm() {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para manejar el envío

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const validateForm = () => {
    const { name, email, password } = state;
    if (!name || !email || !password) {
      setError("Todos los campos son obligatorios");
      return false;
    }
    // Validación básica del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("El email no es válido");
      return false;
    }
    return true;
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsSubmitting(true); // Deshabilitar el botón durante la solicitud
    try {
      const { name, email, password } = state;
      await api.post('/auth/signup', { nombre: name, email, password, rol_id: 2 }); // Ajusta `rol_id` según tu lógica

      setState({ name: "", email: "", password: "" });
    } catch (error) {
      setError(error.response?.data?.message || 'Error al registrar');
    } finally {
      setIsSubmitting(false); // Rehabilitar el botón después de la solicitud
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Registrarse</h1>
        <input
          type="text"
          name="name"
          value={state.name}
          onChange={handleChange}
          placeholder="Nombre"
        />
        <input
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Pass"
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registrando...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}

export default SignUpForm;
