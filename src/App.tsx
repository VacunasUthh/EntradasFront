import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Button, Layout } from 'antd';
import Login from './components/Login';
import Register from './components/Register';
import Welcome from './components/Welcome';
import CustomMenu from './components/Menu';
import Schedule from './components/Schedule';
import AddStudent from './components/AddStudent';
import StudentList from './components/StudentList';
import AssignSchedule from './components/AssignSchedule'; 
import './App.css';
import colors from './colors';

const { Header, Sider, Content, Footer } = Layout;

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
    <Layout style={{ minHeight: '100vh', backgroundColor: colors.background }}>
      {user ? (
        <>
          <Sider trigger={null} collapsible collapsed={collapsed} style={{ backgroundColor: colors.primary }}>
            <div className="demo-logo-vertical" />
            <CustomMenu onMenuClick={handleMenuClick} onLogout={handleLogout} />
          </Sider>
          <Layout>
            <Header style={{ padding: 0, backgroundColor: colors.headerBg }}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                }}
              />
            </Header>
            <Content
              style={{
                padding: 24,
                backgroundColor: colors.containerBg,
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                flex: 1,
                overflow: 'auto',
              }}
            >
              {currentSection === 'welcome' && <Welcome username={user || ''} />}
              {currentSection === 'schedule' && <Schedule  username={user || ''}/>}
              {currentSection === 'addStudents' && <AddStudent username={user || ''}/>}
              {currentSection === 'studentList' && <StudentList username={user || ''}/>}
              {currentSection === 'assignSchedule' && <AssignSchedule username={user || ''}/>}

            </Content>
            <Footer style={{ textAlign: 'center', backgroundColor: colors.footerBg, color: colors.text }}>
              Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>
          </Layout>
        </>
      ) : (
        <Content className="centered-content" style={{ backgroundColor: colors.background }}>
          {showRegister ? (
            <Register onRegister={handleRegister} onLoginClick={handleShowLogin} />
          ) : (
            <Login onLogin={handleLogin} onRegisterClick={handleShowRegister} />
          )}
        </Content>
      )}
    </Layout>
  );
};

export default App;
