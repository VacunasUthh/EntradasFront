import React, { useState, useEffect } from "react";
import { Alert, Calendar, message } from "antd";
import axios from "axios";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "./estilos/Schedule.css";

interface Props {
  username: string;
}

interface Registro {
  _id: string;
  alumno_matricula: string;
  fecha: string;
  evento: "Entrada" | "Inicio del receso" | "Fin del receso" | "Salida";
  hora: string;
  ubicacion: {
    latitud: string;
    longitud: string;
    _id: string;
  };
}

const Schedule: React.FC<Props> = ({ username }) => {
  const [matricula, setMatricula] = useState("");
  const [errors, setErrors] = useState<{ matricula?: string }>({});
  const [entrada, setEntrada] = useState("Seleccione un alumno");
  const [receso, setReceso] = useState("Seleccione un alumno");
  const [salida, setSalida] = useState("Seleccione un alumno");
  const [nombreAlumno, setNombreAlumno] = useState("");
  const [proyecto, setProyecto] = useState("");
  const [value, setValue] = useState(() => dayjs());
  const [selectedValue, setSelectedValue] = useState(() => dayjs());
  const [entradaR, setEntradaR] = useState("");
  const [inicioRecesoR, setInicioRecesoR] = useState("");
  const [finRecesoR, setFinRecesoR] = useState("");
  const [salidaR, setSalidaR] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);
  const [colorEntrada, setColorEntrada] = useState("");
  const [colorReceso, setColorReceso] = useState("");
  const [colorSalida, setColorSalida] = useState("");
  const [showCalendar, setShowCalendar] = useState(true); // Estado para alternar la visibilidad
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]); // Registros de asistencia
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [records, setRecords] = useState<Registro[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (matricula && selectedValue && shouldFetch) {
        try {
          const response = await axios.get(
            `https://entradas-backend.vercel.app/docentes/mat?matricula=${username}`
          );
          const alumno = response.data.alumnos.find(
            (alumno: any) => alumno.matricula === matricula
          );

          if (alumno) {
            setProyecto(alumno.proyecto || "Sin asignar");
            setEntrada(alumno.horario.entrada || "Sin asignar");
            setReceso(alumno.horario.receso || "Sin asignar");
            setSalida(alumno.horario.salida || "Sin asignar");

            const alumnoInfoResponse = await axios.get(
              `https://entradas-backend.vercel.app/alumnos/mat?matricula=${matricula}`
            );
            const alumnoInfo = alumnoInfoResponse.data;
            const nombreCompleto = `${alumnoInfo.nombre} ${alumnoInfo.apellido_paterno} ${alumnoInfo.apellido_materno}`;
            setNombreAlumno(nombreCompleto);

            const registrosResponse = await axios.get(
              `https://entradas-backend.vercel.app/registros/buscarRegistros?matricula=${matricula}&fecha=${selectedValue.format(
                "YYYY-MM-DD"
              )}`
            );
            const registros = registrosResponse.data;

            let entradaRegistro = "Sin asignar";
            let inicioRecesoRegistro = "Sin asignar";
            let finRecesoRegistro = "Sin asignar";
            let salidaRegistro = "Sin asignar";

            registros.forEach((registro: any) => {
              if (registro.evento === "Entrada") {
                entradaRegistro = registro.hora;
              } else if (registro.evento === "Inicio del receso") {
                inicioRecesoRegistro = registro.hora;
              } else if (registro.evento === "Fin del receso") {
                finRecesoRegistro = registro.hora;
              } else if (registro.evento === "Salida") {
                salidaRegistro = registro.hora;
              }
            });

            setEntradaR(entradaRegistro);
            setInicioRecesoR(inicioRecesoRegistro);
            setFinRecesoR(finRecesoRegistro);
            setSalidaR(salidaRegistro);

            setColorEntrada(
              compararHoras(alumno.horario.entrada, entradaRegistro)
            );
            setColorReceso(
              compararHoras(alumno.horario.receso, inicioRecesoRegistro)
            );
            setColorSalida(
              compararHoras(alumno.horario.salida, salidaRegistro)
            );

            // Establece los registros de asistencia para la tabla
            setAttendanceRecords(registros);
          } else {
            setNombreAlumno("");
            setProyecto("");
            setEntrada("");
            setReceso("");
            setSalida("");
            message.warning("No se encontró ningún alumno con esa matrícula.");
          }
        } catch (error) {
          console.error("Error fetching alumno:", error);
          message.error("Error al buscar el alumno");
        } finally {
          setShouldFetch(false);
        }
      }
    }

    fetchData();
  }, [matricula, selectedValue, shouldFetch, username]);

  const compararHoras = (horaAsignada: string, horaRegistrada: string) => {
    if (!horaRegistrada || horaRegistrada === "Sin asignar") return "red";

    const horaAsig = dayjs(horaAsignada, "HH:mm");
    const horaReg = dayjs(horaRegistrada, "HH:mm");

    if (horaReg.isBefore(horaAsig)) return "#2ac528";
    if (horaReg.isSame(horaAsig)) return "yellow";

    return "red";
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
      newErrors.matricula = "La matrícula debe ser exactamente 8 dígitos.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearchClick = async () => {
    if (validateMatricula()) {
      setShouldFetch(true);
    } else {
      console.log("Errores de validación:", errors);
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

  const getDaysInMonth = (month: Dayjs) => {
    const startOfMonth = month.startOf("month");
    const endOfMonth = month.endOf("month");
    const days = [];

    for (
      let date = startOfMonth;
      date.isBefore(endOfMonth.add(1, "day"));
      date = date.add(1, "day")
    ) {
      if (date.day() !== 6 && date.day() !== 0) {
        days.push(date);
      }
    }

    return days;
  };

  const fetchRecords = async () => {
    try {
      const response = await fetch(
        `https://entradas-backend.vercel.app/registros/buscarRegistrosPorMes?matricula=${matricula}&mes=${selectedMonth}&anio=${selectedYear}`
      );
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  const getRecordForDay = (day: number, evento: string): string => {
    const dayString = `${selectedYear}-${String(selectedMonth).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    const record = records.find(
      (r) => r.fecha.startsWith(dayString) && r.evento === evento
    );
    return record ? record.hora : "-";
  };

  const hasRecordForDay = (day: number): boolean => {
    const dayString = `${selectedYear}-${String(selectedMonth).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    return records.some((r) => r.fecha.startsWith(dayString));
  };

  const daysInMonth = new Date(
    Number(selectedYear),
    Number(selectedMonth),
    0
  ).getDate();

  const isWeekday = (date: Date): boolean => {
    const dayOfWeek = date.getDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6;
  };

  return (
    <div className="schedule-container">
      <div className="header">
        
        <input
          type="text"
          placeholder="Matricula del alumno"
          value={matricula}
          onChange={handleMatriculaChange}
          className={errors.matricula ? "input-error" : ""}
        />
        <button className="search-button" onClick={handleSearchClick}>
          🔍
        </button>
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
          {showCalendar && (
            <Alert
              message={`Fecha seleccionada: ${selectedValue?.format(
                "YYYY-MM-DD"
              )}`}
            />
          )}
          <button
            className="toggle-view-button"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            {showCalendar ? "Mostrar Tabla" : "Mostrar Calendario"}
          </button>
          {showCalendar ? (
            <Calendar
              value={value}
              onSelect={onSelect}
              onPanelChange={onPanelChange}
            />
          ) : (
            <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
              <div style={{ marginBottom: "20px" }}>
                <input
                  type="text"
                  placeholder="Matrícula"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                  style={{
                    padding: "10px",
                    marginRight: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
                <input
                  type="number"
                  placeholder="Mes"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  min="1"
                  max="12"
                  style={{
                    padding: "10px",
                    marginRight: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
                <input
                  type="number"
                  placeholder="Año"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  min="2023"
                  style={{
                    padding: "10px",
                    marginRight: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
                <button
                  onClick={fetchRecords}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "5px",
                    border: "none",
                    backgroundColor: "#03983Ex|",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Buscar
                </button>
              </div>

             
            </div>
          )}
        </div>
        <table style={{ width: "120%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{
                      backgroundColor: "rgb(160, 33, 66)",
                      color: "#fff",
                    }}
                  >
                    <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                      Día
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                      Registro
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                      Entrada
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                      Inicio del Receso
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                      Fin del Receso
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                      Salida
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: daysInMonth }, (_, index) => {
                    const day = index + 1;
                    const date = new Date(
                      Number(selectedYear),
                      Number(selectedMonth) - 1,
                      day
                    );

                    if (!isWeekday(date)) {
                      return null;
                    }

                    return (
                      <tr
                        key={day}
                        style={{
                          backgroundColor: index % 2 === 0 ? "#f2f2f2" : "#fff",
                        }}
                      >
                        <td
                          style={{
                            padding: "10px",
                            border: "1px solid #ccc",
                            textAlign: "center",
                          }}
                        >
                          {day}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            border: "1px solid #ccc",
                            textAlign: "center",
                          }}
                        >
                          {hasRecordForDay(day) ? "✅" : "❌"}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            border: "1px solid #ccc",
                            textAlign: "center",
                          }}
                        >
                          {getRecordForDay(day, "Entrada")}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            border: "1px solid #ccc",
                            textAlign: "center",
                          }}
                        >
                          {getRecordForDay(day, "Inicio del receso")}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            border: "1px solid #ccc",
                            textAlign: "center",
                          }}
                        >
                          {getRecordForDay(day, "Fin del receso")}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            border: "1px solid #ccc",
                            textAlign: "center",
                          }}
                        >
                          {getRecordForDay(day, "Salida")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
      </div>
    </div>
  );
};

export default Schedule;
