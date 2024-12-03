import React, { useEffect, useState, useCallback } from 'react';
import {
   createTheme, ThemeProvider, Button, TextField, Box, Typography, Paper
} from '@mui/material';
import MUIDataTable from 'mui-datatables';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import axios from '../api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Sidebar from './SideBar'; 
import { FaBars } from 'react-icons/fa';

// Registrar componentes de Chart.js
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Bitacora = () => {
  const [registros, setRegistros] = useState([]);
  const [filteredRegistros, setFilteredRegistros] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchRegistros = async () => {
      try {
        const response = await axios.get('/bitacora');
        setRegistros(response.data);
        setFilteredRegistros(response.data);
      } catch (error) {
        console.error('Error al obtener la bitácora:', error);
      }
    };

    fetchRegistros();
  }, []);

  const filterRecords = useCallback(() => {
    if (startDate && endDate) {
      const filtered = registros.filter((record) => {
        const recordDate = new Date(record.fecha);
        return recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
      });
      setFilteredRegistros(filtered);
    } else {
      setFilteredRegistros(registros);
    }
  }, [startDate, endDate, registros]);

  useEffect(() => {
    filterRecords();
  }, [filterRecords]);

  const handleResetFilter = () => {
    setStartDate('');
    setEndDate('');
    setFilteredRegistros(registros);
  };

  const columns = [
    { name: 'id', label: 'ID' },
    { name: 'usuario', label: 'Usuario' },
    { name: 'ip', label: 'IP' },
    { name: 'accion', label: 'Acción' },
    {
      name: 'fecha',
      label: 'Fecha',
      options: {
        customBodyRender: (value) => new Date(value).toLocaleString(),
      },
    },
  ];

  const options = {
    filterType: 'checkbox',
    responsive: 'standard',
    rowsPerPage: 20,
    rowsPerPageOptions: [20, 40, 60],
    selectableRows: 'none',
    textLabels: {
      body: {
        noMatch: "No se encontraron registros coincidentes",
      },
    },
  };

  const getMuiTheme = () => createTheme({
    palette: {
      primary: {
        main: '#4caf50',
      },
      secondary: {
        main: '#f44336',
      },
    },
  });

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRegistros);

    const wscols = [
      { wch: 5 }, // ID
      { wch: 20 }, // Usuario
      { wch: 15 }, // IP
      { wch: 30 }, // Acción
      { wch: 25 }, // Fecha
    ];
    ws['!cols'] = wscols;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bitacora");

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    saveAs(data, `Bitacora_${new Date().toISOString()}.xlsx`);
  };

  // Preparar datos para el gráfico
  const accionesPorUsuario = filteredRegistros.reduce((acc, registro) => {
    acc[registro.usuario] = (acc[registro.usuario] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(accionesPorUsuario),
    datasets: [
      {
        label: 'Acciones por Usuario',
        data: Object.values(accionesPorUsuario),
        backgroundColor: '#4caf50',
        borderColor: '#388e3c',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `Acciones: ${context.raw}`,
        },
      },
    },
  };

  return (
    <ThemeProvider theme={getMuiTheme()}>
      <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
        {/* Overlay en pantallas pequeñas */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : ''}`}>
          <header className="flex justify-between items-center bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 shadow-md">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white focus:outline-none md:hidden"
            >
              <FaBars />
            </button>
            <Typography variant="h6" className="flex-grow text-center">
              Bitácora de Acciones
            </Typography>
          </header>
          <main className="flex-1 p-6">
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                <TextField
                  label="Fecha de inicio"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  variant="outlined"
                  size="small"
                />
                <TextField
                  label="Fecha de fin"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  variant="outlined"
                  size="small"
                />
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleResetFilter}
                >
                  Restablecer Filtro
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={exportToExcel}
                >
                  Exportar a Excel
                </Button>
              </Box>
            </Paper>
            <MUIDataTable
              title="Registro de acciones"
              data={filteredRegistros}
              columns={columns}
              options={options}
            />
            <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Acciones por Usuario
              </Typography>
              <Bar data={chartData} options={chartOptions} />
            </Paper>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Bitacora;
