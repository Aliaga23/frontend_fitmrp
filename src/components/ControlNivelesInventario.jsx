import React, { useState, useEffect } from 'react';
import axios from '../api';
import { FaPlus, FaEdit, FaTrash, FaBars} from 'react-icons/fa';
import Modal from 'react-modal';
import Sidebar from './SideBar';

const ControlNivelesInventario = () => {
  const [inventario, setInventario] = useState([]);
  const [productos, setProductos] = useState([]);
  const [formState, setFormState] = useState({ producto_id: '', cantidad_disponible: '' });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    fetchInventario();
    fetchProductos();
  }, []);

  const fetchInventario = async () => {
    try {
      const response = await axios.get('/inventories');
      setInventario(response.data);
    } catch (error) {
      console.error('Error al obtener el inventario:', error);
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await axios.get('/products');
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formState.producto_id) newErrors.producto_id = 'Producto es requerido';
    if (!formState.cantidad_disponible) newErrors.cantidad_disponible = 'Cantidad disponible es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState({ ...formState, [id]: value });
  };

  const resetForm = () => {
    setFormState({ producto_id: '', cantidad_disponible: '' });
    setErrors({});
    setEditingId(null);
  };

  const createOrUpdateInventario = async () => {
    if (validateForm()) {
      try {
        if (editingId) {
          await axios.put(`/inventories/${editingId}`, formState);
        } else {
          await axios.post('/inventories', formState);
        }
        fetchInventario();
        resetForm();
        setAnimate(true);
        setTimeout(() => setAnimate(false), 500);
      } catch (error) {
        console.error('Error al guardar el inventario:', error);
      }
    }
  };

  const confirmDeleteInventario = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const deleteInventario = async () => {
    try {
      if (deleteId) {
        await axios.delete(`/inventories/${deleteId}`);
        fetchInventario();
        setShowModal(false);
        setDeleteId(null);
      }
    } catch (error) {
      console.error('Error al eliminar el inventario:', error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = inventario.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(inventario.length / itemsPerPage);

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
          <h1 className="text-3xl font-semibold">Control de Niveles de Inventario</h1>
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white focus:outline-none md:hidden">
              <FaBars />
            </button>
          </div>
        </header>

        {/* Formulario de Inventario */}
        <main className="flex-1 p-6 md:p-8">
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6">{editingId ? 'Actualizar Inventario' : 'Crear Inventario'}</h3>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${animate ? 'animate-pulse' : ''}`}>
              <div className="relative">
                <label htmlFor="producto_id" className="text-gray-700 font-semibold">Producto</label>
                <select
                  id="producto_id"
                  value={formState.producto_id}
                  onChange={handleInputChange}
                  className={`border p-4 rounded-lg w-full mt-2 shadow-sm focus:ring-2 focus:ring-blue-600 ${errors.producto_id ? 'border-red-500' : ''}`}
                >
                  <option value="">Seleccione un producto</option>
                  {productos.map((producto) => (
                    <option key={producto.id} value={producto.id}>{producto.nombre}</option>
                  ))}
                </select>
                {errors.producto_id && <p className="text-red-500 text-sm mt-1">{errors.producto_id}</p>}
              </div>

              <div className="relative">
                <label htmlFor="cantidad_disponible" className="text-gray-700 font-semibold">Cantidad Disponible</label>
                <input
                  type="number"
                  id="cantidad_disponible"
                  placeholder="Cantidad Disponible"
                  value={formState.cantidad_disponible}
                  onChange={handleInputChange}
                  className={`border p-4 rounded-lg w-full mt-2 shadow-sm focus:ring-2 focus:ring-blue-600 ${errors.cantidad_disponible ? 'border-red-500' : ''}`}
                />
                {errors.cantidad_disponible && <p className="text-red-500 text-sm mt-1">{errors.cantidad_disponible}</p>}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={createOrUpdateInventario}
                className={`p-4 rounded-lg shadow-lg transition duration-200 flex items-center text-white ${editingId ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700' : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'}`}
              >
                {editingId ? <FaEdit className="inline mr-2" /> : <FaPlus className="inline mr-2" />}
                {editingId ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>

          {/* Tabla de Inventario */}
<div className="bg-white rounded-lg shadow-lg overflow-x-auto mb-8">
  <table className="min-w-full table-auto border-collapse border border-gray-400">
    <thead className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <tr>
        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">Producto</th>
        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">Cantidad Disponible</th>
        <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wider border border-gray-600">Acciones</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-400">
      {currentItems.map((item) => (
        <tr key={item.id} className="hover:bg-gray-100 transition duration-200">
          <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">{item.producto_id}</td>
          <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">{item.cantidad_disponible}</td>
          <td className="px-6 py-4 text-right text-sm border border-gray-400">
            <div className="flex space-x-2 justify-end">
              <button
                onClick={() => {
                  setEditingId(item.id);
                  setFormState({ producto_id: item.producto_id, cantidad_disponible: item.cantidad_disponible });
                }}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-3 rounded-lg shadow-md hover:from-yellow-600 hover:to-yellow-700 transition duration-200 flex items-center"
              >
                <span className="mr-2">Editar</span>
                <FaEdit />
              </button>

              <button
                onClick={() => confirmDeleteInventario(item.id)}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-lg shadow-md hover:from-red-600 hover:to-red-700 transition duration-200 flex items-center"
              >
                <span className="mr-2">Eliminar</span>
                <FaTrash />
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

          {/* Modal para Confirmación de Eliminación */}
          {showModal && (
            <Modal isOpen={showModal} onRequestClose={() => setShowModal(false)} className="flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Confirmar Eliminación</h3>
                <p className="mb-4">¿Estás seguro de que deseas eliminar este registro de inventario?</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-2 rounded mr-2 shadow-md hover:bg-gray-700 transition duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={deleteInventario}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white p-2 rounded shadow-md hover:from-red-600 hover:to-red-700 transition duration-200"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </Modal>
          )}
        </main>

        <footer className="bg-white p-6 text-center text-gray-500 shadow-inner text-lg">
          &copy; {new Date().getFullYear()} Control de Niveles de Inventario. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

export default ControlNivelesInventario;
