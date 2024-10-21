import React, { useState, useEffect } from 'react';
import axios from '../api';
import { FaPlus, FaEdit, FaTrash, FaBars } from 'react-icons/fa';
import Sidebar from './SideBar';

const OrdenesCompra = () => {
  const [ordenesCompra, setOrdenesCompra] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [inventarios, setInventarios] = useState([]);
  const [formState, setFormState] = useState({
    usuario_id: '',
    inventario_id: '',
    fecha: '',
    estado: '',
  });
  const [errors, setErrors] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [editingOrdenCompra, setEditingOrdenCompra] = useState(null);

  useEffect(() => {
    fetchOrdenesCompra();
    fetchUsuarios();
    fetchInventarios();
  }, []);

  const fetchOrdenesCompra = async () => {
    try {
      const response = await axios.get('/orden-compra');
      setOrdenesCompra(response.data);
    } catch (error) {
      console.error('Error al obtener las órdenes de compra:', error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('/users');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    }
  };

  const fetchInventarios = async () => {
    try {
      const response = await axios.get('/inventories');
      setInventarios(response.data);
    } catch (error) {
      console.error('Error al obtener los inventarios:', error);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState({ ...formState, [id]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formState.usuario_id) newErrors.usuario_id = 'Usuario es requerido';
    if (!formState.inventario_id) newErrors.inventario_id = 'Producto es requerido';
    if (!formState.fecha) newErrors.fecha = 'Fecha es requerida';
    if (!formState.estado) newErrors.estado = 'Estado es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveOrdenCompra = async () => {
    if (validateForm()) {
      try {
        const { usuario_id, inventario_id, fecha, estado } = formState;

        if (editingOrdenCompra) {
          await axios.put(`/orden-compra/${editingOrdenCompra.id}`, {
            usuario_id,
            inventario_id,
            fecha,
            estado,
          });
        } else {
          await axios.post('/orden-compra', {
            usuario_id,
            inventario_id,
            fecha,
            estado,
          });
        }

        fetchOrdenesCompra();
        resetForm();
      } catch (error) {
        console.error('Error al guardar la orden de compra:', error);
      }
    }
  };

  const handleEditOrdenCompra = (ordenCompra) => {
    setEditingOrdenCompra(ordenCompra);
    setFormState({
      usuario_id: ordenCompra.usuario_id,
      inventario_id: ordenCompra.inventario_id,
      fecha: ordenCompra.fecha,
      estado: ordenCompra.estado,
    });
  };

  const handleDeleteOrdenCompra = async (id) => {
    try {
      await axios.delete(`/orden-compra/${id}`);
      fetchOrdenesCompra();
    } catch (error) {
      console.error('Error al eliminar la orden de compra:', error);
    }
  };

  const resetForm = () => {
    setFormState({
      usuario_id: '',
      inventario_id: '',
      fecha: '',
      estado: '',
    });
    setErrors({});
    setEditingOrdenCompra(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = ordenesCompra.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(ordenesCompra.length / itemsPerPage);

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
          <h1 className="text-3xl font-semibold">Gestión de Órdenes de Compra</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white focus:outline-none md:hidden">
            <FaBars />
          </button>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-x-auto">
          {/* Formulario para crear o editar orden de compra */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              {editingOrdenCompra ? 'Editar Orden de Compra' : 'Nueva Orden de Compra'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
              <div className="relative">
                <label htmlFor="usuario_id" className="block text-gray-700 font-medium mb-2">Usuario</label>
                <select
                  id="usuario_id"
                  value={formState.usuario_id}
                  onChange={handleInputChange}
                  className={`border p-3 rounded-lg w-full ${errors.usuario_id ? 'border-red-500' : ''}`}
                >
                  <option value="">Seleccionar usuario</option>
                  {usuarios.map((usuario) => (
                    <option key={`usuario-${usuario.id}`} value={usuario.id}>
                      {usuario.nombre}
                    </option>
                  ))}
                </select>
                {errors.usuario_id && <p className="text-red-500 text-sm mt-2">{errors.usuario_id}</p>}
              </div>

              <div className="relative">
                <label htmlFor="inventario_id" className="block text-gray-700 font-medium mb-2">Producto</label>
                <select
                  id="inventario_id"
                  value={formState.inventario_id}
                  onChange={handleInputChange}
                  className={`border p-3 rounded-lg w-full ${errors.inventario_id ? 'border-red-500' : ''}`}
                >
                  <option value="">Seleccionar producto</option>
                  {inventarios.length > 0 ? (
                    inventarios.map((inventario, index) => (
                      <option key={`inventario-${inventario.id}-${index}`} value={inventario.id}>
                        {inventario.nombre}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No hay productos disponibles
                    </option>
                  )}
                </select>
                {errors.inventario_id && <p className="text-red-500 text-sm mt-2">{errors.inventario_id}</p>}
              </div>

              <div className="relative">
                <label htmlFor="fecha" className="block text-gray-700 font-medium mb-2">Fecha</label>
                <input
                  type="date"
                  id="fecha"
                  value={formState.fecha}
                  onChange={handleInputChange}
                  className={`border p-3 rounded-lg w-full ${errors.fecha ? 'border-red-500' : ''}`}
                />
                {errors.fecha && <p className="text-red-500 text-sm mt-2">{errors.fecha}</p>}
              </div>

              <div className="relative">
                <label htmlFor="estado" className="block text-gray-700 font-medium mb-2">Estado</label>
                <input
                  type="text"
                  id="estado"
                  value={formState.estado}
                  onChange={handleInputChange}
                  placeholder="Estado de la orden"
                  className={`border p-3 rounded-lg w-full ${errors.estado ? 'border-red-500' : ''}`}
                />
                {errors.estado && <p className="text-red-500 text-sm mt-2">{errors.estado}</p>}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveOrdenCompra}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition duration-200 flex items-center"
              >
                <FaPlus className="mr-2" /> Guardar
              </button>
            </div>
          </div>

          {/* Tabla de Órdenes de Compra */}
          <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Órdenes de Compra</h3>

            <table className="min-w-full table-auto border-collapse border border-gray-400">
              <thead className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">
                    Número de Orden
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">
                    Usuario
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">
                    Producto
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wider border border-gray-600">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-400">
                {currentItems.map((ordenCompra) => (
                  <tr key={ordenCompra.id} className="hover:bg-gray-100 transition duration-200">
                    <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">
                      {ordenCompra.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">
                      {ordenCompra.usuario}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">
                      {ordenCompra.producto}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">
                      {new Date(ordenCompra.fecha).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">
                      {ordenCompra.estado}
                    </td>
                    <td className="px-6 py-4 text-right text-sm border border-gray-400">
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={() => handleEditOrdenCompra(ordenCompra)}
                          className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-3 rounded-lg shadow-md hover:from-yellow-600 hover:to-yellow-700 transition duration-200 flex items-center"
                        >
                          <FaEdit className="mr-2" /> Editar
                        </button>
                        <button
                          onClick={() => handleDeleteOrdenCompra(ordenCompra.id)}
                          className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-lg shadow-md hover:from-red-600 hover:to-red-700 transition duration-200 flex items-center"
                        >
                          <FaTrash className="mr-2" /> Eliminar
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
        </main>

        <footer className="bg-white p-6 text-center text-gray-500 shadow-inner text-lg">
          &copy; {new Date().getFullYear()} Gestión de Órdenes de Compra. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

export default OrdenesCompra;
