import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react'; // Importamos el icono de usuario
import fondoLanding from '../asset/fondo_landing.jpeg'; // Importamos la imagen
import '../LandingPage.css'; // Ajusta la ruta según sea necesario
import SportsApparelMRP from './SportsApparelMRP';  // Ajusta la ruta si es necesario

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = (e) => {
    if (
      menuRef.current && !menuRef.current.contains(e.target) &&
      buttonRef.current && !buttonRef.current.contains(e.target)
    ) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen text-white font-sans" style={{ background: 'linear-gradient(135deg, #1a1a1a, #2c2c2c)' }}>
      {/* Navbar */}
      <nav className="bg-transparent text-white p-4 fixed w-full z-20 top-0 left-0 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold tracking-wide text-orange-500">FitMRP</h1>
          {/* Menú normal en pantallas grandes */}
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
          {/* Icono de iniciar sesión solo en pantallas grandes */}
          <Link to="/login" className="hidden md:flex items-center border border-white text-white hover:text-black hover:bg-white transition duration-300 font-bold py-2 px-4 rounded-full">
            <User className="w-6 h-6 mr-2" />
            Iniciar Sesión
          </Link>
          {/* Botón de menú para móviles */}
          <div className="flex items-center md:hidden">
            {/* Icono de usuario para iniciar sesión */}
            <Link to="/login" className="text-white">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-gray-200 transition duration-300">
                <User className="w-5 h-5" />
              </div>
            </Link>
            {/* Botón de hamburguesa */}
            <button ref={buttonRef} onClick={toggleMenu} className="ml-4 text-white focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Menú desplegable para móviles */}
        {isMenuOpen && (
          <div ref={menuRef} className="absolute top-16 left-0 right-0 mx-auto w-full bg-black bg-opacity-70 backdrop-blur-md p-4 rounded-lg shadow-lg z-30">
            <ul className="flex flex-col items-center space-y-4 text-lg">
              {['Inicio', 'Productos', 'Planes', 'Contacto'].map((item) => (
                <li key={item}>
                  <Link to={item === 'Inicio' ? '/' : item === 'Productos' ? '/catalogo' : '/'} className="block py-2 px-4 hover:bg-gray-700 rounded-full transition duration-300 text-white" onClick={toggleMenu}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div
        className="hero-section relative flex items-center justify-center"
        style={{
          backgroundImage: `url(${fondoLanding})`,
        }}
      >
         <div className="absolute inset-0 bg-black opacity-50"></div>

{/* Contenido del Hero */}
<div className="relative z-10 text-center text-white px-4">
  <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-orange-100 relative">
    <span className="typing-animation">¡Bienvenido a FitMRP!</span>
    <span className="absolute left-0 right-0 bottom-[-10px] w-full h-1 bg-orange-500 animate-laser"></span>
  </h1>
  <p className="text-base md:text-xl font-semibold mb-6">
    Gestiona inventarios, optimiza la producción y asegura la trazabilidad <br className="hidden md:block" /> con nuestra plataforma de gestión integral.
  </p>
  <div className="mt-8 flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
    <Link
      to="/register"
      className="bg-orange-500 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full hover:bg-orange-600 transition duration-300"
    >
      Registrarse
    </Link>
    <Link
      to="/catalogo"
      className="bg-transparent border border-orange-500 text-orange-500 font-bold py-2 px-4 md:py-3 md:px-6 rounded-full hover:bg-orange-500 hover:text-white transition duration-300"
    >
      Explorar Productos
    </Link>
  </div>
</div>
      </div>

      {/* Sección de Pricing */}
      <SportsApparelMRP />
    </div>
  );
};

export default LandingPage;
