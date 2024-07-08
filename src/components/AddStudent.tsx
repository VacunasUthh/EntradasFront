import React, { useState } from 'react';
import axios from 'axios';
import './estilos/AddStudent.css';

interface Props {
  username: string;
}

const AddStudent: React.FC<Props> = ({ username }) => {
  const [matricula, setMatricula] = useState<string>('');
  const [correo, setCorreo] = useState<string>('');
  const [proyecto, setProyecto] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  const validate = () => {
    const errors: { [key: string]: string } = {};

    if (!/^\d{8}$/.test(matricula)) {
      errors.matricula = 'La matrícula debe ser de exactamente 8 dígitos.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      errors.correo = 'El correo electrónico no es válido.';
    }

    if (!proyecto) {
      errors.proyecto = 'El proyecto es obligatorio.';
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.put(`http://localhost:3000/docentes/agregar-alumno/${username}`, {
          matricula,
          correo,
          proyecto,
          horario: {
            entrada: '08:00',
            receso: 40,
            salida: '14:00',
          }
        });

        if (response.status === 200) {
          setSuccessMessage('Estudiante añadido exitosamente');
          setMatricula('');
          setCorreo('');
          setProyecto('');
          setErrors({});
        }
      } catch (error) {
        console.error('Error al añadir el estudiante:', error);
      }
    }
  };

  const handleMatriculaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 8) {
      setMatricula(value);
    }
  };

  return (
    <div className="add-student-container">
      <h2>Añadir Alumnos</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Matrícula:</label>
          <input
            type="text"
            value={matricula}
            onChange={handleMatriculaChange}
            className={errors.matricula ? 'input-error' : ''}
            maxLength={8}
            required
          />
          {errors.matricula && <span className="error">{errors.matricula}</span>}
        </div>
        <div className="form-group">
          <label>Correo:</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className={errors.correo ? 'input-error' : ''}
            required
          />
          {errors.correo && <span className="error">{errors.correo}</span>}
        </div>
        <div className="form-group">
          <label>Proyecto:</label>
          <input
            type="text"
            value={proyecto}
            onChange={(e) => setProyecto(e.target.value)}
            className={errors.proyecto ? 'input-error' : ''}
            required
          />
          {errors.proyecto && <span className="error">{errors.proyecto}</span>}
        </div>
        <div className="form-group">
          <label>Descripción:</label>
          
          {errors.descripcion && <span className="error">{errors.descripcion}</span>}
        </div>
        <button type="submit">Añadir</button>
      </form>
    </div>
  );
};

export default AddStudent;
