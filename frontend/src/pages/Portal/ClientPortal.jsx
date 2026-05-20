import { useEffect } from 'react';
import { Layout, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import '../Dashboard/Dashboard.css';

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

  const user = authService.getUser();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        className="dashboard-header"
        style={{
          padding: '0 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: '18px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
            }}
          >
            Личный кабинет клиента
          </h2>
          {user?.full_name && (
            <div style={{ fontSize: 12, color: '#666' }}>{user.full_name}</div>
          )}
        </div>
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{
            background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
            border: 'none',
          }}
        >
          Выход
        </Button>
      </Header>
      <Content
        className="dashboard-content"
        style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}
      >
        <Outlet />
      </Content>
    </Layout>
  );
};

export default ClientPortal;
