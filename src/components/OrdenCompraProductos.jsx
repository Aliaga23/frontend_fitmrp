import React, { useState, useEffect } from 'react';
import axios from '../api'; // Asegúrate de que axios esté configurado
import { FaPlus, FaEdit, FaTrash, FaBars, FaEye } from 'react-icons/fa';
import Sidebar from './SideBar'; // Asegúrate de tener un componente de Sidebar
import Modal from 'react-modal'; // Usaremos react-modal para el modal de productos

// Asegúrate de configurar los estilos del modal
Modal.setAppElement('#root');

const OrdenCompraProducto = () => {
  const [ordenesCompraProductos, setOrdenesCompraProductos] = useState([]);
  const [productos, setProductos] = useState([]); // Productos de la orden
  const [ordenesCompra, setOrdenesCompra] = useState([]); // Lista de órdenes de compra
  const [formState, setFormState] = useState({
    orden_compra_id: '',
    producto_id: '',
    cantidad: '',
  });
  const [errors, setErrors] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [editingOrdenCompraProducto, setEditingOrdenCompraProducto] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // Estado del modal
  const [productosOrden, setProductosOrden] = useState([]); // Productos de la orden seleccionada

  useEffect(() => {
    fetchOrdenesCompraProductos();
    fetchOrdenesCompra();
    fetchProductos(); // Cargar productos al inicio
  }, []);

  const fetchOrdenesCompraProductos = async () => {
    try {
      const response = await axios.get('/ordencompra-producto');
      setOrdenesCompraProductos(response.data);
    } catch (error) {
      console.error('Error al obtener las órdenes de compra de productos:', error);
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

  const fetchOrdenesCompra = async () => {
    try {
      const response = await axios.get('/orden-compra');
      setOrdenesCompra(response.data);
    } catch (error) {
      console.error('Error al obtener las órdenes de compra:', error);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState({ ...formState, [id]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formState.orden_compra_id) newErrors.orden_compra_id = 'Orden de compra es requerida';
    if (!formState.producto_id) newErrors.producto_id = 'Producto es requerido';
    if (!formState.cantidad) newErrors.cantidad = 'Cantidad es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveOrdenCompraProducto = async () => {
    if (validateForm()) {
      try {
        const { orden_compra_id, producto_id, cantidad } = formState;

        if (editingOrdenCompraProducto) {
          await axios.put(`/ordencompra-producto/${editingOrdenCompraProducto.orden_compra_id}/${editingOrdenCompraProducto.producto_id}`, {
            producto_id,
            cantidad,
          });
        } else {
          await axios.post('/ordencompra-producto', {
            orden_compra_id,
            producto_id,
            cantidad,
          });
        }

        fetchOrdenesCompraProductos();
        resetForm();
      } catch (error) {
        console.error('Error al guardar la orden de compra de producto:', error);
      }
    }
  };

  const handleEditOrdenCompraProducto = (ordenCompraProducto) => {
    setEditingOrdenCompraProducto(ordenCompraProducto);
    setFormState({
      orden_compra_id: ordenCompraProducto.orden_compra_id,
      producto_id: ordenCompraProducto.producto_id,
      cantidad: ordenCompraProducto.cantidad,
    });
  };

  const handleDeleteOrdenCompraProducto = async (orden_compra_id, producto_id) => {
    try {
      await axios.delete(`/ordencompra-producto/${orden_compra_id}/${producto_id}`);
      fetchOrdenesCompraProductos();
    } catch (error) {
      console.error('Error al eliminar la orden de compra de producto:', error);
    }
  };

  const resetForm = () => {
    setFormState({
      orden_compra_id: '',
      producto_id: '',
      cantidad: '',
    });
    setErrors({});
    setEditingOrdenCompraProducto(null);
  };

  // Función para abrir el modal y cargar los productos de una orden
  const handleViewProductos = async (orden_compra_id) => {
    try {
      const response = await axios.get(`/ordencompra-producto/${orden_compra_id}`);
      setProductosOrden(response.data); // Guardar los productos en el estado
      setModalOpen(true); // Abrir el modal
    } catch (error) {
      console.error('Error al obtener los productos de la orden:', error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = ordenesCompraProductos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(ordenesCompraProductos.length / itemsPerPage);

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
          <h1 className="text-3xl font-semibold">Gestión de Órdenes de Compra de Productos</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white focus:outline-none md:hidden">
            <FaBars />
          </button>
        </header>

        <main className="flex-1 p-6 md:p-8">
          {/* Formulario para crear o editar orden de compra de producto */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              {editingOrdenCompraProducto ? 'Editar Orden de Compra de Producto' : 'Nueva Orden de Compra de Producto'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              {/* Select para Orden de Compra */}
              <div className="relative">
                <label htmlFor="orden_compra_id" className="block text-gray-700 font-medium mb-2">Orden de Compra</label>
                <select
                  id="orden_compra_id"
                  value={formState.orden_compra_id}
                  onChange={handleInputChange}
                  className={`border p-3 rounded-lg w-full ${errors.orden_compra_id ? 'border-red-500' : ''}`}
                >
                  <option value="">Seleccionar orden de compra</option>
                  {ordenesCompra.length > 0 ? (
                    ordenesCompra.map((orden) => (
                      <option key={orden.id} value={orden.id}>
                        {`Orden #${orden.id} - Fecha: ${new Date(orden.fecha).toLocaleDateString()}`}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No hay órdenes de compra disponibles
                    </option>
                  )}
                </select>
                {errors.orden_compra_id && <p className="text-red-500 text-sm mt-2">{errors.orden_compra_id}</p>}
              </div>

              {/* Select para Producto */}
              <div className="relative">
                <label htmlFor="producto_id" className="block text-gray-700 font-medium mb-2">Producto</label>
                <select
                  id="producto_id"
                  value={formState.producto_id}
                  onChange={handleInputChange}
                  className={`border p-3 rounded-lg w-full ${errors.producto_id ? 'border-red-500' : ''}`}
                >
                  <option value="">Seleccionar producto</option>
                  {productos.length > 0 ? (
                    productos.map((producto) => (
                      <option key={producto.id} value={producto.id}>
                        {producto.nombre}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No hay productos disponibles
                    </option>
                  )}
                </select>
                {errors.producto_id && <p className="text-red-500 text-sm mt-2">{errors.producto_id}</p>}
              </div>

              {/* Input para Cantidad */}
              <div className="relative">
                <label htmlFor="cantidad" className="block text-gray-700 font-medium mb-2">Cantidad</label>
                <input
                  type="number"
                  id="cantidad"
                  value={formState.cantidad}
                  onChange={handleInputChange}
                  className={`border p-3 rounded-lg w-full ${errors.cantidad ? 'border-red-500' : ''}`}
                />
                {errors.cantidad && <p className="text-red-500 text-sm mt-2">{errors.cantidad}</p>}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveOrdenCompraProducto}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition duration-200 flex items-center"
              >
                <FaPlus className="mr-2" /> Guardar
              </button>
            </div>
          </div>

          {/* Tabla de Órdenes de Compra de Productos */}
          <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Órdenes de Compra de Productos</h3>

            <table className="min-w-full table-auto border-collapse border border-gray-400">
              <thead className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600 whitespace-nowrap">
                    Orden de Compra
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600 whitespace-nowrap">
                    Producto
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600 whitespace-nowrap">
                    Cantidad
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wider border border-gray-600 whitespace-nowrap">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-400">
                {currentItems.map((ordenCompraProducto) => {
                  const ordenCompra = ordenesCompra.find((orden) => orden.id === ordenCompraProducto.orden_compra_id);
                  const producto = productos.find((prod) => prod.id === ordenCompraProducto.producto_id);
                  return (
                    <tr key={`${ordenCompraProducto.orden_compra_id}-${ordenCompraProducto.producto_id}`} className="hover:bg-gray-100 transition duration-200">
                      <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400 whitespace-nowrap">
                        {ordenCompra ? `Orden #${ordenCompra.id}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400 whitespace-nowrap">
                        {producto ? producto.nombre : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400 whitespace-nowrap">
                        {ordenCompraProducto.cantidad}
                      </td>
                      <td className="px-6 py-4 text-right text-sm border border-gray-400 whitespace-nowrap">
                        <div className="flex space-x-2 justify-end">
                          <button
                            onClick={() => handleEditOrdenCompraProducto(ordenCompraProducto)}
                            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-3 rounded-lg shadow-md hover:from-yellow-600 hover:to-yellow-700 transition duration-200 flex items-center"
                          >
                            <FaEdit className="mr-2" /> Editar
                          </button>
                          <button
                            onClick={() => handleDeleteOrdenCompraProducto(ordenCompraProducto.orden_compra_id, ordenCompraProducto.producto_id)}
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-lg shadow-md hover:from-red-600 hover:to-red-700 transition duration-200 flex items-center"
                          >
                            <FaTrash className="mr-2" /> Eliminar
                          </button>
                          <button
                            onClick={() => handleViewProductos(ordenCompraProducto.orden_compra_id)}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition duration-200 flex items-center"
                          >
                            <FaEye className="mr-2" /> Ver Productos
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

        {/* Modal para ver los productos */}
        <Modal
          isOpen={modalOpen}
          onRequestClose={() => setModalOpen(false)}
          contentLabel="Productos de la Orden"
          className="modal bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto my-16"
          overlayClassName="modal-overlay bg-black bg-opacity-50 fixed inset-0"
        >
          <h2 className="text-2xl font-semibold mb-4">Productos de la Orden</h2>
          <table className="min-w-full table-auto border-collapse border border-gray-400">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-2">Producto</th>
                <th className="px-4 py-2">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {productosOrden.map((producto) => (
                <tr key={producto.producto_id}>
                  <td className="border px-4 py-2">{producto.producto_nombre}</td>
                  <td className="border px-4 py-2">{producto.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => setModalOpen(false)}
            className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700"
          >
            Cerrar
          </button>
        </Modal>

        <footer className="bg-white p-6 text-center text-gray-500 shadow-inner text-lg">
          &copy; {new Date().getFullYear()} Gestión de Órdenes de Compra de Productos. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

export default OrdenCompraProducto;
