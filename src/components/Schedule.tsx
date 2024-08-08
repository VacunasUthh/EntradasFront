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
  const [inicioRecesoR, setInicioRecesoR] = useState('');
  const [finRecesoR, setFinRecesoR] = useState('');
  const [salidaR, setSalidaR] = useState('');
  const [shouldFetch, setShouldFetch] = useState(false);
  const [colorEntrada, setColorEntrada] = useState('');
  const [colorReceso, setColorReceso] = useState('');
  const [colorSalida, setColorSalida] = useState('');
  const [showCalendar, setShowCalendar] = useState(true); // Estado para alternar la visibilidad
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]); // Registros de asistencia

  useEffect(() => {
    async function fetchData() {
      if (matricula && selectedValue && shouldFetch) {
        try {
          const response = await axios.get(`https://entradas-backend.vercel.app/docentes/mat?matricula=${username}`);
          const alumno = response.data.alumnos.find((alumno: any) => alumno.matricula === matricula);

          if (alumno) {
            setProyecto(alumno.proyecto || 'Sin asignar');
            setEntrada(alumno.horario.entrada || 'Sin asignar');
            setReceso(alumno.horario.receso || 'Sin asignar');
            setSalida(alumno.horario.salida || 'Sin asignar');

            const alumnoInfoResponse = await axios.get(`https://entradas-backend.vercel.app/alumnos/mat?matricula=${matricula}`);
            const alumnoInfo = alumnoInfoResponse.data;
            const nombreCompleto = `${alumnoInfo.nombre} ${alumnoInfo.apellido_paterno} ${alumnoInfo.apellido_materno}`;
            setNombreAlumno(nombreCompleto);

            const registrosResponse = await axios.get(`https://entradas-backend.vercel.app/registros/buscarRegistros?matricula=${matricula}&fecha=${selectedValue.format('YYYY-MM-DD')}`);
            const registros = registrosResponse.data;

            let entradaRegistro = 'Sin asignar';
            let inicioRecesoRegistro = 'Sin asignar';
            let finRecesoRegistro = 'Sin asignar';
            let salidaRegistro = 'Sin asignar';

            registros.forEach((registro: any) => {
              if (registro.evento === 'Entrada') {
                entradaRegistro = registro.hora;
              } else if (registro.evento === 'Inicio del receso') {
                inicioRecesoRegistro = registro.hora;
              } else if (registro.evento === 'Fin del receso') {
                finRecesoRegistro = registro.hora;
              } else if (registro.evento === 'Salida') {
                salidaRegistro = registro.hora;
              }
            });

            setEntradaR(entradaRegistro);
            setInicioRecesoR(inicioRecesoRegistro);
            setFinRecesoR(finRecesoRegistro);
            setSalidaR(salidaRegistro);

            setColorEntrada(compararHoras(alumno.horario.entrada, entradaRegistro));
            setColorReceso(compararHoras(alumno.horario.receso, inicioRecesoRegistro));
            setColorSalida(compararHoras(alumno.horario.salida, salidaRegistro));
            
            // Establece los registros de asistencia para la tabla
            setAttendanceRecords(registros);
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
        } finally {
          setShouldFetch(false);
        }
      }
    }

    fetchData();
  }, [matricula, selectedValue, shouldFetch, username]);

  const compararHoras = (horaAsignada: string, horaRegistrada: string) => {
    if (!horaRegistrada || horaRegistrada === 'Sin asignar') return 'red';

    const horaAsig = dayjs(horaAsignada, 'HH:mm');
    const horaReg = dayjs(horaRegistrada, 'HH:mm');

    if (horaReg.isBefore(horaAsig)) return '#2ac528';
    if (horaReg.isSame(horaAsig)) return 'yellow';

    return 'red';
  };

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
    setInicioRecesoR(e.target.value);
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
      setShouldFetch(true);
    } else {
      console.log('Errores de validación:', errors);
    }
  };

  const onSelect = (newValue: Dayjs) => {
    setValue(newValue);
    setSelectedValue(newValue);
    if (matricula) {
      setShouldFetch(true);
    }
  };

  const onPanelChange = (newValue: Dayjs) => {
    setValue(newValue);
  };

  // Genera todos los días del mes seleccionado
  const getDaysInMonth = (month: Dayjs) => {
    const startOfMonth = month.startOf('month');
    const endOfMonth = month.endOf('month');
    const days = [];

    for (let date = startOfMonth; date.isBefore(endOfMonth.add(1, 'day')); date = date.add(1, 'day')) {
      days.push(date);
    }

    return days;
  };

  const allDaysOfMonth = getDaysInMonth(selectedValue);

  const getRecordForDay = (day: Dayjs, tipo: string) => {
    const record = attendanceRecords.find(
      (rec) => dayjs(rec.fecha).isSame(day, 'day') && rec.tipo === tipo
    );
    return record ? record.hora : 'No registrado';
  };

  const renderAttendance = (record: string) => {
    return record === 'No registrado' ? '❌' : '✔️';
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
          <div className="info-left" style={{ backgroundColor: colorEntrada }}>
            <div className="hours-display">
              <p>Entrada: {entrada}</p>
              <p>Receso: {receso}</p>
              <p>Salida: {salida}</p>
            </div>
          </div>
          <div className="info-center">
            <label htmlFor="nombre">Nombre:</label>
            <input 
              type="text" 
              id="nombre" 
              value={nombreAlumno} 
              onChange={handleNombreAlumnoChange}
              readOnly 
            />
            <label htmlFor="matricula">Matrícula:</label>
            <input 
              type="text" 
              id="matricula" 
              value={matricula} 
              onChange={handleMatriculaChange} 
              readOnly 
            />
            <label htmlFor="proyecto">Proyecto:</label>
            <input 
              type="text" 
              id="proyecto" 
              value={proyecto} 
              onChange={handleProyectoChange}
              readOnly  
            />
            <label htmlFor="faltas">Faltas:</label>
            <input
              type="text" 
              id="faltas" 
              value={faltas} 
              onChange={handleFaltasChange} 
              readOnly 
            />
          </div>
          <div className="info-right" style={{ backgroundColor: colorEntrada }}>
            <div className="data-inputs">
              <label htmlFor="entrada">Registro de la entrada:</label>
              <input 
                type="time" 
                id="entradaR" 
                value={entradaR} 
                onChange={handleEntradaChange} 
                readOnly 
              />
              <label htmlFor="receso">Registro de inicio del receso:</label>
              <input 
                type="time" 
                id="recesoR" 
                value={inicioRecesoR} 
                onChange={handleRecesoChange} 
                readOnly 
              />
              <label htmlFor="receso">Registro de fin del receso:</label>
              <input 
                type="time" 
                id="recesoR" 
                value={finRecesoR} 
                onChange={handleRecesoChange} 
                readOnly 
              />
              <label htmlFor="salida">Registro de salida:</label>
              <input 
                type="time" 
                id="salidaR" 
                value={salidaR} 
                onChange={handleSalidaChange} 
                readOnly 
              />
            </div>
          </div>
        </div>
        <div className="calendar-section">
          <Alert message={`Fecha seleccionada: ${selectedValue?.format('YYYY-MM-DD')}`} />
          <button className="toggle-view-button" onClick={() => setShowCalendar(!showCalendar)}>
            {showCalendar ? 'Mostrar Tabla' : 'Mostrar Calendario'}
          </button>
          {showCalendar ? (
            <Calendar value={value} onSelect={onSelect} onPanelChange={onPanelChange} />
          ) : (
            <div className="attendance-table-section">
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Entrada</th>
                    <th>Receso</th>
                    <th>Salida</th>
                    <th>Asistencia</th>
                  </tr>
                </thead>
                <tbody>
                  {allDaysOfMonth.map(day => (
                    <tr key={day.format('YYYY-MM-DD')}>
                      <td>{day.format('YYYY-MM-DD')}</td>
                      <td>{getRecordForDay(day, 'Entrada')}</td>
                      <td>{getRecordForDay(day, 'Inicio del receso')}</td>
                      <td>{getRecordForDay(day, 'Salida')}</td>
                      <td>{renderAttendance(getRecordForDay(day, 'Entrada'))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
