const routesConfig = {
  usuarios: {
    items: [
      {
        sector: 'Usuarios',
        routes: [
          { path: '/usuario', label: 'Gestionar Usuarios', permiso: 'ver_usuarios' },
          { path: '/roles', label: 'Gestión de Roles', permiso: 'ver_roles' },
          { path: '/permisos', label: 'Gestión de Permisos', permiso: 'ver_permisos' },
        ],
      },
    ],
  },
  productos: {
    items: [
      {
        sector: 'Productos',
        routes: [
          { path: '/producto', label: 'Lista de Productos', permiso: 'ver_productos' },
          { path: '/categoria', label: 'Gestión de Categorías', permiso: 'ver_categorias' },
          { path: '/trazabilidad', label: 'Trazabilidad de Productos', permiso: 'ver_trazabilidad' },
        ],
      },
    ],
  },
  inventario: {
    items: [
      {
        sector: 'Inventario',
        routes: [
          { path: '/inventario', label: 'Control de Inventario', permiso: 'ver_inventario' },
          { path: '/inventario-materiaprima', label: 'Inventario de Materia Prima', permiso: 'ver_inventario_materiaprima' },
        ],
      },
    ],
  },
  controlCalidad: {
    items: [
      {
        sector: 'Control de Calidad',
        routes: [
          { path: '/calidad', label: 'Control de Calidad', permiso: 'ver_control_calidad' },
          { path: '/calidad-materia-prima', label: 'Control de Calidad de Materia Prima', permiso: 'ver_control_calidad_materia_prima' }, // Nueva ruta añadida
        ],
      },
    ],
  },
  lotes: {
    items: [
      {
        sector: 'Lotes',
        routes: [
          { path: '/lote', label: 'Gestión de Lotes', permiso: 'ver_lotes' },
        ],
      },
    ],
  },
  materiaPrima: {
    items: [
      {
        sector: 'Materia Prima',
        routes: [
          { path: '/materia-prima', label: 'Gestión de Materia Prima', permiso: 'ver_materia_prima' },
          { path: '/movimientos-materiaprima', label: 'Movimientos de Materia Prima', permiso: 'ver_movimientos_materiaprima' },
        ],
      },
    ],
  },
  proveedores: {
    items: [
      {
        sector: 'Proveedores',
        routes: [
          { path: '/proveedores', label: 'Gestión de Proveedores', permiso: 'ver_proveedores' },
          { path: '/evaluacion-proveedores', label: 'Evaluación de Proveedores', permiso: 'ver_evaluacion_proveedores' },
        ],
      },
    ],
  },
  compra: {
    items: [
      {
        sector: 'Compra',
        routes: [
          { path: '/ordenes-compra', label: 'Órdenes de Compra', permiso: 'ver_ordenes_compra' },
          { path: '/ordenes-compra-materia-prima', label: 'Órdenes de Compra de Materia Prima', permiso: 'ver_ordenes_compra_materia_prima' },
          { path: '/ordenes-compra-producto', label: 'Órdenes de Compra de Productos', permiso: 'ver_ordenes_compra_producto' }, 
          { path: '/devolucion', label: 'Devoluciones', permiso: 'ver_ordenes_compra_producto' }, // Nueva ruta añadida para OrdenCompraProducto
          { path: '/orders', label: 'Confirmar Pago', permiso: 'ver_ordenes_compra_producto' }, // Nueva ruta añadida para OrdenCompraProducto
          { path: '/metodopago', label: 'Metodos de Pago', permiso: 'ver_ordenes_compra_producto' }, // Nueva ruta añadida para OrdenCompraProducto

          // Nueva ruta añadida para OrdenCompraProducto
        ],
      },
    ],
  },
};

export default routesConfig;
