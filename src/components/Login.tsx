import React, { useState } from 'react';
import axios from 'axios';
import './estilos/Login.css';

interface Props {
  onLogin: (user: string) => void;
  onRegisterClick: () => void;
}

const Login: React.FC<Props> = ({ onLogin, onRegisterClick }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
      
    try {
      const url = `https://entradas-backend.vercel.app/docentes/buscar?matricula=${username}&password=${password}`;
      console.log('URL:', url);  // Imprime la URL para depuración

      const response = await axios.get(url);
      console.log('Response:', response);  // Imprime la respuesta del servidor

      // Verificamos si la respuesta es válida
      if (response.data && response.status === 200) {
        onLogin(username);  // Llamamos la función de onLogin si el usuario es válido
      } else {
        setError('Usuario o contraseña incorrecta');
      }
    } catch (error) {
      console.error('Error:', error);  // Imprime el error para depuración
      setError('Error en la autenticación. Intenta nuevamente.');
    }
  };

  return (
    <div className="login-container3">
      <img src="/imagenes/imgLogin.png" alt="Welcome" className="login-image" />
      <h2>Inicio de sesión</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div>
          <label>Usuario:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit">Iniciar Sesion</button>
      </form>
      <p>
        ¿No tienes una cuenta? <button onClick={onRegisterClick}>Regístrate aquí</button>
      </p>
    </div>
  );
};

export default Login;
