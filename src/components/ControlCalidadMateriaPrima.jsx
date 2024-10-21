import React, { useState, useEffect } from 'react';
import axios from '../api';
import { FaPlus, FaBars, FaEye, FaBox } from 'react-icons/fa';
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import Sidebar from './SideBar';

const ControlCalidadMateriaPrima = () => {
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [controlCalidad, setControlCalidad] = useState([]);
  const [selectedMateriaPrima, setSelectedMateriaPrima] = useState('');
  const [formState, setFormState] = useState({
    resultado: '',
    observaciones: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    Modal.setAppElement('#root');
    fetchMateriasPrimas();
  }, []);

  // Obtener la lista de materias primas
  const fetchMateriasPrimas = async () => {
    try {
      const response = await axios.get('/materiaprima');
      setMateriasPrimas(response.data);
    } catch (error) {
      console.error('Error al obtener las materias primas:', error);
    }
  };

  // Obtener control de calidad para una materia prima específica
  const fetchControlCalidad = async (materia_prima_id) => {
    try {
      const response = await axios.get(`/qualitycontrol-materiaprima/materia-prima/${materia_prima_id}`);
      setControlCalidad(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error al obtener el control de calidad:', error);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState({ ...formState, [id]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!selectedMateriaPrima) newErrors.materia_prima_id = 'Materia Prima es requerida';
    if (!formState.resultado) newErrors.resultado = 'Resultado es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const registerControlCalidad = async () => {
    if (validateForm()) {
      try {
        const { resultado, observaciones } = formState;
        await axios.post('/qualitycontrol-materiaprima', {
          materia_prima_id: selectedMateriaPrima,
          resultado,
          observaciones,
        });
        fetchControlCalidad(selectedMateriaPrima);
        resetForm();
      } catch (error) {
        console.error('Error al registrar el control de calidad:', error);
      }
    }
  };

  const resetForm = () => {
    setFormState({
      resultado: '',
      observaciones: '',
    });
    setErrors({});
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = materiasPrimas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(materiasPrimas.length / itemsPerPage);

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
          <h1 className="text-3xl font-semibold">Control de Calidad de Materia Prima</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white focus:outline-none md:hidden">
            <FaBars />
          </button>
        </header>

        <main className="flex-1 p-6 md:p-8">
          {/* Box para el total de materias primas */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-700">Total de Materias Primas</h3>
              <p className="text-3xl font-bold text-gray-900">{materiasPrimas.length}</p>
            </div>
            <FaBox className="text-5xl text-gray-400" />
          </div>

          {/* Formulario de Registro */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-6">Registrar Control de Calidad</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="relative">
                <label htmlFor="materia_prima_id" className="block text-gray-700 font-semibold mb-2">Materia Prima</label>
                <select
                  id="materia_prima_id"
                  value={selectedMateriaPrima}
                  onChange={(e) => setSelectedMateriaPrima(e.target.value)}
                  className={`border p-3 rounded-lg w-full ${errors.materia_prima_id ? 'border-red-500' : ''}`}
                >
                  <option value="">Seleccionar materia prima</option>
                  {materiasPrimas.map((materiaPrima) => (
                    <option key={materiaPrima.id} value={materiaPrima.id}>
                      {materiaPrima.nombre}
                    </option>
                  ))}
                </select>
                {errors.materia_prima_id && <p className="text-red-500 text-sm mt-2">{errors.materia_prima_id}</p>}
              </div>

              <div className="relative">
                <label htmlFor="resultado" className="block text-gray-700 font-semibold mb-2">Resultado</label>
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

              <div className="relative">
                <label htmlFor="observaciones" className="block text-gray-700 font-semibold mb-2">Observaciones</label>
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
                className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition duration-200 flex items-center"
              >
                <FaPlus className="mr-2" /> Registrar Control
              </button>
            </div>
          </div>

          {/* Tabla de Materias Primas con botón "Ver" */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <table className="min-w-full table-auto border-collapse border border-gray-400">
              <thead className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">Nombre</th>
                  <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wider border border-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-400">
                {currentItems.map((materiaPrima) => (
                  <tr key={materiaPrima.id} className="hover:bg-gray-100 transition duration-200">
                    <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">{materiaPrima.nombre}</td>
                    <td className="px-6 py-4 text-right text-sm border border-gray-400">
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={() => fetchControlCalidad(materiaPrima.id)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition duration-200 flex items-center"
                        >
                          <FaEye className="mr-2" /> Ver Control
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

          {/* Modal para ver Control de Calidad */}
          <Modal
            isOpen={showModal}
            onRequestClose={() => setShowModal(false)}
            className="flex items-center justify-center fixed inset-0 z-50 px-4 py-8 md:px-0"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                duration: 0.6,
              }}
              className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-4xl overflow-auto max-h-full"
            >
              <motion.h3
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl font-bold text-gray-900 mb-6 text-center"
              >
                Registro de Control de Calidad
              </motion.h3>

              {/* Tabla de Control de Calidad */}
              {controlCalidad.length > 0 ? (
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mt-4">
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
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center text-gray-600"
                >
                  No hay controles de calidad registrados para esta materia prima.
                </motion.p>
              )}

              <div className="flex justify-end mt-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowModal(false)}
                  className="bg-red-600 text-white p-3 rounded-lg shadow-lg hover:bg-red-700 transition duration-300"
                >
                  Cerrar
                </motion.button>
              </div>
            </motion.div>
          </Modal>
        </main>

        <footer className="bg-white p-6 text-center text-gray-500 shadow-inner text-lg">
          &copy; {new Date().getFullYear()} Gestión de Control de Calidad de Materia Prima. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

export default ControlCalidadMateriaPrima;
