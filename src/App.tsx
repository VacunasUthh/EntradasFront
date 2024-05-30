import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Welcome from './components/Welcome';
import Menu from './components/Menu';
import Schedule from './components/Schedule';
import AddStudent from './components/AddStudent';
import './App.css';

const App: React.FC = () => {
  const [user, setUser] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<string>('welcome');

  const handleLogin = (username: string) => {
    setUser(username);
    setCurrentSection('welcome');
  };

  const handleRegister = (username: string) => {
    setUser(username);
    setCurrentSection('welcome');
  };

  const handleShowRegister = () => {
    setShowRegister(true);
  };

  const handleShowLogin = () => {
    setShowRegister(false);
  };

  const handleMenuClick = (section: string) => {
    setCurrentSection(section);
  };

  const handleLogout = () => {
    setUser(null);
    setShowRegister(false);
    setCurrentSection('welcome');
  };

  return (
    <div className="App">
      {user ? (
        <>
          <Menu onMenuClick={handleMenuClick} onLogout={handleLogout} />
          <div className="content">
            {currentSection === 'welcome' && <Welcome username={user || ''} />}
            {currentSection === 'schedule' && <Schedule />}
            {currentSection === 'addStudents' && <AddStudent />}
            {/* Aquí puedes añadir más secciones según sea necesario */}
          </div>
        </>
      ) : (
        showRegister ? (
          <Register onRegister={handleRegister} onLoginClick={handleShowLogin} />
        ) : (
          <Login onLogin={handleLogin} onRegisterClick={handleShowRegister} />
        )
      )}
    </div>
  );
};

export default App;
