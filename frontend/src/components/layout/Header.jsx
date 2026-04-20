/**
 * Header Component
 * 
 * Main application header with navigation and user menu.
 */

import React from 'react';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const { Header: AntHeader } = Layout;

const Header = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
        PrintShop CRM
      </div>
      <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
        <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
      </Dropdown>
    </AntHeader>
  );
};

export default Header;
