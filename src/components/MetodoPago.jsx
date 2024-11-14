import React, { useEffect, useState, useCallback } from 'react';
import axios from '../api';
import { FaPlus, FaEdit, FaTrash, FaBars } from 'react-icons/fa';
import Sidebar from './SideBar';

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [formState, setFormState] = useState({ nombre_metodo: '', detalles: '' });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [errors, setErrors] = useState({});

 
  const fetchPaymentMethods = useCallback(async () => {
    try {
      const response = await axios.get('/metodos-pago');
      setPaymentMethods(response.data);
    } catch (error) {
      console.error('Error al obtener métodos de pago:', error);
    } 
  }, []);

  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  const validateForm = () => {
    const newErrors = {};
    if (!formState.nombre_metodo) newErrors.nombre_metodo = 'Nombre del método es requerido';
    if (!formState.detalles) newErrors.detalles = 'Detalles son requeridos';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState({ ...formState, [id]: value });
  };

  const resetForm = () => {
    setFormState({ nombre_metodo: '', detalles: '' });
    setErrors({});
    setEditingId(null);
  };

  const createOrUpdatePaymentMethod = async () => {
    if (validateForm()) {
      try {
        if (editingId) {
          await axios.put(`/metodos-pago/${editingId}`, formState);
        } else {
          await axios.post('/metodos-pago', formState);
        }
        fetchPaymentMethods();
        resetForm();
      } catch (error) {
        console.error('Error al crear/actualizar método de pago:', error);
      }
    }
  };

  const confirmDeletePaymentMethod = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const deletePaymentMethod = async () => {
    try {
      if (deleteId) {
        await axios.delete(`/metodos-pago/${deleteId}`);
        fetchPaymentMethods();
        setShowModal(false);
        setDeleteId(null);
      }
    } catch (error) {
      console.error('Error al eliminar método de pago:', error);
    }
  };

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
          <h1 className="text-3xl font-semibold">Gestión de Métodos de Pago</h1>
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white focus:outline-none md:hidden">
              <FaBars />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8">
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6">Crear/Actualizar Método de Pago</h3>
            <div className="grid grid-cols-1 gap-6">
              <div className="relative">
                <label htmlFor="nombre_metodo" className="text-gray-700 font-semibold">Nombre del Método</label>
                <input
                  type="text"
                  id="nombre_metodo"
                  placeholder="Nombre del Método de Pago"
                  value={formState.nombre_metodo}
                  onChange={handleInputChange}
                  className={`border p-4 rounded-lg w-full mt-2 shadow-sm focus:ring-2 focus:ring-blue-600 ${errors.nombre_metodo ? 'border-red-500' : ''}`}
                />
                {errors.nombre_metodo && <p className="text-red-500 text-sm mt-1">{errors.nombre_metodo}</p>}
              </div>
              <div className="relative">
                <label htmlFor="detalles" className="text-gray-700 font-semibold">Detalles</label>
                <input
                  type="text"
                  id="detalles"
                  placeholder="Detalles del Método de Pago"
                  value={formState.detalles}
                  onChange={handleInputChange}
                  className={`border p-4 rounded-lg w-full mt-2 shadow-sm focus:ring-2 focus:ring-blue-600 ${errors.detalles ? 'border-red-500' : ''}`}
                />
                {errors.detalles && <p className="text-red-500 text-sm mt-1">{errors.detalles}</p>}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={createOrUpdatePaymentMethod}
                className={`p-4 rounded-lg shadow-lg transition duration-200 flex items-center text-white ${editingId ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700' : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'}`}
              >
                {editingId ? <FaEdit className="inline mr-2" /> : <FaPlus className="inline mr-2" />}
                {editingId ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-x-auto mb-8">
            <table className="min-w-full table-auto border-collapse border border-gray-400">
              <thead className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">N°</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">Nombre</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">Detalles</th>
                  <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wider border border-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-400">
                {paymentMethods.map((method, index) => (
                  <tr key={method.id} className="hover:bg-gray-100 transition duration-200">
                    <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">{method.nombre_metodo}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">{method.detalles}</td>
                    <td className="px-6 py-4 text-right text-sm border border-gray-400">
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={() => {
                            setEditingId(method.id);
                            setFormState({ nombre_metodo: method.nombre_metodo, detalles: method.detalles });
                          }}
                          className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-3 rounded-lg shadow-md hover:from-yellow-600 hover:to-yellow-700 transition duration-200 flex items-center"
                        >
                          <FaEdit className="mr-2" /> Editar
                        </button>

                        <button
                          onClick={() => confirmDeletePaymentMethod(method.id)}
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
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-2xl font-semibold mb-6">Confirmar Eliminación</h3>
                <p className="mb-6">¿Estás seguro de que deseas eliminar este método de pago?</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-3 rounded-lg shadow-md hover:bg-gray-700 transition duration-200 mr-2"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={deletePaymentMethod}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-lg shadow-md hover:from-red-600 hover:to-red-700 transition duration-200"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        <footer className="bg-white p-6 text-center text-gray-500 shadow-inner text-lg">
          &copy; {new Date().getFullYear()} Gestión de Métodos de Pago. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

export default PaymentMethods;
