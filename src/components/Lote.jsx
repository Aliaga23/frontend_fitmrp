import React, { useState, useEffect } from 'react';
import axios from '../api';
import { FaPlus, FaEdit, FaTrash, FaBars } from 'react-icons/fa';
import Sidebar from './SideBar';

const ControlLotes = () => {
  const [lotes, setLotes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [formState, setFormState] = useState({ producto_id: '', numero_lote: '', fecha_vencimiento: '' });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = lotes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(lotes.length / itemsPerPage);

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
        <header className="flex justify-between items-center bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 shadow-md">
          <h1 className="text-3xl font-semibold">Control de Lotes</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white focus:outline-none md:hidden">
            <FaBars />
          </button>
        </header>

        {/* Formulario de Lotes */}
        <main className="flex-1 p-6 md:p-8">
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6">Crear/Actualizar Lote</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="relative">
                <label htmlFor="producto_id" className="block text-gray-700 font-semibold mt-3 mb-2">Producto</label>
                <select
                  id="producto_id"
                  value={formState.producto_id}
                  onChange={handleInputChange}
                  className={`border p-3 rounded-lg w-full ${errors.producto_id ? 'border-red-500' : ''}`}
                >
                  <option value="">Seleccione un producto</option>
                  {productos.map((producto) => (
                    <option key={producto.id} value={producto.id}>
                      {producto.nombre}
                    </option>
                  ))}
                </select>
                {errors.producto_id && <p className="text-red-500 text-sm mt-2">{errors.producto_id}</p>}
              </div>

              <div className="relative mt-4">
                <label htmlFor="numero_lote" className="text-gray-700 font-semibold">Número de Lote</label>
                <input
                  type="text"
                  id="numero_lote"
                  placeholder="Número de Lote"
                  value={formState.numero_lote}
                  onChange={handleInputChange}
                  className={`border p-3 rounded-lg w-full ${errors.numero_lote ? 'border-red-500' : ''}`}
                />
                {errors.numero_lote && <p className="text-red-500 text-sm mt-2">{errors.numero_lote}</p>}
              </div>

              <div className="relative mt-4">
                <label htmlFor="fecha_vencimiento" className="text-gray-700 font-semibold">Fecha de Vencimiento</label>
                <input
                  type="date"
                  id="fecha_vencimiento"
                  value={formState.fecha_vencimiento}
                  onChange={handleInputChange}
                  className={`border p-3 rounded-lg w-full ${errors.fecha_vencimiento ? 'border-red-500' : ''}`}
                />
                {errors.fecha_vencimiento && <p className="text-red-500 text-sm mt-2">{errors.fecha_vencimiento}</p>}
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={createOrUpdateLote}
                className={`p-3 rounded-lg shadow-md transition duration-200 flex items-center ${editingId ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700' : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'} text-white`}
              >
                {editingId ? <FaEdit className="inline mr-2" /> : <FaPlus className="inline mr-2" />}
                {editingId ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>

    {/* Tabla de Lotes */}
<div className="bg-white rounded-lg shadow-md overflow-x-auto mb-8">
  <table className="min-w-full divide-y divide-gray-400 border border-gray-400">
    <thead className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <tr>
        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">Producto</th>
        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">Número de Lote</th>
        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">Fecha de Vencimiento</th>
        <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wider border border-gray-600">Acciones</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-400">
      {currentItems.map((lote) => {
        const producto = productos.find((prod) => prod.id === lote.producto_id);
        return (
          <tr key={lote.id} className="hover:bg-gray-100 transition duration-200">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border border-gray-400">
              {producto ? producto.nombre : 'Producto no encontrado'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border border-gray-400">{lote.numero_lote}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border border-gray-400">
              {new Date(lote.fecha_vencimiento).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm border border-gray-400">
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
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-2 rounded-lg shadow-md hover:from-yellow-600 hover:to-yellow-700 transition duration-200 flex items-center"
                >
                  <span className="mr-2">Editar</span>
                  <FaEdit />
                </button>
                <button
                  onClick={() => confirmDeleteLote(lote.id)}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white p-2 rounded-lg shadow-md hover:from-red-600 hover:to-red-700 transition duration-200 flex items-center"
                >
                  <span className="mr-2">Eliminar</span>
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

          {/* Modal para Confirmación de Eliminación */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-2xl font-semibold mb-6">Confirmar Eliminación</h3>
                <p className="mb-6">¿Estás seguro de que deseas eliminar este lote?</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-3 rounded-lg shadow-md hover:bg-gray-700 transition duration-200 mr-2"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={deleteLote}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-lg shadow-md hover:bg-red-700 transition duration-200"
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
