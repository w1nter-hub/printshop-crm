import { useEffect, useState } from 'react';
import { Table, Tag, Button, message, Card, Empty } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import portalService from '../../services/portalService';
import { getStatusColor, getStatusText } from '../../utils/orderStatus';
import './ClientPortal.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const columns = isMobile
    ? [
        {
          title: 'Заказ',
          key: 'order',
          render: (_, record) => (
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600 }}>№ {record.id}</div>
              <Tag color={getStatusColor(record.status)} style={{ marginTop: 4 }}>
                {getStatusText(record.status)}
              </Tag>
              <div style={{ marginTop: 6 }}>{record.total_price.toFixed(2)} ₸</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                {new Date(record.created_at).toLocaleString('ru-RU')}
              </div>
            </div>
          ),
        },
        {
          title: '',
          key: 'actions',
          width: 90,
          fixed: 'right',
          render: (_, record) => (
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/portal/orders/${record.id}`)}
              style={{ padding: 0 }}
            >
              Открыть
            </Button>
          ),
        },
      ]
    : [
        {
          title: '№ заказа',
          dataIndex: 'id',
          key: 'id',
          width: 90,
        },
        {
          title: 'Статус',
          dataIndex: 'status',
          key: 'status',
          width: 120,
          render: (status) => (
            <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
          ),
        },
        {
          title: 'Сумма',
          dataIndex: 'total_price',
          key: 'total_price',
          width: 110,
          render: (price) => `${price.toFixed(2)} ₸`,
        },
        {
          title: 'Создан',
          dataIndex: 'created_at',
          key: 'created_at',
          width: 160,
          render: (date) => new Date(date).toLocaleString('ru-RU'),
        },
        {
          title: 'Срок',
          dataIndex: 'deadline',
          key: 'deadline',
          width: 160,
          render: (date) =>
            date ? new Date(date).toLocaleString('ru-RU') : 'Не указан',
        },
        {
          title: 'Действия',
          key: 'actions',
          width: 130,
          fixed: 'right',
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
    <div className="portal-page">
      <Card className="portal-welcome-card" style={{ marginBottom: 16 }}>
        <h3>
          Добро пожаловать{profile ? `, ${profile.full_name}` : ''}
        </h3>
        <p style={{ color: '#666' }}>
          Здесь вы видите статус своих заказов: новый, в работе, готов, выдан или отменён.
        </p>
      </Card>

      {orders.length === 0 && !loading ? (
        <Empty description="У вас пока нет заказов" />
      ) : (
        <Card bodyStyle={{ padding: isMobile ? 8 : 16 }}>
          <div className="portal-table-wrap">
            <Table
              columns={columns}
              dataSource={orders}
              loading={loading}
              rowKey="id"
              pagination={{
                pageSize: 10,
                simple: isMobile,
                showSizeChanger: false,
              }}
              scroll={{ x: isMobile ? 320 : undefined }}
              size={isMobile ? 'small' : 'middle'}
            />
          </div>
        </Card>
      )}
    </div>
  );
};

export default MyOrders;
