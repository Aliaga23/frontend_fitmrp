import React, { useState, useEffect } from 'react';
import axios from '../api';
import {  FaPlus, FaEdit, FaTrash, FaBars } from 'react-icons/fa';
import Sidebar from './SideBar';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [formState, setFormState] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria_id: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm] = useState('');
  const [sortConfig] = useState({ key: 'nombre', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [errors, setErrors] = useState({});
  const [animate, setAnimate] = useState(false);


  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await axios.get('/products');
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await axios.get('/categories');
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formState.nombre) newErrors.nombre = 'Nombre es requerido';
    if (!formState.precio) newErrors.precio = 'Precio es requerido';
    if (!formState.categoria_id) newErrors.categoria_id = 'Categoría es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState({ ...formState, [id]: value });
  };

  const resetForm = () => {
    setFormState({
      nombre: '',
      descripcion: '',
      precio: '',
      categoria_id: '',
    });
    setErrors({});
    setEditingId(null);
  };

  const createOrUpdateProducto = async () => {
    if (validateForm()) {
      try {
        if (editingId) {
          await axios.put(`/products/${editingId}`, formState);
        } else {
          await axios.post('/products', formState);
        }
        fetchProductos();
        resetForm();
        setAnimate(true);
        setTimeout(() => setAnimate(false), 500);
      } catch (error) {
        console.error('Error al crear/actualizar producto:', error);
        setErrors({ form: 'Error al guardar los cambios' });
      }
    }
  };

  const confirmDeleteProducto = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const deleteProducto = async () => {
    try {
      if (deleteId) {
        await axios.delete(`/products/${deleteId}`);
        fetchProductos();
        setShowModal(false);
        setDeleteId(null);
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

 

  const sortedProductos = [...productos].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredProductos = sortedProductos.filter((producto) =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProductos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProductos.length / itemsPerPage);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <header className="flex justify-between items-center bg-white p-4 shadow-md">
          <div className="text-2xl font-semibold text-gray-800">Gestión de Productos</div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 focus:outline-none md:hidden">
              <FaBars />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          {/* Formulario */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Crear/Actualizar Producto</h3>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${animate ? 'animate-pulse' : ''}`}>
              <div className="relative">
                <label htmlFor="nombre" className="text-gray-700">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  placeholder="Nombre"
                  value={formState.nombre}
                  onChange={handleInputChange}
                  className={`border p-3 rounded w-full ${errors.nombre ? 'border-red-500' : ''}`}
                />
                {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
              </div>

              <div className="relative">
                <label htmlFor="descripcion" className="text-gray-700">Descripción</label>
                <textarea
                  id="descripcion"
                  placeholder="Descripción"
                  value={formState.descripcion}
                  onChange={handleInputChange}
                  className="border p-3 rounded w-full"
                />
              </div>

              <div className="relative">
                <label htmlFor="precio" className="text-gray-700">Precio</label>
                <input
                  type="number"
                  id="precio"
                  placeholder="Precio"
                  value={formState.precio}
                  onChange={handleInputChange}
                  className={`border p-3 rounded w-full ${errors.precio ? 'border-red-500' : ''}`}
                />
                {errors.precio && <p className="text-red-500 text-sm mt-1">{errors.precio}</p>}
              </div>

              <div className="relative">
                <label htmlFor="categoria_id" className="text-gray-700">Categoría</label>
                <select
                  id="categoria_id"
                  value={formState.categoria_id}
                  onChange={handleInputChange}
                  className={`border p-3 rounded w-full ${errors.categoria_id ? 'border-red-500' : ''}`}
                >
                  <option value="">Seleccionar Categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
                {errors.categoria_id && <p className="text-red-500 text-sm mt-1">{errors.categoria_id}</p>}
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={createOrUpdateProducto}
                className={`p-3 rounded shadow-md transition duration-200 flex items-center ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
              >
                {editingId ? <FaEdit className="inline mr-2" /> : <FaPlus className="inline mr-2" />}
                {editingId ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>

          {/* Tabla de productos */}
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider border border-gray-300">Nombre</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider border border-gray-300">Descripción</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider border border-gray-300">Precio</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider border border-gray-300">Categoría</th>
                  <th className="px-6 py-3 text-right text-sm font-bold text-gray-600 uppercase tracking-wider border border-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((producto) => (
                  <tr key={producto.id} className="hover:bg-gray-50 transition duration-200">
                    <td className="px-6 py-4 text-sm text-gray-700 border border-gray-300">{producto.nombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 border border-gray-300">{producto.descripcion}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 border border-gray-300">{producto.precio}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 border border-gray-300">{producto.categoria_id}</td>
                    <td className="px-6 py-4 text-right text-sm">
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={() => {
                            setEditingId(producto.id);
                            setFormState({
                              nombre: producto.nombre,
                              descripcion: producto.descripcion,
                              precio: producto.precio,
                              categoria_id: producto.categoria_id,
                            });
                          }}
                          className="bg-yellow-500 text-white p-2 rounded shadow-md hover:bg-yellow-600 transition duration-200 flex items-center"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => confirmDeleteProducto(producto.id)}
                          className="bg-red-500 text-white p-2 rounded shadow-md hover:bg-red-600 transition duration-200 flex items-center"
                        >
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
                <p className="mb-4">¿Estás seguro de que deseas eliminar este producto?</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-500 text-white p-2 rounded mr-2 shadow-md hover:bg-gray-600 transition duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={deleteProducto}
                    className="bg-red-500 text-white p-2 rounded shadow-md hover:bg-red-600 transition duration-200"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        <footer className="bg-white p-4 text-center text-gray-500 shadow-inner text-lg">
          &copy; {new Date().getFullYear()} Gestión de Productos. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

export default Productos;
