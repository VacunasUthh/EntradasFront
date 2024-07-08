import React, { useState } from 'react';
import { UserOutlined, UserAddOutlined, LogoutOutlined, CalendarOutlined, TeamOutlined, ScheduleOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu as AntMenu } from 'antd';
import colors from '../colors';
import './estilos/Menu.css';

interface Props {
  onMenuClick: (section: string) => void;
  onLogout: () => void; 
}

const CustomMenu: React.FC<Props> = ({ onMenuClick, onLogout }) => {
  const [current, setCurrent] = useState('1');

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
      key: 'studentList',
      icon: <TeamOutlined />,
      label: 'Lista de alumnos',
    },
    {
      key: 'assignSchedule',
      icon: <ScheduleOutlined />,
      label: 'Asignar Horarios',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Cerrar sesión',
    },
  ];

  return (
    <AntMenu
      onClick={onClick}
      style={{ width: '100%', backgroundColor: colors.background }}
      selectedKeys={[current]}
      mode="inline"
      theme="light"
      items={items}
      className="menu"
    />
  );
};

export default CustomMenu;
