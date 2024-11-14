// src/components/Navbar.js
import React, { useRef, useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, ShoppingCart } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const { user, cartCount, updateCartCount } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      updateCartCount(); // Actualizar el contador cuando el usuario esté autenticado
    }
  }, [user, cartCount]); // Escuchar cambios en cartCount para actualizaciones en tiempo real

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-transparent text-white p-4 fixed w-full z-20 top-0 left-0 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold tracking-wide text-orange-500">FitMRP</h1>

        <ul className="hidden md:flex space-x-6">
          {['Inicio', 'Productos', 'Planes', 'Contacto'].map((item) => (
            <li key={item}>
              <Link
                to={item === 'Inicio' ? '/' : item === 'Productos' ? '/catalogo' : '/'}
                className="hover:text-orange-500 transition duration-200 relative group"
              >
                {item}
                <span className="absolute left-0 right-0 h-1 bg-orange-500 scale-x-0 transition-transform duration-200 group-hover:scale-x-100"></span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="hidden md:flex items-center text-white font-bold">
              <span className="mr-2">Bienvenido, {user.nombre}</span>
              <Link to="/profile" className="text-white hover:text-orange-500 transition duration-300">
                <User className="w-6 h-6" />
              </Link>
            </div>
          ) : (
            <Link to="/login" className="hidden md:flex items-center border border-white text-white hover:text-black hover:bg-white transition duration-300 font-bold py-2 px-4 rounded-full">
              <User className="w-6 h-6 mr-2" />
              Iniciar Sesión
            </Link>
          )}

          {/* Carrito con contador */}
          <Link to="/cart" className="relative text-white hover:text-orange-500 transition duration-300">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          <div className="flex items-center md:hidden">
            <button
              ref={buttonRef}
              onClick={toggleMenu}
              className="ml-4 text-white focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div ref={menuRef} className="absolute top-16 left-0 right-0 mx-auto w-full bg-black bg-opacity-70 backdrop-blur-md p-4 rounded-lg shadow-lg z-30">
          <ul className="flex flex-col items-center space-y-4 text-lg">
            {['Inicio', 'Servicios', 'Planes', 'Contacto'].map((item) => (
              <li key={item}>
                <Link to={item === 'Inicio' ? '/' : `#${item.toLowerCase()}`} className="block py-2 px-4 hover:bg-gray-700 rounded-full transition duration-300 text-white" onClick={toggleMenu}>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
