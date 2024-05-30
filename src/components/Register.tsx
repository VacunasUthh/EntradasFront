import React, { useState } from 'react';
import './estilos/Register.css';

interface Props {
  onRegister: (user: string) => void;
  onLoginClick: () => void;
}

const Register: React.FC<Props> = ({ onRegister, onLoginClick }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (username && password) {
      onRegister(username);
    } else {
      setError('Please enter a valid username and password');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
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
        <button type="submit">Registrar</button>
      </form>
      <p>
        Ya tienes una cuenta? <button onClick={onLoginClick}>Entre aquí</button>
      </p>
    </div>
  );
};

export default Register;