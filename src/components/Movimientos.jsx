import React, { useState, useEffect } from 'react';
import axios from '../api';
import { FaPlus, FaBars, FaEye, FaBox, FaChartLine } from 'react-icons/fa';
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import Sidebar from './SideBar';

const Movimientos = () => {
  const [productos, setProductos] = useState([]);
  const [lotes, setLotes] = useState([]); // Nuevo estado para los lotes
  const [movimientos, setMovimientos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState('');
  const [formState, setFormState] = useState({
    lote_id: '',
    tipo_movimiento: '',
    cantidad: '',
    observaciones: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    fetchProductos();
    fetchLotes(); // Llamada para obtener los lotes disponibles
    fetchMovimientosTotales();
  }, []);

  // Obtener la lista de productos
  const fetchProductos = async () => {
    try {
      const response = await axios.get('/products');
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  // Obtener la lista de lotes
  const fetchLotes = async () => {
    try {
      const response = await axios.get('/lots'); // Suponiendo que tienes una API para lotes
      setLotes(response.data);
    } catch (error) {
      console.error('Error al obtener los lotes:', error);
    }
  };

  // Obtener el total de movimientos
  const fetchMovimientosTotales = async () => {
    try {
      const response = await axios.get('/movements');
      setMovimientos(response.data);
    } catch (error) {
      console.error('Error al obtener los movimientos:', error);
    }
  };

  // Obtener movimientos de un producto específico
  const fetchMovimientos = async (producto_id) => {
    try {
      const response = await axios.get(`/movements/producto/${producto_id}`);
      setMovimientos(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error al obtener los movimientos:', error);
    }
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState({ ...formState, [id]: value });
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    if (!selectedProducto) newErrors.producto_id = 'Producto es requerido';
    if (!formState.lote_id) newErrors.lote_id = 'Lote es requerido'; // Validar el lote
    if (!formState.tipo_movimiento) newErrors.tipo_movimiento = 'Tipo de movimiento es requerido';
    if (!formState.cantidad) newErrors.cantidad = 'Cantidad es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Registrar nuevo movimiento
  const registerMovimiento = async () => {
    if (validateForm()) {
      try {
        const { lote_id, tipo_movimiento, cantidad, observaciones } = formState;
        await axios.post('/movements', {
          producto_id: selectedProducto,
          lote_id,
          tipo_movimiento,
          cantidad,
          observaciones,
        });
        fetchMovimientos(selectedProducto);
        resetForm();
      } catch (error) {
        console.error('Error al registrar el movimiento:', error);
      }
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormState({
      lote_id: '',
      tipo_movimiento: '',
      cantidad: '',
      observaciones: '',
    });
    setErrors({});
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(productos.length / itemsPerPage);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      {/* Sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <header className="flex justify-between items-center bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 shadow-md">
          <h1 className="text-3xl font-semibold">Movimientos de Productos</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white focus:outline-none md:hidden">
            <FaBars />
          </button>
        </header>

        <main className="flex-1 p-6 md:p-8">
          {/* Box para el total de productos */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-700">Total de Productos</h3>
              <p className="text-3xl font-bold text-gray-900">{productos.length}</p>
            </div>
            <FaBox className="text-5xl text-gray-400" />
          </div>

          {/* Box para el total de movimientos */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-700">Total de Movimientos</h3>
              <p className="text-3xl font-bold text-gray-900">{movimientos.length}</p>
            </div>
            <FaChartLine className="text-5xl text-gray-400" />
          </div>

          {/* Formulario de Registro */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-6">Registrar Movimiento</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="relative">
                <label htmlFor="producto_id" className="block text-gray-700 font-medium mb-2">Producto</label>
                <select
                  id="producto_id"
                  value={selectedProducto}
                  onChange={(e) => setSelectedProducto(e.target.value)}
                  className={`border p-3 rounded-lg w-full ${errors.producto_id ? 'border-red-500' : ''}`}
                >
                  <option value="">Seleccionar producto</option>
                  {productos.map((producto) => (
                    <option key={producto.id} value={producto.id}>
                      {producto.nombre}
                    </option>
                  ))}
                </select>
                {errors.producto_id && <p className="text-red-500 text-sm mt-2">{errors.producto_id}</p>}
              </div>

              <div className="relative">
                <label htmlFor="lote_id" className="block text-gray-700 font-medium mb-2">Lote</label>
                <select
                  id="lote_id"
                  value={formState.lote_id}
                  onChange={handleInputChange}
                  className={`border p-3 rounded-lg w-full ${errors.lote_id ? 'border-red-500' : ''}`}
                >
                  <option value="">Seleccionar lote</option>
                  {lotes.map((lote) => (
                    <option key={lote.id} value={lote.id}>
                      {lote.numero_lote} {/* Asumiendo que el lote tiene un nombre */}
                    </option>
                  ))}
                </select>
                {errors.lote_id && <p className="text-red-500 text-sm mt-2">{errors.lote_id}</p>}
              </div>

              <div className="relative">
                <label htmlFor="tipo_movimiento" className="block text-gray-700 font-medium mb-2">Tipo de Movimiento</label>
                <input
                  type="text"
                  id="tipo_movimiento"
                  placeholder="Tipo de movimiento"
                  value={formState.tipo_movimiento}
                  onChange={handleInputChange}
                  className={`border p-3 rounded-lg w-full ${errors.tipo_movimiento ? 'border-red-500' : ''
                  }`}
                  />
                  {errors.tipo_movimiento && <p className="text-red-500 text-sm mt-2">{errors.tipo_movimiento}</p>}
                </div>
  
                <div className="relative">
                  <label htmlFor="cantidad" className="block text-gray-700 font-medium mb-2">Cantidad</label>
                  <input
                    type="number"
                    id="cantidad"
                    placeholder="Cantidad"
                    value={formState.cantidad}
                    onChange={handleInputChange}
                    className={`border p-3 rounded-lg w-full ${errors.cantidad ? 'border-red-500' : ''}`}
                  />
                  {errors.cantidad && <p className="text-red-500 text-sm mt-2">{errors.cantidad}</p>}
                </div>
  
                <div className="relative">
                  <label htmlFor="observaciones" className="block text-gray-700 font-medium mb-2">Observaciones</label>
                  <textarea
                    id="observaciones"
                    placeholder="Observaciones"
                    value={formState.observaciones}
                    onChange={handleInputChange}
                    className="border p-3 rounded-lg w-full"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={registerMovimiento}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition duration-200 flex items-center"
                >
                  <FaPlus className="mr-2" /> Registrar Movimiento
                </button>
              </div>
            </div>
  
            {/* Tabla de Productos con botón "Ver" */}
<div className="bg-white p-6 rounded-lg shadow-md mb-8">
  <table className="min-w-full table-auto border-collapse border border-gray-400">
    <thead className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <tr>
        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">Nombre</th>
        <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wider border border-gray-600">Acciones</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-400">
      {currentItems.map((producto) => (
        <tr key={producto.id} className="hover:bg-gray-100 transition duration-200">
          <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">{producto.nombre}</td>
          <td className="px-6 py-4 text-right text-sm border border-gray-400">
            <div className="flex space-x-2 justify-end">
              <button
                onClick={() => fetchMovimientos(producto.id)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition duration-200 flex items-center"
              >
                <FaEye className="mr-2" /> Ver Movimientos
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* Paginación */}
  <div className="flex justify-between items-center mt-4">
    <button
      onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
      disabled={currentPage === 1}
      className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-3 rounded-lg shadow-md disabled:bg-gray-300 hover:bg-gray-700 transition duration-200"
    >
      Anterior
    </button>
    <span className="text-lg">Página {currentPage} de {totalPages}</span>
    <button
      onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-3 rounded-lg shadow-md disabled:bg-gray-300 hover:bg-gray-700 transition duration-200"
    >
      Siguiente
    </button>
  </div>
</div>

            {/* Modal para Timeline de Movimientos */}
            <Modal
              isOpen={showModal}
              onRequestClose={() => setShowModal(false)}
              className="flex items-center justify-center fixed inset-0 z-50"
              overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl"
              >
                <h3 className="text-2xl font-semibold mb-6">Timeline de Movimientos</h3>
                {movimientos.length > 0 ? (
                  <ol className="relative border-l border-gray-300">
                    {movimientos.map((movimiento, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="mb-10 ml-4"
                      >
                        <div className="absolute w-8 h-8 bg-blue-600 rounded-full -left-4 flex items-center justify-center">
                          <span className="text-white font-semibold">{index + 1}</span>
                        </div>
                        <div className="mt-2 p-4 bg-gray-100 rounded-lg shadow-md">
                          <h3 className="text-lg font-semibold text-gray-900">{movimiento.tipo_movimiento}</h3>
                          <time className="block mb-2 text-sm font-normal leading-none text-gray-500">{new Date(movimiento.fecha).toLocaleString()}</time>
                          <p className="text-base font-normal text-gray-600">{movimiento.observaciones}</p>
                        </div>
                      </motion.li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-center text-gray-600">No hay movimientos registrados para este producto.</p>
                )}
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-red-600 text-white p-3 rounded-lg shadow-lg hover:bg-red-700 transition duration-300"
                  >
                    Cerrar
                  </button>
                </div>
              </motion.div>
            </Modal>
          </main>
  
          <footer className="bg-white p-6 text-center text-gray-500 shadow-inner text-lg">
            &copy; {new Date().getFullYear()} Movimientos de Productos. Todos los derechos reservados.
          </footer>
        </div>
      </div>
    );
  };
  
  export default Movimientos;
  