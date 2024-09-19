import React, { useState, useEffect } from 'react';
import axios from '../api';
import { FaPlus, FaTrash, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import Sidebar from './SideBar';

const RolPermiso = () => {
  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [rolPermisos, setRolPermisos] = useState([]);
  const [formState, setFormState] = useState({ rol_id: '', permiso_id: '' });
  const [showModal, setShowModal] = useState(false);
  const [deleteIds, setDeleteIds] = useState({ rol_id: '', permiso_id: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchRoles();
    fetchPermisos();
    fetchRolPermisos();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get('/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error al obtener roles:', error);
    }
  };

  const fetchPermisos = async () => {
    try {
      const response = await axios.get('/permisos');
      setPermisos(response.data);
    } catch (error) {
      console.error('Error al obtener permisos:', error);
    }
  };

  const fetchRolPermisos = async () => {
    try {
      const response = await axios.get('/rolpermiso');
      // Asegúrate de que los datos se asignan correctamente
      console.log('Datos de rol-permisos:', response.data);
      setRolPermisos(response.data);
    } catch (error) {
      console.error('Error al obtener permisos de roles:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formState.rol_id) newErrors.rol_id = 'Rol es requerido';
    if (!formState.permiso_id) newErrors.permiso_id = 'Permiso es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState({ ...formState, [id]: value });
  };

  const resetForm = () => {
    setFormState({ rol_id: '', permiso_id: '' });
    setErrors({});
  };

  const createRolPermiso = async () => {
    if (validateForm()) {
      try {
        await axios.post('/rolpermiso', formState);
        fetchRolPermisos();
        resetForm();
      } catch (error) {
        console.error('Error al asignar permiso al rol:', error);
      }
    }
  };

  const confirmDeleteRolPermiso = (rol_id, permiso_id) => {
    setDeleteIds({ rol_id, permiso_id });
    setShowModal(true);
  };

  const deleteRolPermiso = async () => {
    try {
      if (deleteIds.rol_id && deleteIds.permiso_id) {
        await axios.delete('/rolpermiso', { data: deleteIds });
        fetchRolPermisos();
        setShowModal(false);
        setDeleteIds({ rol_id: '', permiso_id: '' });
      }
    } catch (error) {
      console.error('Error al eliminar el permiso del rol:', error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <header className="flex justify-between items-center bg-white p-4 shadow-md">
          <div className="text-2xl font-semibold text-gray-800">Gestión de Permisos de Roles</div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 focus:outline-none md:hidden">
              <FaBars />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Asignar Permiso a Rol</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="relative">
                <label htmlFor="rol_id" className="text-gray-700">Rol</label>
                <select
                  id="rol_id"
                  value={formState.rol_id}
                  onChange={handleInputChange}
                  className={`border p-3 rounded w-full ${errors.rol_id ? 'border-red-500' : ''}`}
                >
                  <option value="">Seleccionar Rol</option>
                  {roles.map((rol) => (
                    <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                  ))}
                </select>
                {errors.rol_id && <p className="text-red-500 text-sm mt-1">{errors.rol_id}</p>}
              </div>
              <div className="relative">
                <label htmlFor="permiso_id" className="text-gray-700">Permiso</label>
                <select
                  id="permiso_id"
                  value={formState.permiso_id}
                  onChange={handleInputChange}
                  className={`border p-3 rounded w-full ${errors.permiso_id ? 'border-red-500' : ''}`}
                >
                  <option value="">Seleccionar Permiso</option>
                  {permisos.map((permiso) => (
                    <option key={permiso.id} value={permiso.id}>{permiso.nombre}</option>
                  ))}
                </select>
                {errors.permiso_id && <p className="text-red-500 text-sm mt-1">{errors.permiso_id}</p>}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={createRolPermiso}
                className="bg-green-500 text-white p-3 rounded shadow-md hover:bg-green-600 transition duration-200 flex items-center"
              >
                <FaPlus className="mr-2" /> Asignar
              </button>
            </div>
          </div>

          {/* Tabla de Permisos por Rol */}
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Permiso</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
  {rolPermisos.length > 0 ? (
    rolPermisos.map((rp) => (
      <tr key={`${rp.rol_id}-${rp.permiso_id}`} className="hover:bg-gray-100 transition duration-200">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rp.rol_nombre}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rp.permiso_nombre}</td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button
            onClick={() => confirmDeleteRolPermiso(rp.rol_id, rp.permiso_id)}
            className="bg-red-500 text-white p-2 rounded shadow-md hover:bg-red-600 transition duration-200 flex items-center"
          >
            <FaTrash />
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-500">
        No hay permisos asignados a roles.
      </td>
    </tr>
  )}
</tbody>

            </table>
          </div>

          {/* Modal para Confirmación de Eliminación */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Confirmar Eliminación</h3>
                <p className="mb-4">¿Estás seguro de que deseas eliminar este permiso del rol?</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-500 text-white p-2 rounded mr-2 shadow-md hover:bg-gray-600 transition duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={deleteRolPermiso}
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
          &copy; {new Date().getFullYear()} Gestión de Permisos de Roles. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

export default RolPermiso;
