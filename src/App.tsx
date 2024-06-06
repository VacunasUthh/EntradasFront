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
            {/* Eliminamos el Header ya que no es necesario */}
            <Content style={{ margin: '0 16px', padding: '0' }}>
              <div className="site-layout-background" style={{ padding: '24px', minHeight: '360px' }}>
                {currentSection === 'welcome' && <Welcome username={user || ''} />}
                {currentSection === 'schedule' && <Schedule />}
                {currentSection === 'addStudents' && <AddStudent />}
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©{new Date().getFullYear()} Created by Ant UED</Footer>
          </Layout>
        </>
      ) : (
        showRegister ? (
          <Register onRegister={handleRegister} onLoginClick={handleShowLogin} />
        ) : (
          <Login onLogin={handleLogin} onRegisterClick={handleShowRegister} />
        )
      )}
    </Layout>
  );
};

export default App;
