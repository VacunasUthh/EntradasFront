import React, { useState } from 'react';
import { UserOutlined, UserAddOutlined, LogoutOutlined, CalendarOutlined } from '@ant-design/icons';
import type { MenuProps, MenuTheme } from 'antd';
import { Menu as AntMenu, Switch } from 'antd';
import './estilos/Menu.css';

interface Props {
  onMenuClick: (section: string) => void;
  onLogout: () => void; 
}

const CustomMenu: React.FC<Props> = ({ onMenuClick, onLogout }) => {
  const [menuTheme, setMenuTheme] = useState<MenuTheme>('light');
  const [current, setCurrent] = useState('1');

  const changeTheme = (value: boolean) => {
    setMenuTheme(value ? 'dark' : 'light');
  };

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'logout') {
      onLogout();
    } else {
      setCurrent(e.key);
      onMenuClick(e.key);
    }
  };

  //Se instalo iconos con este comando npm install @ant-design/icons --save
  const items: MenuProps['items'] = [
    {
      key: 'welcome',
      icon: <UserOutlined />,
      label: 'Bienvenida',
    },
    {
      key: 'schedule',
      icon: <CalendarOutlined />,
      label: 'Horarios',
    },
    {
      key: 'addStudents',
      icon: <UserAddOutlined />,
      label: 'Añadir alumnos',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Cerrar sesión',
    },
  ];

  return (
    <>
      <Switch
        checked={menuTheme === 'dark'}
        onChange={changeTheme}
        checkedChildren="Dark"
        unCheckedChildren="Light"
      />
      <br />
      <br />
      <AntMenu
        onClick={onClick}
        style={{ width: '100%' }}
        selectedKeys={[current]}
        mode="inline"
        theme={menuTheme}
        items={items}
      />
    </>
  );
};

export default CustomMenu;
