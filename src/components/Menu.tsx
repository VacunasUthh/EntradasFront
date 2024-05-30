import React from 'react';
import './estilos/Menu.css';

interface Props {
    onMenuClick: (section: string) => void;
    onLogout: () => void; // Añadir esta línea
  }
  
  const Menu: React.FC<Props> = ({ onMenuClick, onLogout }) => {
    return (
      <nav className="menu">
        <ul>
          <li><button onClick={() => onMenuClick('welcome')}>Bienvenida</button></li>
          <li><button onClick={() => onMenuClick('schedule')}>Horarios</button></li>
          <li><button onClick={() => onMenuClick('schedule')}>Añadir alumnos</button></li>
          {/* Puedes añadir más elementos de menú aquí */}
          <li><button onClick={onLogout}>Cerrar sesión</button></li> {/* Añadir este botón */}
        </ul>
      </nav>
    );
  };
  
  export default Menu;