import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, ShoppingOutlined, FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';
import clientService from '../../services/clientService';
import productService from '../../services/productService';
import orderService from '../../services/orderService';

const Home = () => {
  const [stats, setStats] = useState({
    clients: 0,
    products: 0,
    orders: 0,
    completedOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [clients, products, orders] = await Promise.all([
        clientService.getAll(),
        productService.getAll(0, 1000, false),
        orderService.getAll(0, 1000),
      ]);

      const completedOrders = orders.filter(order => order.status === 'completed').length;

      setStats({
        clients: clients.length,
        products: products.length,
        orders: orders.length,
        completedOrders: completedOrders,
      });
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Добро пожаловать в PrintShop CRM</h1>
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading} style={{ borderRadius: '12px' }}>
            <Statistic
              title="Всего клиентов"
              value={stats.clients}
              prefix={<UserOutlined style={{ fontSize: '24px' }} />}
              valueStyle={{ color: '#667eea', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading} style={{ borderRadius: '12px' }}>
            <Statistic
              title="Продуктов"
              value={stats.products}
              prefix={<ShoppingOutlined style={{ fontSize: '24px' }} />}
              valueStyle={{ color: '#764ba2', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading} style={{ borderRadius: '12px' }}>
            <Statistic
              title="Всего заказов"
              value={stats.orders}
              prefix={<FileTextOutlined style={{ fontSize: '24px' }} />}
              valueStyle={{ color: '#f6ad55', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading} style={{ borderRadius: '12px' }}>
            <Statistic
              title="Завершено заказов"
              value={stats.completedOrders}
              prefix={<CheckCircleOutlined style={{ fontSize: '24px' }} />}
              valueStyle={{ color: '#48bb78', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
