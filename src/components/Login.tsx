import React, { useState } from 'react';
import './estilos/Login.css';

interface Props {
  onLogin: (user: string) => void;
  onRegisterClick: () => void; // Añadimos esto para el botón de registro
}

const Login: React.FC<Props> = ({ onLogin, onRegisterClick }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (username === 'R' && password === 'R') {
      onLogin(username);
    } else {
      setError('Usuario o contraseña incorrecta');
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
        <button type="submit">Login</button>
      </form>
      <p>
        ¿No tienes una cuenta? <button onClick={onRegisterClick}>Regístrate aquí</button>
      </p>
    </div>
  );
};

export default Login;