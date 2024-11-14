import React, { useEffect, useState, useContext, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from '../api';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { jsPDF } from 'jspdf';

const stripePromise = loadStripe('pk_test_51Q4zCvKfqJNLiR1E3BLMrYlJjlXvg8MpJrHW0zR85nESNCLgUY8dfSlxezSOtuEhtv5vsav302XtGxYYk6M3Zf7q00a08IdGQW');

const Cart = () => {
  const { user, updateCartCount } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [orders, setOrders] = useState([]); // Estado para el historial de pedidos


  
  // Envolver funciones con useCallback para evitar advertencias de dependencias
  const fetchCartItems = useCallback(async () => {
    try {
      const response = await axios.post('/carrito/get-or-create', { usuario_id: user.id });
      setCartItems(response.data.items || []);
      calculateTotal(response.data.items || []);
    } catch (error) {
      console.error('Error al obtener el carrito:', error);
    }
  }, [user]);

  const fetchPaymentMethods = useCallback(async () => {
    try {
      const response = await axios.get('/metodos-pago');
      setPaymentMethods(response.data);
    } catch (error) {
      console.error('Error al obtener los métodos de pago:', error);
    }
  }, []);

  const fetchOrderHistory = useCallback(async () => {
    try {
      const response = await axios.get(`/pedido/history/${user.id}`);
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error al obtener el historial de pedidos:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchCartItems();
    fetchPaymentMethods();
    fetchOrderHistory();
  }, [fetchCartItems, fetchPaymentMethods, fetchOrderHistory]);
  
  const calculateTotal = (items) => {
    const total = items.reduce((acc, item) => acc + (Number(item.precio_unitario) * item.cantidad), 0);
    setTotalPrice(total.toFixed(2));

    // Aplicar el descuento si el total es mayor a 1500
    if (total > 1500) {
      const discount = total * 0.1;
      setDiscountedPrice((total - discount).toFixed(2));
    } else {
      setDiscountedPrice(total.toFixed(2));
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await axios.put('/carrito/update-item', {
        usuario_id: user.id,
        producto_id: productId,
        cantidad: newQuantity,
      });
      fetchCartItems();
      updateCartCount();
    } catch (error) {
      console.error('Error al actualizar la cantidad:', error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await axios.delete('/carrito/remove-item', {
        data: { usuario_id: user.id, producto_id: productId },
      });
      fetchCartItems();
      updateCartCount();
    } catch (error) {
      console.error('Error al eliminar el producto del carrito:', error);
    }
  };

  const handleCheckout = () => {
    setShowPaymentGateway(true);
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert('Por favor, selecciona un método de pago.');
      return;
    }

    if (paymentMethod === '2') { // Si el método de pago es Stripe (id = 2)
      handleStripePayment();
    } else {
      try {
        const response = await axios.post('/carrito/checkout', { usuario_id: user.id, metodo_pago: paymentMethod });
        alert(response.data.message);
        setCartItems([]);
        setTotalPrice(0);
        updateCartCount();
        fetchOrderHistory();
      } catch (error) {
        console.error('Error en el proceso de pago:', error);
        alert('Hubo un problema al procesar el pago');
      }
    }
  };

  const handleStripePayment = async () => {
    const stripe = await stripePromise;
    try {
      const response = await axios.post('/pago/stripe/create-payment', { usuario_id: user.id });
      const sessionId = response.data.sessionId;

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) console.error('Error al redireccionar a Stripe:', error.message);
    } catch (error) {
      console.error('Error en el pago con Stripe:', error);
    }
  };

  const generateInvoice = (order) => {
    const doc = new jsPDF();
    doc.text(`Factura de Compra`, 20, 20);
    doc.text(`Usuario: ${user.nombre}`, 20, 30);
    doc.text(`Fecha: ${new Date(order.fecha).toLocaleDateString()}`, 20, 40);
    doc.text(`Productos Comprados:`, 20, 50);

    order.items.forEach((item, index) => {
      const position = 60 + index * 10;
      doc.text(`${item.nombre} - Cantidad: ${item.cantidad} - Precio: $${item.precio_unitario}`, 20, position);
    });

    doc.text(`Total: $${order.total}`, 20, 70 + order.items.length * 10);
    doc.save(`factura_${user.nombre}_${Date.now()}.pdf`);
    alert('Factura generada y descargada.');
  };

  const generateQuotation = () => {
    const doc = new jsPDF();
    doc.text(`Cotización de Compra`, 20, 20);
    doc.text(`Usuario: ${user.nombre}`, 20, 30);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 40);
    doc.text(`Productos Cotizados:`, 20, 50);

    cartItems.forEach((item, index) => {
      const position = 60 + index * 10;
      doc.text(`${item.nombre} - Cantidad: ${item.cantidad} - Precio Unitario: $${item.precio_unitario}`, 20, position);
    });

    doc.text(`Total antes de descuento: $${totalPrice}`, 20, 70 + cartItems.length * 10);
    if (totalPrice > 1500) {
      doc.text(`Descuento aplicado: 10%`, 20, 80 + cartItems.length * 10);
      doc.text(`Total con descuento: $${discountedPrice}`, 20, 90 + cartItems.length * 10);
    }

    doc.save(`cotizacion_${user.nombre}_${Date.now()}.pdf`);
    alert('Cotización generada y descargada.');
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#f0f0f0]">
      <Navbar />
      <div className="pt-24 p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-orange-500 mb-8">Carrito de Compras</h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-lg">Tu carrito está vacío.</p>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item.producto_id} className="p-4 bg-gray-800 rounded-lg shadow-md flex justify-between items-center">
                <div className="flex items-center space-x-6">
                  {item.imagen_url && (
                    <img src={item.imagen_url} alt={item.nombre} className="w-16 h-16 object-cover rounded-md" />
                  )}
                  <div>
                    <h2 className="text-xl font-semibold">{item.nombre}</h2>
                    <p className="text-orange-400">
                      ${Number(item.precio_unitario).toFixed(2)} x {item.cantidad}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button onClick={() => handleQuantityChange(item.producto_id, item.cantidad - 1)} className="text-orange-500 border border-orange-500 px-2 py-1 rounded-lg hover:bg-orange-500 hover:text-[#1a1a1a] transition-colors duration-300">
                    -
                  </button>
                  <span className="text-lg">{item.cantidad}</span>
                  <button onClick={() => handleQuantityChange(item.producto_id, item.cantidad + 1)} className="text-orange-500 border border-orange-500 px-2 py-1 rounded-lg hover:bg-orange-500 hover:text-[#1a1a1a] transition-colors duration-300">
                    +
                  </button>
                  <button onClick={() => handleRemoveItem(item.producto_id)} className="text-red-500 hover:text-red-700 transition-colors">
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-6 p-4 bg-gray-900 rounded-lg shadow-lg text-right">
              <h3 className="text-2xl font-semibold">Total: ${totalPrice}</h3>
              {totalPrice > 1500 && (
                <h3 className="text-xl font-semibold text-green-400">Descuento aplicado: Total con descuento: ${discountedPrice}</h3>
              )}
            </div>
            <button onClick={handleCheckout} className="w-full text-white bg-orange-500 hover:bg-orange-600 p-4 rounded-lg font-bold transition-colors duration-300">
              Pagar
            </button>
            <button onClick={generateQuotation} className="w-full mt-4 text-white bg-blue-500 hover:bg-blue-600 p-4 rounded-lg font-bold transition-colors duration-300">
              Generar Cotización
            </button>
          </div>
        )}

        {showPaymentGateway && (
          <div className="mt-10 p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Selecciona un método de pago</h2>
            <ul className="space-y-2 mb-6">
              {paymentMethods.map((method) => (
                <li key={method.id}>
                  <label className="flex items-center space-x-3">
                    <input type="radio" name="paymentMethod" value={method.id} onChange={(e) => setPaymentMethod(e.target.value)} className="form-radio text-orange-500" />
                    <span className="text-white">{method.nombre_metodo}</span>
                  </label>
                </li>
              ))}
            </ul>
            <button onClick={handlePayment} className="w-full text-white bg-green-500 hover:bg-green-600 p-4 rounded-lg font-bold transition-colors duration-300">
              Confirmar Pago
            </button>
          </div>
        )}

        {/* Historial de pedidos */}
        <div className="mt-12">
          <h2 className="text-3xl font-semibold mb-6">Historial de Pedidos</h2>
          {orders.length === 0 ? (
            <p className="text-center text-lg">No tienes pedidos en tu historial.</p>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="p-4 bg-gray-800 rounded-lg shadow-md">
                  <p>Pedido ID: {order.id}</p>
                  <p>Total: ${Number(order.total).toFixed(2)}</p>
                  <p>Fecha: {new Date(order.fecha).toLocaleDateString()}</p>
                  <p>Estado: {order.estado}</p>
                  {order.estado === 'confirmado' && (
                    <button onClick={() => generateInvoice(order)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                      Generar Factura
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
