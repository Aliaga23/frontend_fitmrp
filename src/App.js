import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Usuarios from './components/UsuariosForm';
import AuthPage from "./components/AuthFormSwitcher";
import Categorias from './components/CategoriasForm';
import Productos from './components/ProductosForm';
import Roles from './components/RolesForm';
import RolPermiso from './components/RolPermiso';
import Movimientos from './components/Movimientos';
import ControlCalidad from './components/ControlCalidad';
import Lote from './components/Lote';
import ControlNivelesInventario from './components/ControlNivelesInventario';
const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/usuario" element={<Usuarios />} />
          <Route path="/categoria" element={<Categorias />} />
          <Route path="/producto" element={<Productos />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/permisos" element={<RolPermiso />} />
          <Route path="/trazabilidad" element={<Movimientos />} />
          <Route path="/calidad" element={<ControlCalidad />} />
          <Route path="/lote" element={<Lote />} />
          <Route path="/inventario" element={<ControlNivelesInventario />} />
        
        </Routes>
      </div>
    </Router>
  );
};

export default App;
