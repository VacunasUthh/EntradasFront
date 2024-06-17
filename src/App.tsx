import React, { useState } from 'react';
import { Layout } from 'antd';
import Login from './components/Login';
import Register from './components/Register';
import Welcome from './components/Welcome';
import CustomMenu from './components/Menu';
import Schedule from './components/Schedule';
import AddStudent from './components/AddStudent';
import './App.css';

const { Content, Footer, Sider } = Layout;

const App: React.FC = () => {
  const [user, setUser] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<string>('welcome');
  const [collapsed, setCollapsed] = useState(false);

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
    <Layout style={{ minHeight: '100vh' }}>
      {user ? (
        <>
          <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
            <CustomMenu onMenuClick={handleMenuClick} onLogout={handleLogout} />
          </Sider>
          <Layout>
            <Content>
              {currentSection === 'welcome' && <Welcome username={user || ''} />}
              {currentSection === 'schedule' && <Schedule />}
              {currentSection === 'addStudents' && <AddStudent />}
            </Content>
            <Footer style={{ textAlign: 'center', backgroundColor: '#A02142' }}>
              Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>
          </Layout>
        </>
      ) : (
        showRegister ? (
          <Content>
            <Register onRegister={handleRegister} onLoginClick={handleShowLogin} />
          </Content>
        ) : (
          <Content>
            <Login onLogin={handleLogin} onRegisterClick={handleShowRegister} />
          </Content>
        )
      )}
    </Layout>
  );
};

export default App;
