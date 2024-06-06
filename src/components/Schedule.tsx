import React from 'react';
import Calendar from 'react-calendar';
import './estilos/Schedule.css';
import 'react-calendar/dist/Calendar.css';
import './estilos/CustomCalendar.css'; 

const Schedule: React.FC = () => {
  return (
    <div className="schedule-container">
      <div className="header">
        <input type="text" placeholder="Buscar..." />
        <button>🔍</button>
      </div>
      <div className="main-content">
        <div className="info-section">
          <div className="info-left">
            <div className="data-inputs">
              <p>Entrada: 8:05</p>
              <p>Receso: 11:00-12:00</p>
              <p>Salida: 4:00</p>
            </div>
          </div>
          <div className="info-center">
            <h3>Nombre del Alumno</h3>
            <p>Matrícula: XXX</p>
            <p>Proyecto: XXX</p>
            <p>Faltas: XXX</p>
          </div>
          <div className="info-right">
            <div className="hours-display">
              <p>8:05</p>
              <p>11:00 - 12:00</p>
              <p>4:00</p>
            </div>
          </div>
        </div>
        <div className="calendar-section">
          <Calendar />
        </div>
      </div>
    </div>
  );
};

export default Schedule;
