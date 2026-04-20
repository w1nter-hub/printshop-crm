import { useState, useEffect } from 'react';
import { Layout, Menu, Button, Drawer } from 'antd';
import {
  UserOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  LogoutOutlined,
  DashboardOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import authService from '../../services/authService';
import './Dashboard.css';

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Главная',
    },
    {
      key: '/dashboard/clients',
      icon: <UserOutlined />,
      label: 'Клиенты',
    },
    {
      key: '/dashboard/products',
      icon: <ShoppingOutlined />,
      label: 'Продукты',
    },
    {
      key: '/dashboard/orders',
      icon: <FileTextOutlined />,
      label: 'Заказы',
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
    if (isMobile) {
      setDrawerVisible(false);
    }
  };

  const menuContent = (
    <>
      <div className="logo-container">
        <img 
          src="/logo.png" 
          alt="PrintShop CRM" 
          className="logo-image"
        />
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {!isMobile ? (
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
          {menuContent}
        </Sider>
      ) : (
        <Drawer
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          bodyStyle={{ padding: 0, background: '#1a1a2e' }}
          width={200}
        >
          {menuContent}
        </Drawer>
      )}
      
      <Layout>
        <Header className="dashboard-header" style={{ 
          padding: '0 16px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setDrawerVisible(true)}
                style={{ marginRight: 16, fontSize: '20px' }}
              />
            )}
            <h2 style={{ 
              margin: 0, 
              fontSize: isMobile ? '16px' : '20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}>
              Панель управления
            </h2>
          </div>
          <Button 
            type="primary" 
            danger 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
            size={isMobile ? 'small' : 'middle'}
            style={{
              background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
              border: 'none',
              boxShadow: '0 4px 12px rgba(229, 62, 62, 0.3)'
            }}
          >
            {!isMobile && 'Выход'}
          </Button>
        </Header>
        <Content className="dashboard-content" style={{ 
          margin: isMobile ? '16px 8px' : '24px 16px', 
          padding: isMobile ? 12 : 24, 
          minHeight: 280 
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
