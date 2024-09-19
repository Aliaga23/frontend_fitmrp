import React, { useState, useEffect } from 'react';
import axios from '../api';
import { FaPlus, FaBars, FaEye } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Sidebar from './SideBar';

const Movimientos = () => {
  const [productos, setProductos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState('');
  const [formState, setFormState] = useState({
    lote_id: '',
    tipo_movimiento: '',
    cantidad: '',
    observaciones: '',
  });
  const [showTimeline, setShowTimeline] = useState(false);
  const [errors, setErrors] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchProductos();
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

  // Obtener movimientos de un producto específico
  const fetchMovimientos = async (producto_id) => {
    try {
      const response = await axios.get(`/movements/producto/${producto_id}`);
      setMovimientos(response.data);
      setShowTimeline(true);
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

  // Finalizar trazabilidad
  const finalizarTrazabilidad = () => {
    setShowTimeline(false);
    setMovimientos([]);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <header className="flex justify-between items-center bg-white p-4 shadow-md">
          <div className="text-2xl font-semibold text-gray-800">Movimientos de Productos</div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 focus:outline-none md:hidden">
            <FaBars />
          </button>
        </header>

        <main className="flex-1 p-4 md:p-6">
          {/* Formulario de Registro */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-lg font-semibold mb-6">Registrar Movimiento</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
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
              <div>
                <label htmlFor="lote_id" className="block text-gray-700 font-medium mb-2">Lote ID</label>
                <input
                  type="text"
                  id="lote_id"
                  placeholder="ID del lote"
                  value={formState.lote_id}
                  onChange={handleInputChange}
                  className="border p-3 rounded-lg w-full"
                />
              </div>
              <div>
                <label htmlFor="tipo_movimiento" className="block text-gray-700 font-medium mb-2">Tipo de Movimiento</label>
                <input
                  type="text"
                  id="tipo_movimiento"
                  placeholder="Tipo de movimiento"
                  value={formState.tipo_movimiento}
                  onChange={handleInputChange}
                  className={`border p-3 rounded-lg w-full ${errors.tipo_movimiento ? 'border-red-500' : ''}`}
                />
                {errors.tipo_movimiento && <p className="text-red-500 text-sm mt-2">{errors.tipo_movimiento}</p>}
              </div>
              <div>
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
              <div>
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
                className="bg-green-600 text-white p-3 rounded-lg shadow-lg hover:bg-green-700 transition duration-300 flex items-center"
              >
                <FaPlus className="mr-2" /> Registrar Movimiento
              </button>
            </div>
          </div>

          {/* Tabla de Productos con botón "Ver" */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-lg font-semibold mb-4">Productos</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-600 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productos.map((producto) => (
                  <tr key={producto.id} className="hover:bg-gray-50 transition duration-200">
                    <td className="px-6 py-4 text-sm text-gray-800">{producto.nombre}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => fetchMovimientos(producto.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                      >
                        <FaEye className="mr-2" /> Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Timeline de Movimientos */}
          {showTimeline && movimientos.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md mt-8">
              <h3 className="text-lg font-semibold mb-6">Timeline de Movimientos</h3>
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
              <div className="flex justify-end mt-6">
                <button
                  onClick={finalizarTrazabilidad}
                  className="bg-red-600 text-white p-3 rounded-lg shadow-lg hover:bg-red-700 transition duration-300"
                >
                  Finalizar Trazabilidad
                </button>
              </div>
            </div>
          )}
        </main>

        <footer className="bg-white p-4 text-center text-gray-500 shadow-inner text-lg">
          &copy; {new Date().getFullYear()} Movimientos de Productos. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

export default Movimientos;
