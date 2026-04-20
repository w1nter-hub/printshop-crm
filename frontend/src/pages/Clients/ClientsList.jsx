import { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import clientService from '../../services/clientService';
import ClientForm from './ClientForm';

const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const data = await clientService.getAll();
      setClients(data);
    } catch (error) {
      message.error('Ошибка загрузки клиентов');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await clientService.delete(id);
      message.success('Клиент удален');
      fetchClients();
    } catch (error) {
      message.error('Ошибка удаления клиента');
    }
  };

  const handleAdd = () => {
    setSelectedClient(null);
    setModalVisible(true);
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedClient(null);
  };

  const handleSuccess = () => {
    setModalVisible(false);
    setSelectedClient(null);
    fetchClients();
  };

  const columns = isMobile ? [
    {
      title: 'Клиент',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>{record.phone}</div>
          {record.email && <div style={{ fontSize: '12px', color: '#888' }}>{record.email}</div>}
        </div>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 80,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Изм.
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
      title: 'ФИО',
      dataIndex: 'full_name',
      key: 'full_name',
      filteredValue: [searchText],
      onFilter: (value, record) => 
        record.full_name.toLowerCase().includes(value.toLowerCase()) ||
        record.phone.includes(value) ||
        (record.email && record.email.toLowerCase().includes(value.toLowerCase())),
    },
    {
      title: 'Телефон',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Компания',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Изменить
          </Button>
          <Popconfirm
            title="Удалить клиента?"
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
        <Input
          placeholder="Поиск"
          prefix={<SearchOutlined />}
          style={{ width: isMobile ? '100%' : 300 }}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} block={isMobile}>
          {isMobile ? 'Добавить' : 'Добавить клиента'}
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={clients}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10, simple: isMobile }}
        scroll={{ x: isMobile ? 'max-content' : undefined }}
        size={isMobile ? 'small' : 'default'}
      />
      <ClientForm
        visible={modalVisible}
        onCancel={handleModalClose}
        onSuccess={handleSuccess}
        client={selectedClient}
      />
    </div>
  );
};

export default ClientsList;
