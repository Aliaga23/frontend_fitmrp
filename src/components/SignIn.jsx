import React from "react";
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import api from '../api'; // Importar la instancia de Axios

function SignInForm() {
  const [state, setState] = React.useState({
    email: "",
    password: ""
  });
  const [error, setError] = React.useState(null);
  const navigate = useNavigate(); // Inicializar useNavigate

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();

    try {
      // Hacer la solicitud al backend usando Axios
      const response = await api.post('/auth/login', state);

      // Guardar el token en el local storage
      localStorage.setItem('token', response.data.token);

      // Limpiar el formulario
      setState({ email: "", password: "" });

      // Redirigir a /usuario
      navigate('/usuario');

    } catch (error) {
      setError(error.response?.data?.message || 'Error al iniciar sesión');
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
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default SignInForm;
