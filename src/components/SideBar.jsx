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
      <Link key={item.path} to={item.path} className="flex items-center py-2 px-4 hover:bg-gray-700 hover:text-white">
        <span className="ml-2">{item.label}</span>
      </Link>
    ));
  };

  const renderSections = () => {
    return Object.keys(routesConfig).map((key) => {
      const section = routesConfig[key];
      const isExpanded = expandedSections[key];
      const Icon = getIconBySector(section.items[0].sector);
      const iconElement = Icon ? <Icon className="mr-3" /> : null;

      return (
        <div key={key} className="flex flex-col mb-2">
          <div
            className="flex items-center py-2 px-4 hover:bg-gray-700 hover:text-white cursor-pointer"
            onClick={() => toggleSection(key)}
          >
            {iconElement}
            <span>{section.items[0].sector}</span>
            <span className="ml-auto">
              {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
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
        className={`bg-gradient-to-b from-gray-800 to-gray-900 text-white w-64 space-y-6 py-7 px-2 fixed md:relative inset-y-0 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition duration-300 ease-in-out z-50`}
      >
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white focus:outline-none mb-4 md:hidden">
          <FaBars />
        </button>

        {/* Título de la Sidebar */}
        <div className="text-center text-2xl font-bold mb-6">Dashboard</div>

        <div className="flex flex-col">
          {renderSections()}
          <button
            onClick={handleLogout}
            className="flex items-center py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded mt-4"
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
