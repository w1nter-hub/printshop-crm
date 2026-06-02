import { useEffect } from 'react';
import { Layout, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import '../Dashboard/Dashboard.css';
import './ClientPortal.css';

const { Header, Content } = Layout;

const ClientPortal = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    if (!authService.isClient()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <Layout className="client-portal-layout">
      <Header className="dashboard-header client-portal-header">
        <h1 className="client-portal-header__title">Личный кабинет клиента</h1>
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{
            background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
            border: 'none',
            flexShrink: 0,
          }}
        >
          Выход
        </Button>
      </Header>
      <Content className="dashboard-content client-portal-content">
        <Outlet />
      </Content>
    </Layout>
  );
};

export default ClientPortal;
