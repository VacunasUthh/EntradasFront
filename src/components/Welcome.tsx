import React, { useEffect, useState } from 'react';
import './estilos/Welcome.css'; // Importar el archivo CSS existente
import colors from '../colors';  // Importar el archivo de colores
import axios from 'axios';

interface Props {
  username: string;
}

interface DocenteData {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  
}

const Welcome: React.FC<Props> = ({ username }) => {

  const [docenteData, setDocenteData] = useState<DocenteData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDocenteData = async () => {
      try {
        const url = `https://entradas-backend.vercel.app/docentes/mat?matricula=${username}`;
        const response = await axios.get<DocenteData>(url);

        if (response.data) {
          setDocenteData(response.data);
        } else {
          setError('No se encontraron datos del docente');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Error al obtener los datos del docente');
      }
    };

    fetchDocenteData();
  }, [username]);

  if (error) {
    return (
      <div className="welcome-container">
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  if (!docenteData) {
    return (
      <div className="welcome-container">
        <p>Cargando...</p>
      </div>
    );
  }

  const fullName = `${docenteData.nombre} ${docenteData.apellido_paterno} ${docenteData.apellido_materno}`;

  return (
    <div className="welcome-container">
      <img src="/imagenes/imgLogin.png" alt="Welcome" className="welcome-image" />
      <h2 style={{ color: colors.text }}>Bienvenido, {fullName}!</h2>
      <p style={{ color: colors.text }}>Estamos contentos de verte de nuevo. ¡Disfruta de tu tiempo en nuestra plataforma!</p>
      {/* Puedes agregar más contenido aquí, como estadísticas, accesos directos, etc. */}
    </div>
  );
};

export default Welcome;
