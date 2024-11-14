import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../api';

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Definir `verifyPayment` dentro de `useEffect`
    const verifyPayment = async (sessionId) => {
      try {
        const response = await axios.post('/pago/stripe/verify-payment', { sessionId });
        if (response.data.success) {
          alert('Pago verificado y confirmado.');
          navigate('/'); 
        } else {
          alert('No se pudo verificar el pago.');
          navigate('/cart'); 
        }
      } catch (error) {
        console.error('Error al verificar el pago:', error);
        alert('Hubo un error al verificar el pago.');
        navigate('/cart'); 
      }
    };

    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('session_id');

    if (sessionId) {
      verifyPayment(sessionId);
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">Verificando su pago...</h1>
    </div>
  );
};

export default SuccessPage;
