import React, { useState, useEffect } from 'react';
import axios from '../api';
import { FaPlus, FaEdit, FaTrash, FaBars, FaUserCircle } from 'react-icons/fa';
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
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <header className="flex justify-between items-center bg-gradient-to-r from-gray-900 to-gray-800 text-white p-7 shadow-md relative">
          <h1 className="text-3xl font-semibold">Gestión de Usuarios</h1> {/* Título ligeramente más grande */}
          <div className="absolute right-6 top-7 text-right"> {/* Posición absoluta en la esquina derecha */}
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white focus:outline-none md:hidden">
              <FaBars />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8">
          {/* Box para el total de usuarios */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-700">Total Usuarios</h3>
              <p className="text-3xl font-bold text-gray-900">{usuarios.length}</p>
            </div>
            <FaUserCircle className="text-5xl text-gray-400" />
          </div>

          {/* Formulario */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6">Crear/Actualizar Usuario</h3>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${animate ? 'animate-pulse' : ''}`}>
              <div className="relative">
                <label htmlFor="nombre" className="text-gray-700 font-semibold">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  placeholder="Nombre"
                  value={formState.nombre}
                  onChange={handleInputChange}
                  className={`border p-4 rounded-lg w-full mt-2 shadow-sm focus:ring-2 focus:ring-blue-600 ${errors.nombre ? 'border-red-500' : ''}`}
                />
                {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
              </div>
              <div className="relative">
                <label htmlFor="email" className="text-gray-700 font-semibold">Correo Electrónico</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Correo Electrónico"
                  value={formState.email}
                  onChange={handleInputChange}
                  className={`border p-4 rounded-lg w-full mt-2 shadow-sm focus:ring-2 focus:ring-blue-600 ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="relative">
                <label htmlFor="rol_id" className="text-gray-700 font-semibold">Rol</label>
                <select
                  id="rol_id"
                  value={formState.rol_id}
                  onChange={handleInputChange}
                  className={`border p-4 rounded-lg w-full mt-2 shadow-sm focus:ring-2 focus:ring-blue-600 ${errors.rol_id ? 'border-red-500' : ''}`}
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
                  <label htmlFor="password" className="text-gray-700 font-semibold">Contraseña</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Contraseña"
                    value={formState.password}
                    onChange={handleInputChange}
                    className={`border p-4 rounded-lg w-full mt-2 shadow-sm focus:ring-2 focus:ring-blue-600 ${errors.password ? 'border-red-500' : ''}`}
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={createOrUpdateUsuario}
                className={`p-4 rounded-lg shadow-lg transition duration-200 flex items-center text-white ${editingId ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700' : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'}`}
              >
                {editingId ? <FaEdit className="inline mr-2" /> : <FaPlus className="inline mr-2" />}
                {editingId ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>

         {/* Tabla de usuarios */}
<div className="bg-white rounded-lg shadow-lg overflow-x-auto mb-8">
  <table className="min-w-full table-auto border-collapse border border-gray-400">
    <thead className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <tr>
        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">Nombre</th>
        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">Correo Electrónico</th>
        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">Rol</th>
        <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wider border border-gray-600">Acciones</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-400">
      {currentItems.map((usuario) => (
        <tr key={usuario.id} className="hover:bg-gray-100 transition duration-200">
          <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">{usuario.nombre}</td>
          <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">{usuario.email}</td>
          <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">{usuario.rol_id}</td>
          <td className="px-6 py-4 text-right text-sm border border-gray-400">
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
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-3 rounded-lg shadow-md hover:from-yellow-600 hover:to-yellow-700 transition duration-200 flex items-center"
              >
                <span className="mr-2">Editar</span>
                <FaEdit />
              </button>

              <button
                onClick={() => confirmDeleteUsuario(usuario.id)}
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-2xl font-semibold mb-6">Confirmar Eliminación</h3>
                <p className="mb-6">¿Estás seguro de que deseas eliminar este usuario?</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-3 rounded-lg shadow-md hover:bg-gray-700 transition duration-200 mr-2"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={deleteUsuario}
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
          &copy; {new Date().getFullYear()} Gestión de Usuarios. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

export default Usuarios;
