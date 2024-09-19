import React, { useState, useEffect } from 'react';
import axios from '../api';
import { FaPlus, FaBars, FaEye } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Sidebar from './SideBar'; // Importa el componente Sidebar

const ControlCalidad = () => {
  const [productos, setProductos] = useState([]);
  const [controlCalidad, setControlCalidad] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState('');
  const [formState, setFormState] = useState({
    resultado: '',
    observaciones: '',
  });
  const [showTable, setShowTable] = useState(false);
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

  // Obtener registros de control de calidad de un producto específico
  const fetchControlCalidad = async (producto_id) => {
    try {
      const response = await axios.get(`/quality-controls/producto/${producto_id}`);
      setControlCalidad(response.data);
      setShowTable(true); // Mostrar la tabla cuando se haga clic en "Ver"
    } catch (error) {
      console.error('Error al obtener el control de calidad:', error);
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
    if (!formState.resultado) newErrors.resultado = 'Resultado es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Registrar control de calidad
  const registerControlCalidad = async () => {
    if (validateForm()) {
      try {
        const { resultado, observaciones } = formState;
        await axios.post('/quality-controls', {
          producto_id: selectedProducto,
          resultado,
          observaciones,
        });
        fetchControlCalidad(selectedProducto); // Refrescar los registros
        resetForm();
      } catch (error) {
        console.error('Error al registrar el control de calidad:', error);
      }
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormState({
      resultado: '',
      observaciones: '',
    });
    setErrors({});
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center bg-white p-4 shadow-md mb-4">
          <div className="text-2xl font-semibold text-gray-800">Gestión de Control de Calidad</div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 focus:outline-none md:hidden">
            <FaBars />
          </button>
        </header>

        <main className="flex-1 p-4 md:p-6">
          {/* Formulario de Registro */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-lg font-semibold mb-6">Registrar Control de Calidad</h3>
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
                <label htmlFor="resultado" className="block text-gray-700 font-medium mb-2">Resultado</label>
                <select
                  id="resultado"
                  value={formState.resultado}
                  onChange={handleInputChange}
                  className={`border p-3 rounded-lg w-full ${errors.resultado ? 'border-red-500' : ''}`}
                >
                  <option value="">Seleccionar resultado</option>
                  <option value="aprobado">Aprobado</option>
                  <option value="rechazado">Rechazado</option>
                </select>
                {errors.resultado && <p className="text-red-500 text-sm mt-2">{errors.resultado}</p>}
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
                onClick={registerControlCalidad}
                className="bg-green-600 text-white p-3 rounded-lg shadow-lg hover:bg-green-700 transition duration-300 flex items-center"
              >
                <FaPlus className="mr-2" /> Registrar Control
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
                        onClick={() => fetchControlCalidad(producto.id)}
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

          {/* Tabla de Control de Calidad */}
          {showTable && controlCalidad.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md mt-8">
              <h3 className="text-lg font-semibold mb-6">Control de Calidad</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Resultado</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Observaciones</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Fecha</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {controlCalidad.map((control, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="hover:bg-gray-50 transition duration-200"
                    >
                                            <td className="px-6 py-4 text-sm text-gray-800">{control.resultado}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{control.observaciones}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{new Date(control.fecha_control).toLocaleString()}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>

        <footer className="bg-white p-4 text-center text-gray-500 shadow-inner text-lg">
          &copy; {new Date().getFullYear()} Gestión de Control de Calidad. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

export default ControlCalidad;

