import React from 'react';
import './estilos/Menu.css';

interface Props {
  onMenuClick: (section: string) => void;
  onLogout: () => void; 
}

const Menu: React.FC<Props> = ({ onMenuClick, onLogout }) => {
  return (
    <nav className="menu">
      <ul>
        <li><button onClick={() => onMenuClick('welcome')}>Bienvenida</button></li>
        <li><button onClick={() => onMenuClick('schedule')}>Horarios</button></li>
        <li><button onClick={() => onMenuClick('addStudents')}>Añadir alumnos</button></li>
        <li><button onClick={onLogout}>Cerrar sesión</button></li>
      </ul>
    </nav>
  );
};

export default Menu;
