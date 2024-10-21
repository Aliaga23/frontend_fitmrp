import React, { useState, useEffect } from 'react';
import axios from '../api';
import { FaPlus, FaEdit, FaTrash} from 'react-icons/fa';
import Sidebar from './SideBar';

const OrdenesCompraMateriaPrima = () => {
  const [ordenesCompraMateriaPrima, setOrdenesCompraMateriaPrima] = useState([]);
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [proveedores, setProveedores] = useState([]); // Lista de proveedores
  const [ordenesCompra, setOrdenesCompra] = useState([]); // Lista de órdenes de compra
  const [formState, setFormState] = useState({
    orden_compra_id: '',
    materia_prima_id: '',
    cantidad: '',
    proveedor_id: '' // Añadir proveedor_id al estado del formulario
  });
  const [errors, setErrors] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [editingOrdenCompraMateriaPrima, setEditingOrdenCompraMateriaPrima] = useState(null);

  useEffect(() => {
    fetchOrdenesCompraMateriaPrima();
    fetchMateriasPrimas();
    fetchProveedores(); // Cargar proveedores
    fetchOrdenesCompra(); // Obtener órdenes de compra al cargar
  }, []);

  const fetchOrdenesCompraMateriaPrima = async () => {
    try {
      const response = await axios.get('/orden-compra-materiaprima');
      setOrdenesCompraMateriaPrima(response.data);
    } catch (error) {
      console.error('Error al obtener las órdenes de compra de materia prima:', error);
    }
  };

  const fetchMateriasPrimas = async () => {
    try {
      const response = await axios.get('/materiaprima');
      setMateriasPrimas(response.data);
    } catch (error) {
      console.error('Error al obtener las materias primas:', error);
    }
  };

  const fetchProveedores = async () => {
    try {
      const response = await axios.get('/proveedores');
      setProveedores(response.data); // Guardar proveedores
    } catch (error) {
      console.error('Error al obtener los proveedores:', error);
    }
  };

  const fetchOrdenesCompra = async () => {
    try {
      const response = await axios.get('/orden-compra');
      const ordenesProducto = response.data.filter((orden) => orden.tipo_orden === 'producto');
      setOrdenesCompra(ordenesProducto);
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
    if (!formState.materia_prima_id) newErrors.materia_prima_id = 'Materia prima es requerida';
    if (!formState.cantidad) newErrors.cantidad = 'Cantidad es requerida';
    if (!formState.proveedor_id) newErrors.proveedor_id = 'Proveedor es requerido'; // Validar proveedor
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveOrdenCompraMateriaPrima = async () => {
    if (validateForm()) {
      try {
        const { orden_compra_id, materia_prima_id, cantidad, proveedor_id } = formState;

        if (editingOrdenCompraMateriaPrima) {
          // Para actualización
          await axios.put(`/orden-compra-materiaprima/${editingOrdenCompraMateriaPrima.orden_compra_id}/${editingOrdenCompraMateriaPrima.materia_prima_id}`, {
            cantidad,
            proveedor_id // Enviar proveedor al actualizar
          });
        } else {
          // Para creación
          await axios.post('/orden-compra-materiaprima', {
            orden_compra_id,
            materia_prima_id,
            cantidad,
            proveedor_id // Enviar proveedor al crear
          });
        }

        fetchOrdenesCompraMateriaPrima();
        resetForm();
      } catch (error) {
        console.error('Error al guardar la orden de compra de materia prima:', error);
      }
    }
  };

  const handleEditOrdenCompraMateriaPrima = (ordenCompraMateriaPrima) => {
    setEditingOrdenCompraMateriaPrima(ordenCompraMateriaPrima);
    setFormState({
      orden_compra_id: ordenCompraMateriaPrima.orden_compra_id,
      materia_prima_id: ordenCompraMateriaPrima.materia_prima_id,
      cantidad: ordenCompraMateriaPrima.cantidad,
      proveedor_id: ordenCompraMateriaPrima.proveedor_id // Añadir proveedor al editar
    });
  };

  const handleDeleteOrdenCompraMateriaPrima = async (orden_compra_id, materia_prima_id) => {
    try {
      await axios.delete(`/orden-compra-materiaprima/${orden_compra_id}/${materia_prima_id}`);
      fetchOrdenesCompraMateriaPrima();
    } catch (error) {
      console.error('Error al eliminar la orden de compra de materia prima:', error);
    }
  };

  const resetForm = () => {
    setFormState({
      orden_compra_id: '',
      materia_prima_id: '',
      cantidad: '',
      proveedor_id: '' // Limpiar proveedor
    });
    setErrors({});
    setEditingOrdenCompraMateriaPrima(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = ordenesCompraMateriaPrima.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(ordenesCompraMateriaPrima.length / itemsPerPage);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <header className="flex justify-between items-center bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 shadow-md">
          <h1 className="text-3xl font-semibold">Gestión de Órdenes de Compra de Materia Prima</h1>
        </header>

        <main className="flex-1 p-6 md:p-8">
          {/* Formulario para crear o editar */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              {editingOrdenCompraMateriaPrima ? 'Editar Orden de Compra de Materia Prima' : 'Nueva Orden de Compra de Materia Prima'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              {/* Select para Orden de Compra */}
              <div className="relative">
                <label htmlFor="orden_compra_id" className="block text-gray-700 font-medium mb-2">Orden de Compra (tipo producto)</label>
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

              {/* Select para Materia Prima */}
              <div className="relative">
                <label htmlFor="materia_prima_id" className="block text-gray-700 font-medium mb-2">Materia Prima</label>
                <select
                  id="materia_prima_id"
                  value={formState.materia_prima_id}
                  onChange={handleInputChange}
                  className={`border p-3 rounded-lg w-full ${errors.materia_prima_id ? 'border-red-500' : ''}`}
                >
                  <option value="">Seleccionar materia prima</option>
                  {materiasPrimas.length > 0 ? (
                    materiasPrimas.map((materia) => (
                      <option key={materia.id} value={materia.id}>
                        {materia.nombre}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No hay materias primas disponibles
                    </option>
                  )}
                </select>
                {errors.materia_prima_id && <p className="text-red-500 text-sm mt-2">{errors.materia_prima_id}</p>}
              </div>

              {/* Select para Proveedor */}
              <div className="relative">
                <label htmlFor="proveedor_id" className="block text-gray-700 font-medium mb-2">Proveedor</label>
                <select
                  id="proveedor_id"
                  value={formState.proveedor_id}
                  onChange={handleInputChange}
                  className={`border p-3 rounded-lg w-full ${errors.proveedor_id ? 'border-red-500' : ''}`}
                >
                  <option value="">Seleccionar proveedor</option>
                  {proveedores.length > 0 ? (
                    proveedores.map((proveedor) => (
                      <option key={proveedor.id} value={proveedor.id}>
                        {proveedor.nombre}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No hay proveedores disponibles
                    </option>
                  )}
                </select>
                {errors.proveedor_id && <p className="text-red-500 text-sm mt-2">{errors.proveedor_id}</p>}
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
                onClick={handleSaveOrdenCompraMateriaPrima}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition duration-200 flex items-center"
              >
                <FaPlus className="mr-2" /> Guardar
              </button>
            </div>
          </div>

          {/* Tabla de Órdenes de Compra de Materia Prima */}
          <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Órdenes de Compra de Materia Prima</h3>

            <table className="min-w-full table-auto border-collapse border border-gray-400">
              <thead className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">
                    Orden de Compra
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">
                    Materia Prima
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">
                    Proveedor
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">
                    Cantidad
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wider border border-gray-600">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-400">
                {currentItems.map((ordenCompraMateriaPrima) => {
                  const ordenCompra = ordenesCompra.find((orden) => orden.id === ordenCompraMateriaPrima.orden_compra_id);
                  return (
                    <tr key={`${ordenCompraMateriaPrima.orden_compra_id}-${ordenCompraMateriaPrima.materia_prima_id}`} className="hover:bg-gray-100 transition duration-200">
                      <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">
                        {ordenCompra ? `Orden #${ordenCompra.id}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">
                        {ordenCompraMateriaPrima.materia_prima_nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">
                        {ordenCompraMateriaPrima.proveedor_nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">
                        {ordenCompraMateriaPrima.cantidad}
                      </td>
                      <td className="px-6 py-4 text-right text-sm border border-gray-400">
                        <div className="flex space-x-2 justify-end">
                          <button
                            onClick={() => handleEditOrdenCompraMateriaPrima(ordenCompraMateriaPrima)}
                            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-3 rounded-lg shadow-md hover:from-yellow-600 hover:to-yellow-700 transition duration-200 flex items-center"
                          >
                            <FaEdit className="mr-2" /> Editar
                          </button>
                          <button
                            onClick={() => handleDeleteOrdenCompraMateriaPrima(ordenCompraMateriaPrima.orden_compra_id, ordenCompraMateriaPrima.materia_prima_id)}
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-lg shadow-md hover:from-red-600 hover:to-red-700 transition duration-200 flex items-center"
                          >
                            <FaTrash className="mr-2" /> Eliminar
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

        <footer className="bg-white p-6 text-center text-gray-500 shadow-inner text-lg">
          &copy; {new Date().getFullYear()} Gestión de Órdenes de Compra de Materia Prima. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

export default OrdenesCompraMateriaPrima;
