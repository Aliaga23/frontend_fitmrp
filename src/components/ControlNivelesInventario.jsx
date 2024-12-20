import React, { useState, useEffect } from 'react';
import axios from '../api';
import { FaPlus, FaEdit, FaBars } from 'react-icons/fa';
import Sidebar from './SideBar';

const ControlNivelesInventario = () => {
  const [inventarios, setInventarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [formState, setFormState] = useState({
    producto_id: '',
    cantidad: '',
    esEntrada: true, // Para controlar si es una entrada o salida de inventario
  });
  const [ setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    fetchInventarios();
    fetchProductos();
  }, []);

  // Fetch de inventarios
  const fetchInventarios = async () => {
    try {
      const response = await axios.get('/inventories');
      setInventarios(response.data);
    } catch (error) {
      console.error('Error al obtener inventarios:', error);
    }
  };

  // Fetch de productos
  const fetchProductos = async () => {
    try {
      const response = await axios.get('/products');
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  // Validación de formulario
  const validateForm = () => {
    const newErrors = {};
    if (!formState.producto_id) newErrors.producto_id = 'Producto es requerido';
    if (!formState.cantidad) newErrors.cantidad = 'Cantidad es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en los inputs
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
      producto_id: '',
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
        const { producto_id, cantidad, esEntrada } = formState;

        // Llamada a la API para actualizar el inventario
        await axios.put(`/inventories/${producto_id}`, {
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

  // Filtrar inventarios por búsqueda (si se implementara una búsqueda en el futuro)
  const filteredInventarios = inventarios;

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
          <h1 className="text-3xl font-semibold">Control de Niveles de Inventario</h1>
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white focus:outline-none md:hidden">
              <FaBars />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8">
          {/* Formulario para crear/actualizar inventario */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6">Actualizar Inventario</h3>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`}>
              <div className="relative">
                <label htmlFor="producto_id" className="text-gray-700 font-semibold">Producto</label>
                <select
                  id="producto_id"
                  value={formState.producto_id}
                  onChange={handleInputChange}
                  className={`border p-4 rounded-lg w-full mt-2 shadow-sm focus:ring-2 focus:ring-blue-600 ${errors.producto_id ? 'border-red-500' : ''}`}
                >
                  <option value="">Seleccionar Producto</option>
                  {productos.map((producto) => (
                    <option key={producto.id} value={producto.id}>
                      {producto.nombre}
                    </option>
                  ))}
                </select>
                {errors.producto_id && <p className="text-red-500 text-sm mt-1">{errors.producto_id}</p>}
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
      <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">{item.nombre}</td>
      <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">{item.cantidad_disponible}</td>
      <td className="px-6 py-4 text-right text-sm border border-gray-400">
        <div className="flex space-x-2 justify-end">
          <button
            onClick={() => {
              setEditingId(item.id);
              setFormState({
                producto_id: item.producto_id,
                cantidad: item.cantidad_disponible,
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
          &copy; {new Date().getFullYear()} Control de Niveles de Inventario. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

export default ControlNivelesInventario;
