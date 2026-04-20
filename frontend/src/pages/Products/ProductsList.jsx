import { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import productService from '../../services/productService';
import ProductForm from './ProductForm';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll(0, 1000, false);
      setProducts(data);
    } catch (error) {
      message.error('Ошибка загрузки продуктов');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await productService.delete(id);
      message.success('Продукт деактивирован');
      fetchProducts();
    } catch (error) {
      message.error('Ошибка деактивации продукта');
    }
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setModalVisible(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const handleSuccess = () => {
    setModalVisible(false);
    setSelectedProduct(null);
    fetchProducts();
  };

  const columns = isMobile ? [
    {
      title: 'Продукт',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>
            {record.base_price.toFixed(2)} ₸ / {record.unit}
          </div>
          <Tag color={record.is_active ? 'green' : 'red'} style={{ marginTop: 4 }}>
            {record.is_active ? 'Активен' : 'Неактивен'}
          </Tag>
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
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Базовая цена',
      dataIndex: 'base_price',
      key: 'base_price',
      width: 120,
      render: (price) => `${price.toFixed(2)} ₸`,
    },
    {
      title: 'Единица',
      dataIndex: 'unit',
      key: 'unit',
      width: 100,
    },
    {
      title: 'Статус',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 100,
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Активен' : 'Неактивен'}
        </Tag>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Button 
            type="link" 
            onClick={() => handleEdit(record)}
            size="small"
            style={{ padding: 0, height: 'auto' }}
          >
            Изменить
          </Button>
          <Popconfirm
            title="Деактивировать продукт?"
            onConfirm={() => handleDelete(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button 
              type="link" 
              danger
              size="small"
              style={{ padding: 0, height: 'auto' }}
            >
              Удалить
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} block={isMobile}>
          {isMobile ? 'Добавить' : 'Добавить продукт'}
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={products}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10, simple: isMobile }}
        scroll={{ x: 800 }}
        size={isMobile ? 'small' : 'default'}
      />
      <ProductForm
        visible={modalVisible}
        onCancel={handleModalClose}
        onSuccess={handleSuccess}
        product={selectedProduct}
      />
    </div>
  );
};

export default ProductsList;
