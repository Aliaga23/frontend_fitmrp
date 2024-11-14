import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import fondoLanding from '../asset/fondo_landing.jpeg'; // Importamos la imagen
import '../LandingPage.css'; // Ajusta la ruta según sea necesario
import SportsApparelMRP from './SportsApparelMRP';  // Ajusta la ruta si es necesario
import Navbar from '../components/Navbar';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  
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
         
           <Navbar />

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
