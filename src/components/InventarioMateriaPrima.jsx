import React, { useState, useEffect } from 'react';
import axios from '../api';
import { FaPlus, FaEdit,  FaBars } from 'react-icons/fa';
import Sidebar from './SideBar';

const InventarioMateriaPrima = () => {
  const [inventarios, setInventarios] = useState([]);
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [formState, setFormState] = useState({
    materia_prima_id: '',
    cantidad: '',
    esEntrada: true, // Controlar si es una entrada o salida
  });
  const [ setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    fetchInventarios();
    fetchMateriasPrimas();
  }, []);

  // Fetch de inventarios existentes
  const fetchInventarios = async () => {
    try {
      const response = await axios.get('/inventario-materiaprima');
      setInventarios(response.data);
    } catch (error) {
      console.error('Error al obtener inventarios:', error);
    }
  };

  // Fetch de materias primas disponibles
  const fetchMateriasPrimas = async () => {
    try {
      const response = await axios.get('/materiaprima');
      setMateriasPrimas(response.data);
    } catch (error) {
      console.error('Error al obtener materias primas:', error);
    }
  };

  // Validación de formulario
  const validateForm = () => {
    const newErrors = {};
    if (!formState.materia_prima_id) newErrors.materia_prima_id = 'Materia prima es requerida';
    if (!formState.cantidad) newErrors.cantidad = 'Cantidad es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejo de cambio de inputs
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState({ ...formState, [id]: value });
  };

  const handleSelectChange = (e) => {
    setFormState({ ...formState, esEntrada: e.target.value === 'entrada' });
  };

  // Resetear el formulario
  const resetForm = () => {
    setFormState({
      materia_prima_id: '',
      cantidad: '',
      esEntrada: true,
    });
    setErrors({});
    setEditingId(null);
  };

  // Actualizar el inventario (entrada/salida)
  const updateInventario = async () => {
    if (validateForm()) {
      try {
        const { materia_prima_id, cantidad, esEntrada } = formState;

        // Llamada a la API para actualizar el inventario (entrada/salida)
        await axios.put(`/inventario-materiaprima/${materia_prima_id}`, {
          cantidad,
          esEntrada,
        });

        fetchInventarios(); // Refrescar la lista de inventarios
        resetForm(); // Resetear el formulario
      } catch (error) {
        console.error('Error al actualizar inventario:', error);
        setErrors({ form: 'Error al actualizar el inventario' });
      }
    }
  };

  // Filtrar inventarios para búsqueda
  const filteredInventarios = inventarios.filter((inventario) =>
    inventario.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInventarios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInventarios.length / itemsPerPage);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <header className="flex justify-between items-center bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 shadow-md relative">
          <h1 className="text-3xl font-semibold">Gestión de Inventario de Materia Prima</h1>
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white focus:outline-none md:hidden">
              <FaBars />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8">
          {/* Formulario */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6">Actualizar Inventario</h3>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`}>
              <div className="relative">
                <label htmlFor="materia_prima_id" className="text-gray-700 font-semibold">Materia Prima</label>
                <select
                  id="materia_prima_id"
                  value={formState.materia_prima_id}
                  onChange={handleInputChange}
                  className={`border p-4 rounded-lg w-full mt-2 shadow-sm focus:ring-2 focus:ring-blue-600 ${errors.materia_prima_id ? 'border-red-500' : ''}`}
                >
                  <option value="">Seleccionar Materia Prima</option>
                  {materiasPrimas.map((materia) => (
                    <option key={materia.id} value={materia.id}>
                      {materia.nombre}
                    </option>
                  ))}
                </select>
                {errors.materia_prima_id && <p className="text-red-500 text-sm mt-1">{errors.materia_prima_id}</p>}
              </div>

              <div className="relative">
                <label htmlFor="cantidad" className="text-gray-700 font-semibold">Cantidad</label>
                <input
                  type="number"
                  id="cantidad"
                  placeholder="Cantidad"
                  value={formState.cantidad}
                  onChange={handleInputChange}
                  className={`border p-4 rounded-lg w-full mt-2 shadow-sm focus:ring-2 focus:ring-blue-600 ${errors.cantidad ? 'border-red-500' : ''}`}
                />
                {errors.cantidad && <p className="text-red-500 text-sm mt-1">{errors.cantidad}</p>}
              </div>

              <div className="relative">
                <label htmlFor="esEntrada" className="text-gray-700 font-semibold">Movimiento</label>
                <select
                  id="esEntrada"
                  value={formState.esEntrada ? 'entrada' : 'salida'}
                  onChange={handleSelectChange}
                  className="border p-4 rounded-lg w-full mt-2 shadow-sm focus:ring-2 focus:ring-blue-600"
                >
                  <option value="entrada">Entrada</option>
                  <option value="salida">Salida</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={updateInventario}
                className="p-4 rounded-lg shadow-lg transition duration-200 flex items-center text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <FaPlus className="inline mr-2" /> Actualizar Inventario
              </button>
            </div>
          </div>

          {/* Tabla de inventarios */}
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto mb-8">
            <table className="min-w-full table-auto border-collapse border border-gray-400">
              <thead className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">Materia Prima</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">Cantidad Disponible</th>
                  <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wider border border-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-400">
  {currentItems.map((inventario, index) => (
    <tr key={`${inventario.materia_prima_id}-${index}`} className="hover:bg-gray-100 transition duration-200">
      <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">{inventario.nombre}</td>
      <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">{inventario.cantidad_disponible}</td>
      <td className="px-6 py-4 text-right text-sm border border-gray-400">
        <div className="flex space-x-2 justify-end">
          <button
            onClick={() => {
              setEditingId(inventario.materia_prima_id);
              setFormState({
                materia_prima_id: inventario.materia_prima_id,
                cantidad: '',
                esEntrada: true,
              });
            }}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-3 rounded-lg shadow-md hover:from-yellow-600 hover:to-yellow-700 transition duration-200 flex items-center"
          >
            <FaEdit className="mr-2" /> Editar
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>

            </table>
          </div>

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
        </main>

        <footer className="bg-white p-6 text-center text-gray-500 shadow-inner text-lg">
          &copy; {new Date().getFullYear()} Gestión de Inventario. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

export default InventarioMateriaPrima;
