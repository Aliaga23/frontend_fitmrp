import React, { useEffect, useState } from 'react';
import axios from '../api';
import { FaCheck, FaSpinner } from 'react-icons/fa';
import Sidebar from './SideBar';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmingPayment, setConfirmingPayment] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/admin/orders/pending');
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error('Error al obtener los pedidos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleConfirmPayment = async (orderId) => {
    setConfirmingPayment(orderId);
    try {
      await axios.post('/admin/orders/confirm-payment', { pedido_id: orderId });
      alert('Pago confirmado exitosamente');
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, estado: 'confirmado' } : order
        )
      );
    } catch (error) {
      console.error('Error al confirmar el pago:', error);
      alert('Hubo un problema al confirmar el pago');
    } finally {
      setConfirmingPayment(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <Sidebar />

      <div className="flex-1 p-6 md:p-8">
        <header className="flex justify-between items-center bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 shadow-md">
          <h1 className="text-3xl font-semibold">Administración de Pedidos</h1>
        </header>

        <main className="flex-1 p-6 md:p-8">
          {loading ? (
            <p className="text-center text-lg">Cargando pedidos...</p>
          ) : orders.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white p-6 rounded-lg shadow-lg">
                  <p className="text-lg font-semibold text-gray-700">Pedido ID: {order.id}</p>
                  <p className="text-gray-600">Usuario ID: {order.usuario_id}</p>
                  <p className="text-gray-600">Estado: {order.estado}</p>

                  <button
                    onClick={() => handleConfirmPayment(order.id)}
                    className={`mt-4 px-4 py-2 rounded-lg flex items-center justify-center transition duration-200 text-white ${
                      order.estado === 'confirmado'
                        ? 'bg-gray-400'
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                    disabled={order.estado === 'confirmado' || confirmingPayment === order.id}
                  >
                    {confirmingPayment === order.id ? (
                      <FaSpinner className="animate-spin mr-2" />
                    ) : (
                      <FaCheck className="mr-2" />
                    )}
                    {confirmingPayment === order.id
                      ? 'Confirmando...'
                      : order.estado === 'confirmado'
                      ? 'Pago Confirmado'
                      : 'Confirmar Pago'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">No hay pedidos pendientes de confirmación.</p>
          )}
        </main>

        <footer className="bg-white p-6 text-center text-gray-500 shadow-inner text-lg">
          &copy; {new Date().getFullYear()} Administración de Pedidos. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

export default AdminOrders;
