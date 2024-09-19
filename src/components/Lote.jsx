import React, { useState, useEffect } from 'react';
import axios from '../api';
import { FaPlus, FaEdit, FaTrash, FaBars } from 'react-icons/fa';
import Sidebar from './SideBar'; // Importa el componente Sidebar

const ControlLotes = () => {
  const [lotes, setLotes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [formState, setFormState] = useState({ producto_id: '', numero_lote: '', fecha_vencimiento: '' });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Estado para controlar la sidebar
  const [searchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [errors, setErrors] = useState({});

  
  useEffect(() => {
    fetchLotes();
    fetchProductos();
  }, []);

  const fetchLotes = async () => {
    const response = await axios.get('/lots');
    setLotes(response.data);
  };

  const fetchProductos = async () => {
    const response = await axios.get('/products');
    setProductos(response.data);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formState.producto_id) newErrors.producto_id = 'Producto es requerido';
    if (!formState.numero_lote) newErrors.numero_lote = 'Número de lote es requerido';
    if (!formState.fecha_vencimiento) newErrors.fecha_vencimiento = 'Fecha de vencimiento es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState({ ...formState, [id]: value });
  };

  const resetForm = () => {
    setFormState({ producto_id: '', numero_lote: '', fecha_vencimiento: '' });
    setErrors({});
    setEditingId(null);
  };

  const createOrUpdateLote = async () => {
    if (validateForm()) {
      if (editingId) {
        await axios.put(`/lots/${editingId}`, formState);
      } else {
        await axios.post('/lots', formState);
      }
      fetchLotes();
      resetForm();
    }
  };

  const confirmDeleteLote = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const deleteLote = async () => {
    if (deleteId) {
      await axios.delete(`/lots/${deleteId}`);
      fetchLotes();
      setShowModal(false);
      setDeleteId(null);
    }
  };

  const filteredLotes = lotes.filter((lote) =>
    lote.numero_lote.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLotes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLotes.length / itemsPerPage);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Overlay for small screens */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <header className="flex justify-between items-center bg-white p-4 shadow-md">
          <div className="text-2xl font-semibold text-gray-800">Control de Lotes</div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 focus:outline-none md:hidden">
              <FaBars />
            </button>
          </div>
        </header>

        {/* Formulario de Lotes */}
        <main className="flex-1 p-4 md:p-6">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Crear/Actualizar Lote</h3>
            <div className="relative">
              <label htmlFor="producto_id" className="text-gray-700">Producto</label>
              <select
                id="producto_id"
                value={formState.producto_id}
                onChange={handleInputChange}
                className={`border p-3 rounded w-full ${errors.producto_id ? 'border-red-500' : ''}`}
              >
                <option value="">Seleccione un producto</option>
                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre}
                  </option>
                ))}
              </select>
              {errors.producto_id && <p className="text-red-500 text-sm mt-1">{errors.producto_id}</p>}
            </div>

            <div className="relative mt-4">
              <label htmlFor="numero_lote" className="text-gray-700">Número de Lote</label>
              <input
                type="text"
                id="numero_lote"
                placeholder="Número de Lote"
                value={formState.numero_lote}
                onChange={handleInputChange}
                className={`border p-3 rounded w-full ${errors.numero_lote ? 'border-red-500' : ''}`}
              />
              {errors.numero_lote && <p className="text-red-500 text-sm mt-1">{errors.numero_lote}</p>}
            </div>

            <div className="relative mt-4">
              <label htmlFor="fecha_vencimiento" className="text-gray-700">Fecha de Ingreso</label>
              <input
                type="date"
                id="fecha_vencimiento"
                value={formState.fecha_vencimiento}
                onChange={handleInputChange}
                className={`border p-3 rounded w-full ${errors.fecha_vencimiento ? 'border-red-500' : ''}`}
              />
              {errors.fecha_vencimiento && <p className="text-red-500 text-sm mt-1">{errors.fecha_vencimiento}</p>}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={createOrUpdateLote}
                className={`p-3 rounded shadow-md transition duration-200 flex items-center ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
              >
                {editingId ? <FaEdit className="inline mr-2" /> : <FaPlus className="inline mr-2" />}
                {editingId ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>

          {/* Tabla de Lotes */}
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Número de Lote</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Fecha de Ingreso</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
  {currentItems.map((lote) => {
    const producto = productos.find((prod) => prod.id === lote.producto_id); // Encontrar el producto correspondiente
    return (
      <tr key={lote.id} className="hover:bg-gray-100 transition duration-200">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {producto ? producto.nombre : 'Producto no encontrado'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lote.numero_lote}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {new Date(lote.fecha_vencimiento).toLocaleDateString()} {/* Formatear la fecha */}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex space-x-2 justify-end">
            <button
              onClick={() => {
                setEditingId(lote.id);
                setFormState({
                  producto_id: lote.producto_id,
                  numero_lote: lote.numero_lote,
                  fecha_vencimiento: lote.fecha_vencimiento,
                });
              }}
              className="bg-yellow-500 text-white p-2 rounded shadow-md hover:bg-yellow-600 transition duration-200 flex items-center"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => confirmDeleteLote(lote.id)}
              className="bg-red-500 text-white p-2 rounded shadow-md hover:bg-red-600 transition duration-200 flex items-center"
            >
              <FaTrash />
            </button>
          </div>
        </td>
      </tr>
    );
  })}
</tbody>

            </table>
          </div>

          {/* Paginación */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
              disabled={currentPage === 1}
              className="bg-gray-500 text-white p-3 rounded disabled:bg-gray-300 shadow-md hover:bg-gray-600 transition duration-200"
            >
              Anterior
            </button>
            <span className="text-lg">Página {currentPage} de {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-gray-500 text-white p-3 rounded disabled:bg-gray-300 shadow-md hover:bg-gray-600 transition duration-200"
            >
              Siguiente
            </button>
          </div>

          {/* Modal para Confirmación de Eliminación */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Confirmar Eliminación</h3>
                <p className="mb-4">¿Estás seguro de que deseas eliminar este lote?</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-500 text-white p-2 rounded mr-2 shadow-md hover:bg-gray-600 transition duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={deleteLote}
                    className="bg-red-500 text-white p-2 rounded shadow-md hover:bg-red-600 transition duration-200"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ControlLotes;
