import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaBoxOpen, FaRoute, FaSignOutAlt, FaBars, FaChevronDown, FaChevronRight, FaClipboardList } from 'react-icons/fa'; 
import routesConfig from './routesConfig';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleLogout = () => {
    navigate('/');
  };

  const renderMenuItems = (items) => {
    return items.map((item) => (
      <Link
        key={item.path}
        to={item.path}
        className="flex items-center py-4 px-4 text-lg text-white hover:bg-blue-600 transition duration-200 transform hover:scale-105"
      >
        <span className="ml-2">{item.label}</span>
      </Link>
    ));
  };

  const renderSections = () => {
    return Object.keys(routesConfig).map((key) => {
      const section = routesConfig[key];
      const isExpanded = expandedSections[key];
      const Icon = getIconBySector(section.items[0].sector);
      const iconElement = Icon ? <Icon className="mr-3 text-white" size={16} /> : null;

      return (
        <div key={key} className="flex flex-col mb-4">
          <div
            className="flex items-center py-4 px-4 text-lg text-white hover:bg-blue-600 cursor-pointer transition duration-200 transform hover:scale-105"
            onClick={() => toggleSection(key)}
          >
            {iconElement}
            <span>{section.items[0].sector}</span>
            <span className="ml-auto transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(30deg)' : 'rotate(0deg)' }}>
              {isExpanded ? (
                <FaChevronDown className="text-white transition-transform" size={12} />
              ) : (
                <FaChevronRight className="text-white transition-transform" size={12} />
              )}
            </span>
          </div>
          {isExpanded && (
            <div className="ml-4">
              {renderMenuItems(section.items[0].routes)}
            </div>
          )}
        </div>
      );
    });
  };

  const getIconBySector = (sectorName) => {
    switch (sectorName) {
      case 'Usuarios': return FaUser;
      case 'Productos': return FaBoxOpen;
      case 'Inventario': return FaClipboardList;
      case 'Nivel de Inventario': return FaClipboardList;
      case 'Roles': return FaUser;
      case 'Control de Calidad': return FaClipboardList;
      case 'Trazabilidad': return FaRoute;
      case 'Lotes': return FaBoxOpen;
      case 'Categorías': return FaBoxOpen;
      case 'Permisos': return FaUser;
      default: return null;
    }
  };

  return (
    <>
      {/* Overlay for small screens */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <aside
        className={`bg-gradient-to-b from-gray-900 to-gray-800 text-white w-64 py-7 px-2 fixed md:relative inset-y-0 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition duration-300 ease-in-out z-50 shadow-xl overflow-y-auto md:overflow-y-visible flex flex-col justify-between`}
      >
        {/* Mostrar hamburguesa solo cuando la sidebar no está abierta */}
        {!sidebarOpen && (
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white focus:outline-none mb-4 md:hidden">
            <FaBars />
          </button>
        )}

        {/* Título de la Sidebar */}
        <div className="text-center text-3xl font-bold mb-6 mt-0 text-white uppercase tracking-widest">Dashboard</div>

        <div className="flex-1 flex flex-col">
          {renderSections()}
        </div>

        {/* Botón de cerrar sesión al fondo */}
        <div className="mt-auto mb-2">
          <button
            onClick={handleLogout}
            className="flex items-center py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white text-lg rounded-lg shadow-md transition duration-300 transform hover:scale-105 w-full"
          >
            <FaSignOutAlt className="mr-3" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
