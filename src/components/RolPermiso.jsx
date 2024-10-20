import React, { useState, useEffect } from 'react';
import axios from '../api';
import { FaPlus, FaTrash, FaBars, FaEye } from 'react-icons/fa';
import Sidebar from './SideBar';

const RolPermiso = () => {
  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [rolPermisos, setRolPermisos] = useState([]);
  const [selectedRolPermisos, setSelectedRolPermisos] = useState([]);
  const [selectedRol, setSelectedRol] = useState(null);
  const [formState, setFormState] = useState({ rol_id: '', permiso_id: '' });
  const [showModal, setShowModal] = useState(false);
  const [deleteIds, setDeleteIds] = useState({ rol_id: '', permiso_id: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const openRolPermisosModal = (rol_id) => {
    const permisosDelRol = rolPermisos.filter((rp) => rp.rol_id === rol_id);
    setSelectedRolPermisos(permisosDelRol);
    const rol = roles.find((r) => r.id === rol_id);
    setSelectedRol(rol);
    setShowModal(true);
  };

  const confirmDeleteRolPermiso = (rol_id, permiso_id) => {
    setDeleteIds({ rol_id, permiso_id });
    setShowDeleteModal(true); // Mostrar modal de confirmación
  };

  const deleteRolPermiso = async () => {
    try {
      if (deleteIds.rol_id && deleteIds.permiso_id) {
        await axios.delete('/rolpermiso', { data: deleteIds });
        setSelectedRolPermisos((prev) =>
          prev.filter((rp) => !(rp.rol_id === deleteIds.rol_id && rp.permiso_id === deleteIds.permiso_id))
        );
        setDeleteIds({ rol_id: '', permiso_id: '' });
        setShowDeleteModal(false); // Cerrar modal de confirmación
        fetchRolPermisos(); // Actualiza todos los permisos de roles después de eliminar
      }
    } catch (error) {
      console.error('Error al eliminar el permiso del rol:', error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <header className="flex justify-between items-center bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 shadow-md">
          <h1 className="text-3xl font-semibold">Gestión de Permisos de Roles</h1>
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white focus:outline-none md:hidden">
              <FaBars />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8">
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6">Asignar Permiso a Rol</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Form para seleccionar rol y permiso */}
              <div className="relative">
                <label htmlFor="rol_id" className="text-gray-700 font-semibold">Rol</label>
                <select
                  id="rol_id"
                  value={formState.rol_id}
                  onChange={handleInputChange}
                  className={`border p-4 rounded-lg w-full mt-2 shadow-sm focus:ring-2 focus:ring-blue-600 ${errors.rol_id ? 'border-red-500' : ''}`}
                >
                  <option value="">Seleccionar Rol</option>
                  {roles.map((rol) => (
                    <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                  ))}
                </select>
                {errors.rol_id && <p className="text-red-500 text-sm mt-1">{errors.rol_id}</p>}
              </div>

              <div className="relative">
                <label htmlFor="permiso_id" className="text-gray-700 font-semibold">Permiso</label>
                <select
                  id="permiso_id"
                  value={formState.permiso_id}
                  onChange={handleInputChange}
                  className={`border p-4 rounded-lg w-full mt-2 shadow-sm focus:ring-2 focus:ring-blue-600 ${errors.permiso_id ? 'border-red-500' : ''}`}
                >
                  <option value="">Seleccionar Permiso</option>
                  {permisos.map((permiso) => (
                    <option key={permiso.id} value={permiso.id}>{permiso.nombre}</option>
                  ))}
                </select>
                {errors.permiso_id && <p className="text-red-500 text-sm mt-1">{errors.permiso_id}</p>}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={createRolPermiso}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow-lg hover:from-green-600 hover:to-green-700 transition duration-200 flex items-center"
              >
                <FaPlus className="inline mr-2" /> Asignar
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto mb-8">
  <table className="min-w-full table-auto border-collapse border border-gray-400">
    <thead className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <tr>
        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">Rol</th>
        <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wider border border-gray-600">Acciones</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-400">
      {roles.map((rol) => (
        <tr key={rol.id} className="hover:bg-gray-100 transition duration-200">
          <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">{rol.nombre}</td>
          <td className="px-6 py-4 text-right text-sm border border-gray-400">
            <div className="flex space-x-2 justify-end">
              <button
                onClick={() => openRolPermisosModal(rol.id)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition duration-200 flex items-center"
              >
                <FaEye className="mr-2" /> Ver Permisos
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


          {/* Modal para ver permisos de un rol */}
{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl h-auto max-h-[75vh] overflow-y-auto">
      <h3 className="text-2xl font-semibold mb-6">Permisos para {selectedRol?.nombre}</h3>
      {selectedRolPermisos.length > 0 ? (
        <table className="min-w-full table-auto border-collapse border border-gray-400 mb-6">
          <thead className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">Permiso</th>
              <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wider border border-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-400">
            {selectedRolPermisos.map((rp) => (
              <tr key={`${rp.rol_id}-${rp.permiso_id}`} className="hover:bg-gray-100 transition duration-200">
                <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">{rp.permiso_nombre}</td>
                <td className="px-6 py-4 text-right text-sm border border-gray-400">
                  <div className="flex space-x-2 justify-end">
                    <button
                      onClick={() => confirmDeleteRolPermiso(rp.rol_id, rp.permiso_id)}
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
      ) : (
        <p className="text-center text-gray-600">Este rol no tiene permisos asignados.</p>
      )}
      <div className="flex justify-end mt-6">
        <button
          onClick={() => setShowModal(false)}
          className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-3 rounded-lg shadow-md hover:bg-gray-700 transition duration-200"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}

          {/* Modal de confirmación de eliminación */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-2xl font-semibold mb-6">Confirmar Eliminación</h3>
                <p>¿Estás seguro de que deseas eliminar este permiso del rol?</p>
                <div className="flex justify-end mt-6 space-x-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="bg-gray-500 text-white p-3 rounded-lg shadow-md hover:bg-gray-700 transition duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={deleteRolPermiso}
                    className="bg-red-500 text-white p-3 rounded-lg shadow-md hover:bg-red-700 transition duration-200"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        <footer className="bg-white p-6 text-center text-gray-500 shadow-inner text-lg">
          &copy; {new Date().getFullYear()} Gestión de Permisos de Roles. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

export default RolPermiso;
