import React, { useState, useEffect } from 'react';
import axios from '../api';
import { FaPlus, FaEdit, FaTrash, FaBars } from 'react-icons/fa';
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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <header className="flex justify-between items-center bg-white p-4 shadow-md">
          <div className="text-2xl font-semibold text-gray-800">Control de Niveles de Inventario</div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 focus:outline-none md:hidden">
            <FaBars />
          </button>
        </header>

        {/* Formulario de Inventario */}
        <main className="flex-1 p-4 md:p-6">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{editingId ? 'Actualizar Inventario' : 'Crear Inventario'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="producto_id" className="text-gray-700">Producto</label>
                <select
                  id="producto_id"
                  value={formState.producto_id}
                  onChange={handleInputChange}
                  className={`border p-3 rounded w-full ${errors.producto_id ? 'border-red-500' : ''}`}
                >
                  <option value="">Seleccione un producto</option>
                  {productos.map((producto) => (
                    <option key={producto.id} value={producto.id}>{producto.nombre}</option>
                  ))}
                </select>
                {errors.producto_id && <p className="text-red-500 text-sm mt-1">{errors.producto_id}</p>}
              </div>

              <div>
                <label htmlFor="cantidad_disponible" className="text-gray-700">Cantidad Disponible</label>
                <input
                  type="number"
                  id="cantidad_disponible"
                  placeholder="Cantidad Disponible"
                  value={formState.cantidad_disponible}
                  onChange={handleInputChange}
                  className={`border p-3 rounded w-full ${errors.cantidad_disponible ? 'border-red-500' : ''}`}
                />
                {errors.cantidad_disponible && <p className="text-red-500 text-sm mt-1">{errors.cantidad_disponible}</p>}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={createOrUpdateInventario}
                className={`p-3 rounded shadow-md transition duration-200 flex items-center ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
              >
                {editingId ? <FaEdit className="inline mr-2" /> : <FaPlus className="inline mr-2" />}
                {editingId ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>

          {/* Tabla de Inventario */}
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Cantidad Disponible</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventario.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100 transition duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.cantidad_disponible}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setEditingId(item.id);
                          setFormState({ producto_id: item.producto_id, cantidad_disponible: item.cantidad_disponible });
                        }}
                        className="bg-yellow-500 text-white p-2 rounded shadow-md hover:bg-yellow-600 transition duration-200 flex items-center"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => confirmDeleteInventario(item.id)}
                        className="bg-red-500 text-white p-2 rounded shadow-md hover:bg-red-600 transition duration-200 flex items-center"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                    className="bg-gray-500 text-white p-2 rounded mr-2 shadow-md hover:bg-gray-600 transition duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={deleteInventario}
                    className="bg-red-500 text-white p-2 rounded shadow-md hover:bg-red-600 transition duration-200"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </Modal>
          )}
        </main>
      </div>
    </div>
  );
};

export default ControlNivelesInventario;

