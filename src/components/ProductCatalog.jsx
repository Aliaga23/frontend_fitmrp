import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User } from "lucide-react";
import axios from '../api';
import { Link } from 'react-router-dom';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9; // Definimos cuántos productos por página queremos mostrar

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products');
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = parseFloat(product.precio) >= priceRange[0] && parseFloat(product.precio) <= priceRange[1];
      return matchesSearch && matchesPrice;
    });
    setFilteredProducts(filtered);
  }, [searchTerm, priceRange, products]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Calcular productos mostrados en la página actual
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Cambiar página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Obtener el total de páginas
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1a1a1a', color: '#f0f0f0' }}>
      {/* Navbar */}
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
          <Link to="/login" className="hidden md:flex items-center border border-white text-white hover:text-black hover:bg-white transition duration-300 font-bold py-2 px-4 rounded-full">
            <User className="w-6 h-6 mr-2" />
            Iniciar Sesión
          </Link>
          <div className="flex items-center md:hidden">
            <Link to="/login" className="text-white">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-gray-200 transition duration-300">
                <User className="w-5 h-5" />
              </div>
            </Link>
            <button
              ref={buttonRef}
              onClick={toggleMenu}
              className="ml-4 text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute top-16 left-0 right-0 mx-auto w-full bg-black bg-opacity-70 backdrop-blur-md p-4 rounded-lg shadow-lg z-30"
          >
            <ul className="flex flex-col items-center space-y-4 text-lg">
              {['Inicio', 'Servicios', 'Planes', 'Contacto'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'Inicio' ? '/' : `#${item.toLowerCase()}`}
                    className="block py-2 px-4 hover:bg-gray-700 rounded-full transition duration-300 text-white"
                    onClick={toggleMenu}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      <div className="pt-24 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-500 mb-8 text-center">FitMRP SHOP</h1>

        <div className="mb-8 p-6 rounded-lg shadow-lg" style={{ backgroundColor: '#2a2a2a' }}>
          <div className="flex flex-wrap gap-4 items-end">
            {/* Input de búsqueda */}
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="search" className="mb-2 block text-white">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="search"
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 p-2 bg-gray-700 text-white border border-gray-600 rounded-lg w-full"
                  style={{ backgroundColor: '#333', color: '#f0f0f0' }}
                />
              </div>
            </div>

            {/* Rango de precios */}
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="price-range" className="mb-2 block text-white">
                Rango de Precios: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <input
                type="range"
                id="price-range"
                min="0"
                max="300"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full text-orange-500"
                style={{ color: '#ff6700' }}
              />
            </div>
          </div>
        </div>

        {/* Productos */}
        <AnimatePresence>
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {currentProducts.map((product) => (
      <motion.div
        key={product.id}
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105"
        style={{ backgroundColor: '#2a2a2a' }}
      >
        <div className="p-6 flex flex-col justify-between h-full">
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">{product.nombre}</h2>
            <p className="text-2xl font-bold text-orange-500 mb-4">
              ${parseFloat(product.precio).toFixed(2)}
            </p>
          </div>
          <div>
            <button
              className="w-full text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-gray-900 p-3 rounded-lg transition-colors duration-300"
              style={{ backgroundColor: '#ff6700', color: '#fff' }}
            >
              Agregar al Carrito
            </button>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
</AnimatePresence>


        {/* Paginación */}
        <div className="mt-8 flex justify-center">
          <ul className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <li key={index}>
                <button
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 rounded ${currentPage === index + 1 ? 'bg-orange-500 text-white' : 'bg-gray-700 text-white'} hover:bg-orange-500 transition-colors`}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>

      </div>

      <footer style={{ backgroundColor: '#1a1a1a', color: '#d1d1d1' }}>
        <div className="container px-4 py-12 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-1 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#f0f0f0' }}>Sobre Nosotros</h3>
              <p className="mb-4">Somos una marca líder en ropa deportiva, comprometida con la calidad y la innovación para atletas de todos los niveles.</p>
              <div className="flex space-x-4">
                <a href="/" style={{ color: '#d1d1d1' }} className="hover:text-gray-200">Facebook</a>
                <a href="/" style={{ color: '#d1d1d1' }} className="hover:text-gray-200">Instagram</a>
                <a href="/" style={{ color: '#d1d1d1' }} className="hover:text-gray-200">Twitter</a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#f0f0f0' }}>Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-orange-500">Inicio</Link></li>
                <li><Link to="/catalogo" className="hover:text-orange-500">Productos</Link></li>
                <li><Link to="/" className="hover:text-orange-500">Sobre Nosotros</Link></li>
                <li><Link to="/" className="hover:text-orange-500">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#f0f0f0' }}>Soporte</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-orange-500">FAQ</Link></li>
                <li><Link to="/" className="hover:text-orange-500">Envíos</Link></li>
                <li><Link to="/" className="hover:text-orange-500">Devoluciones</Link></li>
                <li><Link to="/" className="hover:text-orange-500">Tallas</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#f0f0f0' }}>Boletín</h3>
              <p className="mb-4">Suscríbete para recibir las últimas noticias y ofertas exclusivas.</p>
              <form className="flex flex-col space-y-2">
                <input type="email" placeholder="Tu email" className="px-4 py-2 rounded" style={{ backgroundColor: '#333', color: '#f0f0f0' }} />
                <button type="submit" className="px-4 py-2 text-white rounded hover:bg-orange-600 transition-colors" style={{ backgroundColor: '#ff6700' }}>Suscribirse</button>
              </form>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p>&copy; 2024 FitMRP. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductCatalog;
