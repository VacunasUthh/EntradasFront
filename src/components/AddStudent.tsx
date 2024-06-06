import React, { useState } from 'react';
import './estilos/AddStudent.css';

const AddStudent: React.FC = () => {
  const [matricula, setMatricula] = useState<string>('');
  const [correo, setCorreo] = useState<string>('');
  const [proyecto, setProyecto] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errors: { [key: string]: string } = {};

    // Validar matrícula (debe ser exactamente 8 dígitos)
    if (!/^\d{8}$/.test(matricula)) {
      errors.matricula = 'La matrícula debe ser de exactamente 8 dígitos.';
    }

    // Validar correo electrónico
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      errors.correo = 'El correo electrónico no es válido.';
    }

    // Validar proyecto (no vacío)
    if (!proyecto) {
      errors.proyecto = 'El proyecto es obligatorio.';
    }

    // Validar descripción (mínimo 10 caracteres)
    if (descripcion.length < 10) {
      errors.descripcion = 'La descripción debe tener al menos 10 caracteres.';
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Aquí puedes manejar el envío de datos
      console.log({ matricula, correo, proyecto, descripcion });
      // Limpiar los campos después del envío
      setMatricula('');
      setCorreo('');
      setProyecto('');
      setDescripcion('');
      setErrors({});
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
      <form onSubmit={handleSubmit}>
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
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className={errors.descripcion ? 'input-error' : ''}
            required
          ></textarea>
          {errors.descripcion && <span className="error">{errors.descripcion}</span>}
        </div>
        <button type="submit">Añadir</button>
      </form>
    </div>
  );
};

export default AddStudent;
