// frontend/components/SignUpForm.js
import React from "react";
import api from '../api'; // Importar la instancia de Axios

function SignUpForm() {
  const [state, setState] = React.useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = React.useState(null);

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
      const { name, email, password } = state;
      await api.post('/auth/signup', { nombre: name, email, password, rol_id: 2 }); // Ajusta `rol_id` según tu lógica

      setState({ name: "", email: "", password: "" });
    } catch (error) {
      setError(error.response?.data?.message || 'Error al registrar');
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpForm;
