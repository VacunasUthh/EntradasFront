import React, { useState, useEffect } from 'react';
import { Alert, Calendar, message } from 'antd';
import axios from 'axios';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import './estilos/Schedule.css';

interface Props {
  username: string;
}

const Schedule: React.FC<Props> = ({ username }) => {
  const [matricula, setMatricula] = useState('');
  const [errors, setErrors] = useState<{ matricula?: string }>({});
  const [entrada, setEntrada] = useState('Seleccione un alumno');
  const [receso, setReceso] = useState('Seleccione un alumno');
  const [salida, setSalida] = useState('Seleccione un alumno');
  const [nombreAlumno, setNombreAlumno] = useState('');
  const [proyecto, setProyecto] = useState('');
  const [faltas, setFaltas] = useState('');
  const [value, setValue] = useState(() => dayjs());
  const [selectedValue, setSelectedValue] = useState(() => dayjs());
  const [entradaR, setEntradaR] = useState('');
  const [recesoR, setRecesoR] = useState('');
  const [salidaR, setSalidaR] = useState('');

  useEffect(() => {
    async function fetchData() {
      if (matricula && selectedValue) {
        try {
          // Obtener el horario y proyecto del alumno
          const response = await axios.get(`https://entradas-backend.vercel.app/docentes/mat?matricula=${username}`);
          const alumno = response.data.alumnos.find((alumno: any) => alumno.matricula === matricula);
          
          if (alumno) {
            setProyecto(alumno.proyecto || 'Sin asignar');
            setEntrada(alumno.horario.entrada || 'Sin asignar');
            setReceso(alumno.horario.receso.toString() || 'Sin asignar'); // Convert receso to string
            setSalida(alumno.horario.salida || 'Sin asignar');
            
            // Obtener el nombre completo del alumno
            const alumnoInfoResponse = await axios.get(`https://entradas-backend.vercel.app/alumnos/${matricula}`);
            const alumnoInfo = alumnoInfoResponse.data;
            const nombreCompleto = `${alumnoInfo.nombre} ${alumnoInfo.apellido_paterno} ${alumnoInfo.apellido_materno}`;
            setNombreAlumno(nombreCompleto);
            
            // Obtener los registros de asistencia del alumno para la fecha seleccionada
            const registrosResponse = await axios.get(`https://entradas-backend.vercel.app/registros/buscarRegistros?matricula=${matricula}&fecha=${selectedValue.format('YYYY-MM-DD')}`);
            const registros = registrosResponse.data;
            
            // Resetear los valores de registros de asistencia
            let entradaRegistro = 'Sin asignar';
            let recesoRegistro = 'Sin asignar';
            let salidaRegistro = 'Sin asignar';
            
            // Asignar los valores de registros de asistencia correspondientes
            registros.forEach((registro: any) => {
              if (registro.evento === 'Entrada') {
                entradaRegistro = registro.hora;
              } else if (registro.evento === 'Receso') {
                recesoRegistro = registro.hora;
              } else if (registro.evento === 'Salida') {
                salidaRegistro = registro.hora;
              }
            });
            
            // Actualizar los estados con los registros de asistencia
            setEntradaR(entradaRegistro);
            setRecesoR(recesoRegistro);
            setSalidaR(salidaRegistro);
            
          } else {
            setNombreAlumno('');
            setProyecto('');
            setEntrada('');
            setReceso('');
            setSalida('');
            message.warning('No se encontró ningún alumno con esa matrícula.');
          }
        } catch (error) {
          console.error('Error fetching alumno:', error);
          message.error('Error al buscar el alumno');
        }
      }
    }
    
    fetchData();
  }, [matricula, selectedValue, username]);

  const handleMatriculaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMatricula(e.target.value);
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

  const handleEntradaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEntradaR(e.target.value);
  };

  const handleRecesoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecesoR(e.target.value);
  };

  const handleSalidaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalidaR(e.target.value);
  };

  const validateMatricula = () => {
    const newErrors: { matricula?: string } = {};
    if (!/^\d{8}$/.test(matricula)) {
      newErrors.matricula = 'La matrícula debe ser exactamente 8 dígitos.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearchClick = async () => {
    if (validateMatricula()) {
      try {
        // Realizar búsqueda del alumno y registros de asistencia
        // (se maneja en useEffect para separar lógica)
      } catch (error) {
        console.error('Error en la búsqueda:', error);
        message.error('Error al buscar el alumno');
      }
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
              <p>Entrada: {entrada}</p>
              <p>Receso: {receso}</p>
              <p>Salida: {salida}</p>
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
              <label htmlFor="entrada">Registro de la entrada:</label>
              <input 
                type="time" 
                id="entradaR" 
                value={entradaR} 
                onChange={handleEntradaChange} 
              />
              <label htmlFor="recesoR">Registro del receso:</label>
              <input 
                type="time" 
                id="recesoR" 
                value={recesoR} 
                onChange={handleRecesoChange} 
              />
              <label htmlFor="salidaR">Registro de la salida:</label>
              <input 
                type="time" 
                id="salidaR" 
                value={salidaR} 
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
