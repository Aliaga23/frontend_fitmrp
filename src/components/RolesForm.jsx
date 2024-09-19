import React, { useState, useEffect } from 'react';
import axios from '../api';
import { FaCog, FaPlus, FaEdit, FaTrash, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import Sidebar from './SideBar'; // Importa el componente Sidebar

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [formState, setFormState] = useState({ nombre: '' });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'nombre', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const response = await axios.get('/roles');
    setRoles(response.data);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formState.nombre) newErrors.nombre = 'Nombre es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState({ ...formState, [id]: value });
  };

  const resetForm = () => {
    setFormState({ nombre: '' });
    setErrors({});
    setEditingId(null);
  };

  const createOrUpdateRol = async () => {
    if (validateForm()) {
      if (editingId) {
        await axios.put(`/roles/${editingId}`, formState);
      } else {
        await axios.post('/roles', formState);
      }
      fetchRoles();
      resetForm();
    }
  };

  const confirmDeleteRol = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const deleteRol = async () => {
    if (deleteId) {
      await axios.delete(`/roles/${deleteId}`);
      fetchRoles();
      setShowModal(false);
      setDeleteId(null);
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedRoles = [...roles].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredRoles = sortedRoles.filter((rol) =>
    rol.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRoles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);

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
          <div className="text-2xl font-semibold text-gray-800">Gestión de Roles</div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 focus:outline-none md:hidden">
              <FaBars />
            </button>
          </div>
        </header>

        {/* Formulario de Roles */}
        <main className="flex-1 p-4 md:p-6">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Crear/Actualizar Rol</h3>
            <div className="relative">
              <label htmlFor="nombre" className="text-gray-700">Nombre</label>
              <input
                type="text"
                id="nombre"
                placeholder="Nombre del Rol"
                value={formState.nombre}
                onChange={handleInputChange}
                className={`border p-3 rounded w-full ${errors.nombre ? 'border-red-500' : ''}`}
              />
              {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={createOrUpdateRol}
                className={`p-3 rounded shadow-md transition duration-200 flex items-center ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
              >
                {editingId ? <FaEdit className="inline mr-2" /> : <FaPlus className="inline mr-2" />}
                {editingId ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>

          {/* Tabla de Roles */}
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider border border-gray-300">Nombre</th>
                  <th className="px-6 py-3 text-right text-sm font-bold text-gray-600 uppercase tracking-wider border border-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {currentItems.map((rol) => (
                  <tr key={rol.id} className="hover:bg-gray-50 transition duration-200">
                    <td className="px-6 py-4 text-sm text-gray-700 border border-gray-300">{rol.nombre}</td>
                    <td className="px-6 py-4 text-right text-sm text-gray-700 border border-gray-300">
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={() => {
                            setEditingId(rol.id);
                            setFormState({ nombre: rol.nombre });
                          }}
                          className="bg-yellow-500 text-white p-2 rounded shadow-md hover:bg-yellow-600 transition duration-200 flex items-center"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => confirmDeleteRol(rol.id)}
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
            <div className="            flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Confirmar Eliminación</h3>
                <p className="mb-4">¿Estás seguro de que deseas eliminar este rol?</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-500 text-white p-2 rounded mr-2 shadow-md hover:bg-gray-600 transition duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={deleteRol}
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
          &copy; {new Date().getFullYear()} Gestión de Roles. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

export default Roles;

