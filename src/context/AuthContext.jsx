import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import axios from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Estado para almacenar los datos del usuario
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0); // Nuevo estado para contar productos en el carrito

  useEffect(() => {
    // Comprobar si el token está en el localStorage al iniciar la app
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token); // Decodificar el token para obtener los datos del usuario
        setUser(decodedUser); // Guardar los datos decodificados en el estado `user`
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token inválido o expirado:", error);
        setIsAuthenticated(false);
        setUser(null);
      }
    }
    setLoading(false); // Finaliza la carga después de verificar el token
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    const decodedUser = jwtDecode(token); // Decodificar el token al iniciar sesión
    setUser(decodedUser); // Guardar los datos del usuario en el estado `user`
    console.log("Datos del usuario extraídos del token:", decodedUser);
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };
  // Función para actualizar el contador del carrito
  const updateCartCount = async () => {
    try {
      const response = await axios.get(`/carrito/items-count/${user.id}`);
      setCartCount(response.data.count);
    } catch (error) {
      console.error("Error al obtener el conteo de productos en el carrito:", error);
    }
  };
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading ,cartCount, setCartCount, updateCartCount}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
