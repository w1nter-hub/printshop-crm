import { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Tag, Select } from 'antd';
import { PlusOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import orderService from '../../services/orderService';
import OrderForm from './OrderForm';
import OrderDetails from './OrderDetails';

const { Option } = Select;

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAll(0, 1000, statusFilter);
      setOrders(data);
    } catch (error) {
      message.error('Ошибка загрузки заказов');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await orderService.delete(id);
      message.success('Заказ удален');
      fetchOrders();
    } catch (error) {
      message.error('Ошибка удаления заказа');
    }
  };

  const handleAdd = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleSuccess = () => {
    setModalVisible(false);
    fetchOrders();
  };

  const handleView = (orderId) => {
    setSelectedOrderId(orderId);
    setDetailsVisible(true);
  };

  const handleDetailsClose = () => {
    setDetailsVisible(false);
    setSelectedOrderId(null);
  };

  const handleOrderUpdate = () => {
    fetchOrders();
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

  const columns = isMobile ? [
    {
      title: 'Заказ',
      dataIndex: 'id',
      key: 'id',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>Заказ #{text}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>
            {record.client?.full_name || 'Не указан'}
          </div>
          <div style={{ marginTop: 4 }}>
            <Tag color={getStatusColor(record.status)}>
              {getStatusText(record.status)}
            </Tag>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: 4 }}>
            {record.total_price.toFixed(2)} ₸
          </div>
        </div>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 80,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record.id)}>
            Просм.
          </Button>
          <Popconfirm
            title="Удалить?"
            onConfirm={() => handleDelete(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button type="link" danger size="small" icon={<DeleteOutlined />}>
              Удал.
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ] : [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Клиент',
      dataIndex: ['client', 'full_name'],
      key: 'client',
      render: (text, record) => record.client?.full_name || 'Не указан',
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Сумма',
      dataIndex: 'total_price',
      key: 'total_price',
      width: 120,
      render: (price) => `${price.toFixed(2)} ₸`,
    },
    {
      title: 'Дата создания',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (date) => new Date(date).toLocaleString('ru-RU'),
    },
    {
      title: 'Срок',
      dataIndex: 'deadline',
      key: 'deadline',
      width: 180,
      render: (date) => date ? new Date(date).toLocaleString('ru-RU') : 'Не указан',
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record.id)}>
            Просмотр
          </Button>
          <Popconfirm
            title="Удалить заказ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Удалить
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ 
        marginBottom: 16, 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        gap: '8px',
        justifyContent: 'space-between' 
      }}>
        <Select
          placeholder="Фильтр по статусу"
          style={{ width: isMobile ? '100%' : 200 }}
          allowClear
          onChange={setStatusFilter}
        >
          <Option value="new">Новый</Option>
          <Option value="in_progress">В работе</Option>
          <Option value="ready">Готов</Option>
          <Option value="completed">Выдан</Option>
          <Option value="cancelled">Отменен</Option>
        </Select>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} block={isMobile}>
          {isMobile ? 'Создать' : 'Создать заказ'}
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={orders}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10, simple: isMobile }}
        scroll={{ x: isMobile ? 'max-content' : undefined }}
        size={isMobile ? 'small' : 'default'}
      />
      <OrderForm
        visible={modalVisible}
        onCancel={handleModalClose}
        onSuccess={handleSuccess}
      />
      <OrderDetails
        visible={detailsVisible}
        onCancel={handleDetailsClose}
        orderId={selectedOrderId}
        onUpdate={handleOrderUpdate}
      />
    </div>
  );
};

export default OrdersList;
