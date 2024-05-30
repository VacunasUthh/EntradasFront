import React, { useState } from 'react';
import './estilos/AddStudent.css';

const AddStudent: React.FC = () => {
  const [matricula, setMatricula] = useState<string>('');
  const [correo, setCorreo] = useState<string>('');
  const [proyecto, setProyecto] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes manejar el envío de datos
    console.log({ matricula, correo, proyecto, descripcion });
    // Limpiar los campos después del envío
    setMatricula('');
    setCorreo('');
    setProyecto('');
    setDescripcion('');
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
            onChange={(e) => setMatricula(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Correo:</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Proyecto:</label>
          <input
            type="text"
            value={proyecto}
            onChange={(e) => setProyecto(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">Añadir</button>
      </form>
    </div>
  );
};

export default AddStudent;
