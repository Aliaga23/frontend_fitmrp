import React, { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User } from "lucide-react";
import axios from '../api';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const { user,updateCartCount } = useContext(AuthContext);
  const [quantities, setQuantities] = useState({}); // Estado para almacenar la cantidad por producto
  const [cartCount, setCartCount] = useState(0); // Estado para el contador del carrito

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;



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
    if (user) updateCartCount(); // Actualizar el contador del carrito al cargar productos
  }, [user]);

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

  // Obtener o crear carrito
  const getOrCreateCart = async () => {
    try {
      const response = await axios.post('/carrito/get-or-create', { usuario_id: user.id });
      setCart(response.data);
      console.log("Carrito obtenido o creado:", response.data);
    } catch (error) {
      console.error("Error al obtener o crear el carrito:", error);
    }
  };

  // Manejar el cambio de cantidad específico por producto
  const handleQuantityChange = (productId, quantity) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: quantity,
    }));
  };

  // Añadir producto al carrito
  const addToCart = async (productId) => {
    const quantity = quantities[productId] || 1; // Usar cantidad seleccionada o 1 si no está definida
    try {
      const response = await axios.post('/carrito/add-item', {
        usuario_id: user.id,
        producto_id: productId,
        cantidad: quantity
      });
      setCart(response.data);
      console.log("Producto añadido al carrito:", response.data);
      updateCartCount(); // Actualiza el contador después de añadir el producto
    } catch (error) {
      console.error("Error al añadir producto al carrito:", error);
    }
  };

  // Remover producto del carrito
  const removeFromCart = async (productId) => {
    try {
      const response = await axios.delete('/carrito/remove-item', {
        data: { usuario_id: user.id, producto_id: productId }
      });
      setCart(response.data);
      console.log("Producto removido del carrito:", response.data);
      updateCartCount(); // Actualiza el contador después de eliminar el producto
    } catch (error) {
      console.error("Error al remover producto del carrito:", error);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      getOrCreateCart();
      updateCartCount();
    }
  }, [user]);

  // Obtener total de páginas
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1a1a1a', color: '#f0f0f0' }}>
      <Navbar cartCount={cartCount} /> {/* Pasamos el contador al componente Navbar */}

      {/* Main Content */}
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
                    <label htmlFor={`quantity-${product.id}`} className="text-white">Cantidad:</label>
                    <input
                      type="number"
                      id={`quantity-${product.id}`}
                      value={quantities[product.id] || 1}
                      min="1"
                      onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                      className="w-full p-2 mb-2 text-center bg-gray-700 text-white rounded"
                    />
                    <button
                      onClick={() => addToCart(product.id)}
                      className="w-full text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-gray-900 p-3 rounded-lg transition-colors duration-300 mb-2"
                    >
                      Agregar al Carrito
                    </button>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="w-full text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-gray-900 p-3 rounded-lg transition-colors duration-300"
                    >
                      Remover del Carrito
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

      {/* Footer */}
      <footer style={{ backgroundColor: '#1a1a1a', color: '#d1d1d1' }}>
        {/* Footer content here */}
      </footer>
    </div>
  );
};

export default ProductCatalog;
