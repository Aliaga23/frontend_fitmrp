import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Usuarios from './components/UsuariosForm';
import AuthPage from './components/AuthFormSwitcher';
import Categorias from './components/CategoriasForm';
import Productos from './components/ProductosForm';
import Roles from './components/RolesForm';
import RolPermiso from './components/RolPermiso';
import Movimientos from './components/Movimientos';
import ControlCalidad from './components/ControlCalidad';
import ControlCalidadMateriaPrima from './components/ControlCalidadMateriaPrima'; 
import Lote from './components/Lote';
import ControlNivelesInventario from './components/ControlNivelesInventario';
import MateriaPrima from './components/MateriaPrima';
import InventarioMateriaPrima from './components/InventarioMateriaPrima';
import Proveedores from './components/Proveedores'; 
import OrdenesCompra from './components/OrdenesCompra'; 
import OrdenesCompraMateriaPrima from './components/OrdenesCompraMateriaPrima'; 
import OrdenCompraProducto from './components/OrdenCompraProductos'; // Importar OrdenCompraProducto
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MovimientosMateriaPrima from './components/MovimientosMateriaPrima';
import EvaluacionProveedor from './components/EvaluacionProveedores'; 
import LandingPage from './components/LandingPage';
import ProductCatalog from './components/ProductCatalog';
import FileUploadSimple from './components/FileUpload';
import Cart from './components/Cart';
import AdminOrders from './components/AdminOrders';
import SuccessPage from './components/SuccessPage';
import Devoluciones from './components/Devolucion';

import PaymentMethods from './components/MetodoPago';
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta pública */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/catalogo" element={<ProductCatalog />} />
          <Route path="/success" element={<SuccessPage />} />

          <Route path="/login" element={<AuthPage />} />
          <Route path="/archivos" element={<FileUploadSimple />} />

          {/* Rutas protegidas */}
          <Route path="/usuario" element={<ProtectedRoute element={<Usuarios />} />} />
          <Route path="/categoria" element={<ProtectedRoute element={<Categorias />} />} />
          <Route path="/producto" element={<ProtectedRoute element={<Productos />} />} />
          <Route path="/roles" element={<ProtectedRoute element={<Roles />} />} />
          <Route path="/permisos" element={<ProtectedRoute element={<RolPermiso />} />} />
          <Route path="/trazabilidad" element={<ProtectedRoute element={<Movimientos />} />} />
          <Route path="/calidad" element={<ProtectedRoute element={<ControlCalidad />} />} />
          <Route path="/calidad-materia-prima" element={<ProtectedRoute element={<ControlCalidadMateriaPrima />} />} />
          <Route path="/lote" element={<ProtectedRoute element={<Lote />} />} />
          <Route path="/inventario" element={<ProtectedRoute element={<ControlNivelesInventario />} />} />
          <Route path="/materia-prima" element={<ProtectedRoute element={<MateriaPrima />} />} />
          <Route path="/inventario-materiaprima" element={<ProtectedRoute element={<InventarioMateriaPrima />} />} />
          <Route path="/proveedores" element={<ProtectedRoute element={<Proveedores />} />} />
          <Route path="/movimientos-materiaprima" element={<ProtectedRoute element={<MovimientosMateriaPrima />} />} />
          <Route path="/evaluacion-proveedores" element={<ProtectedRoute element={<EvaluacionProveedor />} />} />
          <Route path="/ordenes-compra" element={<ProtectedRoute element={<OrdenesCompra />} />} />
          <Route path="/ordenes-compra-materia-prima" element={<ProtectedRoute element={<OrdenesCompraMateriaPrima />} />} />
          <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
          <Route path="/orders" element={<ProtectedRoute element={<AdminOrders />} />} />
          <Route path="/devolucion" element={<ProtectedRoute element={<Devoluciones />} />} />
          <Route path="/metodopago" element={<ProtectedRoute element={<PaymentMethods />} />} />

          {/* Añadir la ruta para OrdenCompraProducto */}
          <Route path="/ordenes-compra-producto" element={<ProtectedRoute element={<OrdenCompraProducto />} />} />

         
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
