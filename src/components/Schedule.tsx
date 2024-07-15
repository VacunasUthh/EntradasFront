import React, { useState } from 'react';
import { Alert, Calendar } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import './estilos/Schedule.css';

interface Props {
  username: string;
}

const Schedule: React.FC<Props> = ({ username }) => {
  const [matricula, setMatricula] = useState('');
  const [errors, setErrors] = useState<{ matricula?: string }>({});
  const [entrada, setEntrada] = useState('08:00'); // Estado para la hora de entrada
  const [receso, setReceso] = useState('11:00'); // Estado para la hora de inicio del receso
  const [salida, setSalida] = useState('16:00'); // Estado para la hora de salida
  const [nombreAlumno, setNombreAlumno] = useState(''); // Estado para el nombre del alumno
  const [proyecto, setProyecto] = useState(''); // Estado para el proyecto
  const [faltas, setFaltas] = useState(''); // Estado para las faltas
  const [value, setValue] = useState(() => dayjs('2017-01-25'));
  const [selectedValue, setSelectedValue] = useState(() => dayjs('2017-01-25'));

  const handleMatriculaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMatricula(e.target.value);
  };

  const handleEntradaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEntrada(e.target.value);
  };

  const handleRecesoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReceso(e.target.value);
  };

  const handleSalidaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalida(e.target.value);
  };

  const handleNombreAlumnoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombreAlumno(e.target.value);
  };

  const handleProyectoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProyecto(e.target.value);
  };

  const handleFaltasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFaltas(e.target.value);
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
      console.log('Matrícula válida:', matricula);
    } else {
      console.log('Errores de validación:', errors);
    }
  };

  const onSelect = (newValue: Dayjs) => {
    setValue(newValue);
    setSelectedValue(newValue);
  };

  const onPanelChange = (newValue: Dayjs) => {
    setValue(newValue);
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
            <div className="hours-display">
              <p>Entrada: 8:00</p>
              <p>Receso : 11:00</p>
              <p>Salida: 14:00</p>
            </div>
          </div>
          <div className="info-center">
            <label htmlFor="nombre-alumno">Nombre del Alumno:</label>
            <input 
              type="text" 
              id="nombre-alumno" 
              value={nombreAlumno} 
              onChange={handleNombreAlumnoChange} 
            />
            <label htmlFor="matricula">Matrícula:</label>
            <input 
              type="text" 
              id="matricula" 
              value={matricula} 
              onChange={handleMatriculaChange} 
            />
            <label htmlFor="proyecto">Proyecto:</label>
            <input 
              type="text" 
              id="proyecto" 
              value={proyecto} 
              onChange={handleProyectoChange} 
            />
            <label htmlFor="faltas">Faltas:</label>
            <input 
              type="text" 
              id="faltas" 
              value={faltas} 
              onChange={handleFaltasChange} 
            />
          </div>
          <div className="info-right">
            <div className="data-inputs">
              <label htmlFor="entrada">Entrada:</label>
              <input 
                type="time" 
                id="entrada" 
                value={entrada} 
                onChange={handleEntradaChange} 
              />
              <label htmlFor="receso">Receso:</label>
              <input 
                type="time" 
                id="receso-inicio" 
                value={receso} 
                onChange={handleRecesoChange} 
              />
              <label htmlFor="salida">Salida:</label>
              <input 
                type="time" 
                id="salida" 
                value={salida} 
                onChange={handleSalidaChange} 
              />
            </div>
          </div>
        </div>
        <div className="calendar-section">
          <Alert message={`Fecha seleccionada: ${selectedValue?.format('YYYY-MM-DD')}`} />
          <div>
            <Calendar value={value} onSelect={onSelect} onPanelChange={onPanelChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
