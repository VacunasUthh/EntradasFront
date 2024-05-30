import React from 'react';
import './estilos/Welcome.css';

interface Props {
  username: string;
}

const Welcome: React.FC<Props> = ({ username }) => {
  return (
    <div className="welcome-container">
      <img src="/imagenes/imgLogin.png" alt="Welcome" className="welcome-image" />
      <h2>Bienvenido, {username}!</h2>
      <p>Estamos contentos de verte de nuevo. ¡Disfruta de tu tiempo en nuestra plataforma!</p>
      {/* Puedes agregar más contenido aquí, como estadísticas, accesos directos, etc. */}
    </div>
  );
};

export default Welcome;