import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Descriptions, Table, Tag, Button, message, Divider } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import portalService from '../../services/portalService';
import { getStatusColor, getStatusText } from '../../utils/orderStatus';

const ClientOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await portalService.getMyOrder(orderId);
        setOrder(data);
      } catch {
        message.error('Заказ не найден');
        navigate('/portal');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [orderId, navigate]);

  if (!order) {
    return null;
  }

  const itemColumns = [
    {
      title: 'Услуга / продукт',
      key: 'product',
      render: (_, record) => record.product?.name || `Продукт #${record.product_id}`,
    },
    {
      title: 'Кол-во',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Цена',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price.toFixed(2)} ₸`,
    },
    {
      title: 'Сумма',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `${total.toFixed(2)} ₸`,
    },
    {
      title: 'Параметры',
      dataIndex: 'specifications',
      key: 'specifications',
    },
  ];

  return (
    <div>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/portal')}
        style={{ marginBottom: 16 }}
      >
        К списку заказов
      </Button>

      <Card loading={loading} title={`Заказ #${order.id}`}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Статус">
            <Tag color={getStatusColor(order.status)}>
              {getStatusText(order.status)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Сумма">
            <strong>{order.total_price.toFixed(2)} ₸</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Дата создания">
            {new Date(order.created_at).toLocaleString('ru-RU')}
          </Descriptions.Item>
          <Descriptions.Item label="Срок выполнения">
            {order.deadline
              ? new Date(order.deadline).toLocaleString('ru-RU')
              : 'Не указан'}
          </Descriptions.Item>
          {order.notes && (
            <Descriptions.Item label="Комментарий">
              {order.notes}
            </Descriptions.Item>
          )}
        </Descriptions>

        <Divider>Позиции заказа</Divider>
        <Table
          columns={itemColumns}
          dataSource={order.items || []}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );
};

export default ClientOrderDetails;
