import { useEffect, useState } from 'react';
import { Table, Tag, Button, message, Card, Empty } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import portalService from '../../services/portalService';
import { getStatusColor, getStatusText } from '../../utils/orderStatus';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [profileData, ordersData] = await Promise.all([
          portalService.getProfile(),
          portalService.getMyOrders(),
        ]);
        setProfile(profileData);
        setOrders(ordersData);
      } catch {
        message.error('Не удалось загрузить ваши заказы');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const columns = [
    {
      title: '№ заказа',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: 'Сумма',
      dataIndex: 'total_price',
      key: 'total_price',
      render: (price) => `${price.toFixed(2)} ₸`,
    },
    {
      title: 'Создан',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleString('ru-RU'),
    },
    {
      title: 'Срок',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (date) =>
        date ? new Date(date).toLocaleString('ru-RU') : 'Не указан',
    },
    {
      title: '',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/portal/orders/${record.id}`)}
        >
          Подробнее
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <h3 style={{ marginTop: 0 }}>Добро пожаловать{profile ? `, ${profile.full_name}` : ''}</h3>
        <p style={{ marginBottom: 0, color: '#666' }}>
          Здесь вы видите статус своих заказов: новый, в работе, готов, выдан или отменён.
        </p>
      </Card>

      {orders.length === 0 && !loading ? (
        <Empty description="У вас пока нет заказов" />
      ) : (
        <Table
          columns={columns}
          dataSource={orders}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default MyOrders;
