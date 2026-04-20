import { useState, useEffect } from 'react';
import { Modal, Descriptions, Table, Tag, Select, Button, message, Divider, Space } from 'antd';
import orderService from '../../services/orderService';

const { Option } = Select;

const OrderDetails = ({ visible, onCancel, orderId, onUpdate }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusChanging, setStatusChanging] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    if (visible && orderId) {
      fetchOrder();
    }
  }, [visible, orderId]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const data = await orderService.getById(orderId);
      setOrder(data);
    } catch (error) {
      message.error('Ошибка загрузки заказа');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setStatusChanging(true);
    try {
      await orderService.update(orderId, { status: newStatus });
      message.success('Статус обновлен');
      fetchOrder();
      if (onUpdate) onUpdate();
    } catch (error) {
      message.error('Ошибка обновления статуса');
    } finally {
      setStatusChanging(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'blue',
      in_progress: 'orange',
      ready: 'green',
      completed: 'success',
      cancelled: 'red',
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      new: 'Новый',
      in_progress: 'В работе',
      ready: 'Готов',
      completed: 'Выдан',
      cancelled: 'Отменен',
    };
    return texts[status] || status;
  };

  const itemColumns = isMobile ? [
    {
      title: 'Позиция',
      dataIndex: 'product',
      key: 'product',
      render: (product, record) => (
        <div style={{ fontSize: '12px' }}>
          <div style={{ fontWeight: 'bold' }}>{product?.name || 'Не указан'}</div>
          <div style={{ color: '#888' }}>Кол-во: {record.quantity}</div>
          <div style={{ color: '#888' }}>Цена: {record.price.toFixed(2)} ₸</div>
          <div style={{ fontWeight: 'bold' }}>Итого: {record.total.toFixed(2)} ₸</div>
          {record.specifications && (
            <div style={{ color: '#666', marginTop: 4 }}>{record.specifications}</div>
          )}
        </div>
      ),
    }
  ] : [
    {
      title: 'Продукт',
      dataIndex: ['product', 'name'],
      key: 'product',
      render: (text, record) => record.product?.name || 'Не указан',
    },
    {
      title: 'Количество',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
    },
    {
      title: 'Цена',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price) => `${price.toFixed(2)} ₸`,
    },
    {
      title: 'Сумма',
      dataIndex: 'total',
      key: 'total',
      width: 120,
      render: (total) => `${total.toFixed(2)} ₸`,
    },
    {
      title: 'Характеристики',
      dataIndex: 'specifications',
      key: 'specifications',
    },
  ];

  if (!order) return null;

  return (
    <Modal
      title={`Заказ #${orderId}`}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          Закрыть
        </Button>
      ]}
      width={isMobile ? '95%' : 900}
      style={isMobile ? { top: 20 } : undefined}
    >
      <Descriptions 
        bordered 
        column={isMobile ? 1 : 2}
        size={isMobile ? 'small' : 'default'}
        labelStyle={isMobile ? { fontSize: '12px', padding: '8px' } : undefined}
        contentStyle={isMobile ? { fontSize: '12px', padding: '8px' } : undefined}
      >
        <Descriptions.Item label="ID">{order.id}</Descriptions.Item>
        <Descriptions.Item label="Клиент" span={isMobile ? 1 : 2}>
          <div style={{ wordBreak: 'break-word' }}>
            {order.client?.full_name || 'Не указан'}
            {order.client?.phone && ` (${order.client.phone})`}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Статус" span={isMobile ? 1 : 2}>
          <Space direction={isMobile ? 'vertical' : 'horizontal'} style={{ width: '100%' }}>
            <Tag color={getStatusColor(order.status)}>
              {getStatusText(order.status)}
            </Tag>
            <Select
              value={order.status}
              onChange={handleStatusChange}
              loading={statusChanging}
              style={{ width: isMobile ? '100%' : 150 }}
              size={isMobile ? 'small' : 'middle'}
            >
              <Option value="new">Новый</Option>
              <Option value="in_progress">В работе</Option>
              <Option value="ready">Готов</Option>
              <Option value="completed">Выдан</Option>
              <Option value="cancelled">Отменен</Option>
            </Select>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Сумма" span={isMobile ? 1 : 2}>
          <strong style={{ fontSize: isMobile ? 16 : 18 }}>{order.total_price.toFixed(2)} ₸</strong>
        </Descriptions.Item>
        <Descriptions.Item label="Дата создания" span={isMobile ? 1 : 2}>
          <div style={{ fontSize: isMobile ? '11px' : '14px' }}>
            {new Date(order.created_at).toLocaleString('ru-RU')}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Срок" span={isMobile ? 1 : 2}>
          <div style={{ fontSize: isMobile ? '11px' : '14px' }}>
            {order.deadline ? new Date(order.deadline).toLocaleString('ru-RU') : 'Не указан'}
          </div>
        </Descriptions.Item>
        {order.notes && (
          <Descriptions.Item label="Примечания" span={isMobile ? 1 : 2}>
            <div style={{ wordBreak: 'break-word', fontSize: isMobile ? '12px' : '14px' }}>
              {order.notes}
            </div>
          </Descriptions.Item>
        )}
      </Descriptions>

      <Divider>Позиции заказа</Divider>

      <Table
        columns={itemColumns}
        dataSource={order.items}
        rowKey="id"
        pagination={false}
        size="small"
        scroll={{ x: isMobile ? 'max-content' : undefined }}
      />
    </Modal>
  );
};

export default OrderDetails;
