import React, { useState } from 'react';
import Calendar from 'react-calendar';
import './estilos/Schedule.css';
import 'react-calendar/dist/Calendar.css';
import './estilos/CustomCalendar.css'; 

const Schedule: React.FC = () => {
  const [matricula, setMatricula] = useState('');
  const [errors, setErrors] = useState<{ matricula?: string }>({});

  const handleMatriculaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMatricula(e.target.value);
  };

  const validateMatricula = () => {
    const newErrors: { matricula?: string } = {};
    if (!/^\d{8}$/.test(matricula)) {
      newErrors.matricula = 'La matrícula debe ser exactamente 8 dígitos.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearchClick = () => {
    if (validateMatricula()) {
      // Aquí puedes añadir la lógica de búsqueda de la matrícula
      console.log('Matrícula válida:', matricula);
    } else {
      console.log('Errores de validación:', errors);
    }
  };

  return (
    <div className="schedule-container">
      <div className="header">
        <input 
          type="text" 
          placeholder="Matricula del alumno" 
          value={matricula}
          onChange={handleMatriculaChange}
          className={errors.matricula ? 'input-error' : ''}
        />
        <button className="search-button" onClick={handleSearchClick}>🔍</button>
      </div>
      {errors.matricula && <p className="error-message">{errors.matricula}</p>}
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
