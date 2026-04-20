import { useState, useEffect } from 'react';
import { Modal, Form, Select, InputNumber, DatePicker, Input, Button, Space, message, Divider } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import orderService from '../../services/orderService';
import clientService from '../../services/clientService';
import productService from '../../services/productService';

const { Option } = Select;
const { TextArea } = Input;

const OrderForm = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchData();
      form.resetFields();
    }
  }, [visible, form]);

  const fetchData = async () => {
    try {
      const [clientsData, productsData] = await Promise.all([
        clientService.getAll(),
        productService.getAll(0, 1000, true)
      ]);
      setClients(clientsData);
      setProducts(productsData);
    } catch (error) {
      message.error('Ошибка загрузки данных');
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const orderData = {
        client_id: values.client_id,
        status: 'new',
        notes: values.notes || '',
        deadline: values.deadline ? values.deadline.toISOString() : null,
        items: values.items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          specifications: item.specifications || ''
        }))
      };

      await orderService.create(orderData);
      message.success('Заказ создан');
      form.resetFields();
      onSuccess();
    } catch (error) {
      message.error('Ошибка создания заказа: ' + (error.response?.data?.detail || 'Неизвестная ошибка'));
    } finally {
      setLoading(false);
    }
  };

  const handleProductChange = (value, index) => {
    const product = products.find(p => p.id === value);
    if (product) {
      const items = form.getFieldValue('items');
      items[index].price = product.base_price;
      form.setFieldsValue({ items });
    }
  };

  return (
    <Modal
      title="Создать заказ"
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Создать"
      cancelText="Отмена"
      width={800}
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          items: [{ product_id: undefined, quantity: 1, price: 0, specifications: '' }]
        }}
      >
        <Form.Item
          name="client_id"
          label="Клиент"
          rules={[{ required: true, message: 'Выберите клиента' }]}
        >
          <Select
            placeholder="Выберите клиента"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {clients.map(client => (
              <Option key={client.id} value={client.id}>
                {client.full_name} ({client.phone})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="deadline"
          label="Срок выполнения"
        >
          <DatePicker
            showTime
            format="DD.MM.YYYY HH:mm"
            placeholder="Выберите дату и время"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Divider>Позиции заказа</Divider>

        <Form.List name="items">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'product_id']}
                    rules={[{ required: true, message: 'Выберите продукт' }]}
                    style={{ width: 200 }}
                  >
                    <Select
                      placeholder="Продукт"
                      onChange={(value) => handleProductChange(value, index)}
                    >
                      {products.map(product => (
                        <Option key={product.id} value={product.id}>
                          {product.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'quantity']}
                    rules={[{ required: true, message: 'Количество' }]}
                    style={{ width: 100 }}
                  >
                    <InputNumber placeholder="Кол-во" min={1} />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'price']}
                    rules={[{ required: true, message: 'Цена' }]}
                    style={{ width: 120 }}
                  >
                    <InputNumber placeholder="Цена" min={0} precision={2} />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'specifications']}
                    style={{ width: 200 }}
                  >
                    <Input placeholder="Характеристики" />
                  </Form.Item>

                  {fields.length > 1 && (
                    <Button
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                    />
                  )}
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Добавить позицию
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item
          name="notes"
          label="Примечания"
        >
          <TextArea rows={3} placeholder="Дополнительная информация о заказе" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OrderForm;
