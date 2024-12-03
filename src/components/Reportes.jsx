import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  createTheme,
  ThemeProvider,
  Button,
  TextField,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import MUIDataTable from 'mui-datatables';
import { Chart } from 'react-chartjs-2';
import axios from '../api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { FaBars } from 'react-icons/fa';
import Sidebar from './SideBar'; 
import 'chart.js/auto';

const Reportes = () => {
  const [reporteSeleccionado, setReporteSeleccionado] = useState('');
  const [registros, setRegistros] = useState([]);
  const [filteredRegistros, setFilteredRegistros] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [columns, setColumns] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Estado para la sidebar

  const reportes = [
    { value: 'valor-inventario-productos', label: 'Valor del Inventario por Productos' },
    { value: 'inventario-materias-primas', label: 'Inventario de Materias Primas' },
    { value: 'movimientos-productos', label: 'Movimientos de Productos' },
    { value: 'ordenes-compra', label: 'Órdenes de Compra' },
  ];

  const fetchReporte = useCallback(async (reporte) => {
    try {
      const response = await axios.get(`/reportes/${reporte}`);
      const formattedData = response.data.map((item) => ({
        ...item,
        fecha: item.fecha ? format(new Date(item.fecha), 'dd/MM/yyyy HH:mm:ss') : null,
        fecha_hora_movimiento: item.fecha_hora_movimiento
          ? format(new Date(item.fecha_hora_movimiento), 'dd/MM/yyyy HH:mm:ss')
          : null,
        fecha_vencimiento_lote: item.fecha_vencimiento_lote
          ? format(new Date(item.fecha_vencimiento_lote), 'dd/MM/yyyy')
          : null,
      }));
      setRegistros(formattedData);
      setFilteredRegistros(formattedData);
      configurarColumnas(reporte);
      generarGrafico(reporte, formattedData);
    } catch (error) {
      console.error(`Error al obtener el reporte ${reporte}:`, error);
    }
  }, []);

  const filterRecordsByDate = useCallback(() => {
    if (startDate && endDate) {
      const filtered = registros.filter((record) => {
        const recordDate = new Date(record.fecha || record.fecha_hora_movimiento);
        return recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
      });
      setFilteredRegistros(filtered);
    } else {
      setFilteredRegistros(registros);
    }
  }, [startDate, endDate, registros]);

  useEffect(() => {
    if (reporteSeleccionado) {
      fetchReporte(reporteSeleccionado);
    }
  }, [reporteSeleccionado, fetchReporte]);

  useEffect(() => {
    filterRecordsByDate();
  }, [startDate, endDate, filterRecordsByDate]);

  const configurarColumnas = (reporte) => {
    let cols = [];
    switch (reporte) {
      case 'valor-inventario-productos':
        cols = [
          { name: 'producto_id', label: 'ID Producto' },
          { name: 'producto_nombre', label: 'Nombre Producto' },
          { name: 'categoria_nombre', label: 'Categoría' },
          { name: 'precio_unitario', label: 'Precio Unitario' },
          { name: 'cantidad_en_inventario', label: 'Cantidad Disponible' },
          { name: 'valor_total_inventario', label: 'Valor Total Inventario' },
        ];
        break;
      case 'inventario-materias-primas':
        cols = [
          { name: 'materia_prima_id', label: 'ID Materia Prima' },
          { name: 'materia_prima_nombre', label: 'Nombre Materia Prima' },
          { name: 'descripcion', label: 'Descripción' },
          { name: 'cantidad_en_inventario', label: 'Cantidad Disponible' },
        ];
        break;
      case 'movimientos-productos':
        cols = [
          { name: 'movimiento_id', label: 'ID Movimiento' },
          { name: 'producto_id', label: 'ID Producto' },
          { name: 'producto_nombre', label: 'Nombre Producto' },
          { name: 'categoria', label: 'Categoría' },
          { name: 'lote', label: 'Lote' },
          { name: 'fecha_vencimiento_lote', label: 'Fecha Vencimiento' },
          { name: 'tipo_de_movimiento', label: 'Tipo Movimiento' },
          { name: 'cantidad_movida', label: 'Cantidad Movida' },
          { name: 'fecha_hora_movimiento', label: 'Fecha Movimiento' },
          { name: 'comentarios', label: 'Comentarios' },
        ];
        break;
      case 'ordenes-compra':
        cols = [
          { name: 'orden_compra_id', label: 'ID Orden' },
          { name: 'fecha_orden', label: 'Fecha Orden' },
          { name: 'estado_orden', label: 'Estado' },
          { name: 'tipo_de_orden', label: 'Tipo Orden' },
          { name: 'proveedor_nombre', label: 'Proveedor' },
          { name: 'evaluacion_proveedor', label: 'Evaluación' },
          { name: 'fecha_evaluacion', label: 'Fecha Evaluación' },
          { name: 'usuario_nombre', label: 'Usuario' },
          { name: 'item_nombre', label: 'Item' },
          { name: 'cantidad', label: 'Cantidad' },
        ];
        break;
      default:
        cols = [];
    }
    setColumns(cols);
  };
  const generarGrafico = (reporte, data) => {
    let chartConfig = null;
    switch (reporte) {
      case 'valor-inventario-productos':
        chartConfig = {
          labels: data.map((item) => item.producto_nombre),
          datasets: [
            {
              label: 'Valor Total Inventario',
              data: data.map((item) => item.valor_total_inventario),
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        };
        break;
      case 'movimientos-productos':
        chartConfig = {
          labels: data.map((item) => item.fecha_hora_movimiento.split(' ')[0]),
          datasets: [
            {
              label: 'Cantidad Movida',
              data: data.map((item) => item.cantidad_movida),
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        };
        break;
      default:
        chartConfig = null;
    }
    setChartData(chartConfig);
  };
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRegistros);

    const wscols = columns.map(() => ({ wch: 20 }));
    ws['!cols'] = wscols;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    saveAs(data, `Reporte_${new Date().toISOString()}.xlsx`);
  };

  const theme = createTheme({
    palette: {
      primary: { main: '#2196f3' },
      secondary: { main: '#f44336' },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : ''}`}>
          <AppBar position="static" sx={{ mb: 4 }}>
            <Toolbar>
              <Button
                color="inherit"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                sx={{ mr: 2, display: { md: 'none' } }}
              >
                <FaBars />
              </Button>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Reportes
              </Typography>
            </Toolbar>
          </AppBar>
          <Container maxWidth="lg">
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <FormControl fullWidth sx={{ minWidth: 300 }}>
                  <InputLabel>Seleccione un Reporte</InputLabel>
                  <Select
                    value={reporteSeleccionado}
                    onChange={(e) => setReporteSeleccionado(e.target.value)}
                  >
                    {reportes.map((reporte) => (
                      <MenuItem key={reporte.value} value={reporte.value}>
                        {reporte.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Fecha de inicio"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  size="small"
                />
                <TextField
                  label="Fecha de fin"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  size="small"
                />
                <Button variant="contained" color="primary" onClick={exportToExcel}>
                  Exportar a Excel
                </Button>
              </Box>
            </Paper>
            {chartData && (
              <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Chart type="bar" data={chartData} />
              </Paper>
            )}
            <MUIDataTable
              title="Resultados del Reporte"
              data={filteredRegistros}
              columns={columns}
              options={{
                filterType: 'checkbox',
                responsive: 'standard',
                selectableRows: 'none',
              }}
            />
          </Container>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Reportes;
