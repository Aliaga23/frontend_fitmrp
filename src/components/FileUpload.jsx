import React, { useState } from 'react';
import axios from '../api'; // Configuración de Axios apuntando a tu backend

const FileUploadSimple = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false); // Estado para indicar la carga

  // Función para manejar el cambio de archivo
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage('Por favor, selecciona un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true); // Indicar que la subida está en proceso

    try {
      // Enviar el archivo al backend
      const response = await axios.post('/archivos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Guardar los datos del archivo subido (esto depende de la respuesta del backend)
      setUploadedFile(response.data.archivo); 
      setMessage('Archivo subido con éxito');
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      setMessage('Error al subir el archivo.');
    } finally {
      setLoading(false); // Finalizar la indicación de carga
    }
  };

  return (
    <div>
      <h2>Subir Archivo</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>
          {loading ? 'Subiendo...' : 'Subir'}
        </button>
      </form>

      {message && <p>{message}</p>}

      {uploadedFile && (
        <div>
          <h3>Detalles del archivo subido:</h3>
          <p><strong>Nombre:</strong> {uploadedFile.nombre_archivo}</p>
          <p><strong>Tipo:</strong> {uploadedFile.tipo_archivo}</p>
          <p><strong>Fecha subida:</strong> {new Date(uploadedFile.fecha_subida).toLocaleDateString()}</p>
          <p><strong>URL:</strong> <a href={uploadedFile.url_archivo} target="_blank" rel="noopener noreferrer">{uploadedFile.url_archivo}</a></p>
        </div>
      )}
    </div>
  );
};

export default FileUploadSimple;
