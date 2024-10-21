import React, { useState, useEffect } from 'react';
import axios from '../api';
import { FaPlus, FaEye, FaBars, FaStar } from 'react-icons/fa';
import Sidebar from './SideBar';
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import StarRating from './StarRating'; // Importar el componente de estrellas

const EvaluacionProveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [selectedProveedor, setSelectedProveedor] = useState('');
  const [formState, setFormState] = useState({
    puntaje: '',
    fecha_evaluacion: '',
    observaciones: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    fetchProveedores();
    fetchEvaluacionesTotales();
  }, []);

  // Obtener la lista de proveedores
  const fetchProveedores = async () => {
    try {
      const response = await axios.get('/proveedores');
      setProveedores(response.data);
    } catch (error) {
      console.error('Error al obtener los proveedores:', error);
    }
  };

  // Obtener el total de evaluaciones
  const fetchEvaluacionesTotales = async () => {
    try {
      const response = await axios.get('/evaluaciones-proveedores');
      setEvaluaciones(response.data);
    } catch (error) {
      console.error('Error al obtener las evaluaciones:', error);
    }
  };

  // Obtener evaluaciones de un proveedor específico
  const fetchEvaluaciones = async (proveedor_id) => {
    try {
      const response = await axios.get(`/evaluaciones-proveedores/proveedor/${proveedor_id}`);
      setEvaluaciones(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error al obtener las evaluaciones:', error);
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
    if (!selectedProveedor) newErrors.proveedor_id = 'Proveedor es requerido';
    if (!formState.puntaje) newErrors.puntaje = 'Puntaje es requerido';
    if (!formState.fecha_evaluacion) newErrors.fecha_evaluacion = 'Fecha de evaluación es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Registrar nueva evaluación
  const registerEvaluacion = async () => {
    if (validateForm()) {
      try {
        const { puntaje, fecha_evaluacion, observaciones } = formState;
        await axios.post('/evaluaciones-proveedores', {
          proveedor_id: selectedProveedor,
          puntaje,
          fecha_evaluacion,
          observaciones,
        });
        fetchEvaluaciones(selectedProveedor);
        resetForm();
      } catch (error) {
        console.error('Error al registrar la evaluación:', error);
      }
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormState({
      puntaje: '',
      fecha_evaluacion: '',
      observaciones: '',
    });
    setErrors({});
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = proveedores.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(proveedores.length / itemsPerPage);

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
          <h1 className="text-3xl font-semibold">Evaluación de Proveedores</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white focus:outline-none md:hidden">
            <FaBars />
          </button>
        </header>

        <main className="flex-1 p-6 md:p-8">
          {/* Box para el total de proveedores */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-700">Total de Proveedores</h3>
              <p className="text-3xl font-bold text-gray-900">{proveedores.length}</p>
            </div>
            <FaEye className="text-5xl text-gray-400" />
          </div>

          {/* Box para el total de evaluaciones */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-700">Total de Evaluaciones</h3>
              <p className="text-3xl font-bold text-gray-900">{evaluaciones.length}</p>
            </div>
            <FaStar className="text-5xl text-gray-400" />
          </div>

          {/* Formulario de Registro */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-6">Registrar Evaluación</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="relative">
                <label htmlFor="proveedor_id" className="block text-gray-700 font-medium mb-2">Proveedor</label>
                <select
                  id="proveedor_id"
                  value={selectedProveedor}
                  onChange={(e) => setSelectedProveedor(e.target.value)}
                  className={`border p-3 rounded-lg w-full ${errors.proveedor_id ? 'border-red-500' : ''}`}
                >
                  <option value="">Seleccionar proveedor</option>
                  {proveedores.map((proveedor) => (
                    <option key={proveedor.id} value={proveedor.id}>
                      {proveedor.nombre}
                    </option>
                  ))}
                </select>
                {errors.proveedor_id && <p className="text-red-500 text-sm mt-2">{errors.proveedor_id}</p>}
              </div>

              <div className="relative">
                <label htmlFor="puntaje" className="block text-gray-700 font-medium mb-2">Puntaje</label>
                <input
                  type="number"
                  id="puntaje"
                  placeholder="Puntaje (0-5)"
                  value={formState.puntaje}
                  onChange={handleInputChange}
                  className={`border p-3 rounded-lg w-full ${errors.puntaje ? 'border-red-500' : ''}`}
                />
                {errors.puntaje && <p className="text-red-500 text-sm mt-2">{errors.puntaje}</p>}
              </div>

              <div className="relative">
                <label htmlFor="fecha_evaluacion" className="block text-gray-700 font-medium mb-2">Fecha Evaluación</label>
                <input
                  type="date"
                  id="fecha_evaluacion"
                  value={formState.fecha_evaluacion}
                  onChange={handleInputChange}
                  className={`border p-3 rounded-lg w-full ${errors.fecha_evaluacion ? 'border-red-500' : ''}`}
                />
                {errors.fecha_evaluacion && <p className="text-red-500 text-sm mt-2">{errors.fecha_evaluacion}</p>}
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
                onClick={registerEvaluacion}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition duration-200 flex items-center"
              >
                <FaPlus className="mr-2" /> Registrar Evaluación
              </button>
            </div>
          </div>

          {/* Tabla de Proveedores con botón "Ver Evaluaciones" */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <table className="min-w-full table-auto border-collapse border border-gray-400">
              <thead className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">Proveedor</th>
                  <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wider border border-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-400">
                {currentItems.map((proveedor) => (
                  <tr key={proveedor.id} className="hover:bg-gray-100 transition duration-200">
                    <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">{proveedor.nombre}</td>
                    <td className="px-6 py-4 text-right text-sm border border-gray-400">
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={() => fetchEvaluaciones(proveedor.id)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition duration-200 flex items-center"
                        >
                          <FaEye className="mr-2" /> Ver Evaluaciones
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

          {/* Modal para mostrar evaluaciones del proveedor */}
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
              <h3 className="text-2xl font-semibold mb-6">Evaluaciones del Proveedor</h3>
              {evaluaciones.length > 0 ? (
                <ol className="relative border-l border-gray-300">
                  {evaluaciones.map((evaluacion, index) => (
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
                        <h3 className="text-lg font-semibold text-gray-900">Puntaje: {evaluacion.puntaje}</h3>
                        {/* Añadir componente de estrellas aquí */}
                        <StarRating puntaje={evaluacion.puntaje} />
                        <time className="block mt-2 mb-2 text-sm font-normal leading-none text-gray-500">{new Date(evaluacion.fecha_evaluacion).toLocaleDateString()}</time>
                        <p className="text-base font-normal text-gray-600">{evaluacion.observaciones}</p>
                      </div>
                    </motion.li>
                  ))}
                </ol>
              ) : (
                <p className="text-center text-gray-600">No hay evaluaciones registradas para este proveedor.</p>
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
          &copy; {new Date().getFullYear()} Evaluación de Proveedores. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

export default EvaluacionProveedores;
