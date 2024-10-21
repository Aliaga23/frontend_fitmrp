import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  // Esperar hasta que la autenticación haya sido verificada
  if (loading) {
    return <div>Cargando...</div>; // Puedes reemplazarlo con un spinner u otra cosa
  }

  // Si el usuario no está autenticado, redirige a la página de inicio de sesión
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderiza el componente que corresponde a la ruta
  return element;
};

export default ProtectedRoute;
