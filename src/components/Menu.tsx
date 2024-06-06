import React, { useState } from 'react';
import { MailOutlined, LogoutOutlined } from '@ant-design/icons';
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

  const items: MenuProps['items'] = [
    {
      key: 'welcome',
      icon: <MailOutlined />,
      label: 'Bienvenida',
    },
    {
      key: 'schedule',
      icon: <MailOutlined />,
      label: 'Horarios',
    },
    {
      key: 'addStudents',
      icon: <MailOutlined />,
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
