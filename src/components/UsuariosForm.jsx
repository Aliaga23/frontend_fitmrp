import React, { useState, useEffect } from 'react';
import axios from '../api';
import { FaPlus, FaEdit, FaTrash, FaBars } from 'react-icons/fa';
import Sidebar from './SideBar';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formState, setFormState] = useState({
    nombre: '',
    email: '',
    rol_id: '',
    password: '', // Campo de contraseña
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
    fetchUsuarios();
    fetchRoles();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('/users');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get('/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error al obtener roles:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formState.nombre) newErrors.nombre = 'Nombre es requerido';
    if (!formState.email) newErrors.email = 'Email es requerido';
    if (!formState.rol_id) newErrors.rol_id = 'Rol es requerido';
    if (!formState.password && !editingId) newErrors.password = 'Contraseña es requerida'; // Validar solo si no estamos editando
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
      email: '',
      rol_id: '',
      password: '',
    });
    setErrors({});
    setEditingId(null);
  };

  const createOrUpdateUsuario = async () => {
    if (validateForm()) {
      try {
        if (editingId) {
          await axios.put(`/users/${editingId}`, formState);
        } else {
          await axios.post('/users', formState);
        }
        fetchUsuarios();
        resetForm();
        setAnimate(true);
        setTimeout(() => setAnimate(false), 500);
      } catch (error) {
        console.error('Error al crear/actualizar usuario:', error);
        setErrors({ form: 'Error al guardar los cambios' });
      }
    }
  };

  const confirmDeleteUsuario = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const deleteUsuario = async () => {
    try {
      if (deleteId) {
        await axios.delete(`/users/${deleteId}`);
        fetchUsuarios();
        setShowModal(false);
        setDeleteId(null);
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  const sortedUsuarios = [...usuarios].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredUsuarios = sortedUsuarios.filter((usuario) =>
    usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsuarios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);

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
          <div className="text-2xl font-semibold text-gray-800">Gestión de Usuarios</div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 focus:outline-none md:hidden">
              <FaBars />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          {/* Formulario */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Crear/Actualizar Usuario</h3>
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
                <label htmlFor="email" className="text-gray-700">Correo Electrónico</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Correo Electrónico"
                  value={formState.email}
                  onChange={handleInputChange}
                  className={`border p-3 rounded w-full ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="relative">
                <label htmlFor="rol_id" className="text-gray-700">Rol</label>
                <select
                  id="rol_id"
                  value={formState.rol_id}
                  onChange={handleInputChange}
                  className={`border p-3 rounded w-full ${errors.rol_id ? 'border-red-500' : ''}`}
                >
                  <option value="">Seleccionar rol</option>
                  {roles.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombre}
                    </option>
                  ))}
                </select>
                {errors.rol_id && <p className="text-red-500 text-sm mt-1">{errors.rol_id}</p>}
              </div>

              {!editingId && (
                <div className="relative">
                  <label htmlFor="password" className="text-gray-700">Contraseña</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Contraseña"
                    value={formState.password}
                    onChange={handleInputChange}
                    className={`border p-3 rounded w-full ${errors.password ? 'border-red-500' : ''}`}
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={createOrUpdateUsuario}
                className={`p-3 rounded shadow-md transition duration-200 flex items-center ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
              >
                {editingId ? <FaEdit className="inline mr-2" /> : <FaPlus className="inline mr-2" />}
                {editingId ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>

          {/* Tabla de usuarios */}
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider border border-gray-300">Nombre</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider border border-gray-300">Correo Electrónico</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider border border-gray-300">Rol</th>
                  <th className="px-6 py-3 text-right text-sm font-bold text-gray-600 uppercase tracking-wider border border-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50 transition duration-200">
                    <td className="px-6 py-4 text-sm text-gray-700 border border-gray-300">{usuario.nombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 border border-gray-300">{usuario.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 border border-gray-300">{usuario.rol_id}</td>
                    <td className="px-6 py-4 text-right text-sm">
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={() => {
                            setEditingId(usuario.id);
                            setFormState({
                              nombre: usuario.nombre,
                              email: usuario.email,
                              rol_id: usuario.rol_id,
                              password: '', // Resetear el campo de contraseña al editar
                            });
                          }}
                          className="bg-yellow-500 text-white p-2 rounded shadow-md hover:bg-yellow-600 transition duration-200 flex items-center"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => confirmDeleteUsuario(usuario.id)}
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
                <p className="mb-4">¿Estás seguro de que deseas eliminar este usuario?</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-500 text-white p-2 rounded mr-2 shadow-md hover:bg-gray-600 transition duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={deleteUsuario}
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
          &copy; {new Date().getFullYear()} Gestión de Usuarios. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

export default Usuarios;
