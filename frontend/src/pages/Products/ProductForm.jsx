import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Switch, message } from 'antd';
import productService from '../../services/productService';

const ProductForm = ({ visible, onCancel, onSuccess, product }) => {
  const [form] = Form.useForm();
  const isEdit = !!product;

  useEffect(() => {
    if (visible) {
      if (product) {
        form.setFieldsValue(product);
      } else {
        form.resetFields();
      }
    }
  }, [visible, product, form]);

  const handleSubmit = async (values) => {
    try {
      if (isEdit) {
        await productService.update(product.id, values);
        message.success('Продукт обновлен');
      } else {
        await productService.create(values);
        message.success('Продукт создан');
      }
      form.resetFields();
      onSuccess();
    } catch (error) {
      message.error('Ошибка: ' + (error.response?.data?.detail || 'Неизвестная ошибка'));
    }
  };

  return (
    <Modal
      title={isEdit ? 'Редактировать продукт' : 'Добавить продукт'}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={isEdit ? 'Сохранить' : 'Создать'}
      cancelText="Отмена"
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ is_active: true, unit: 'шт' }}
      >
        <Form.Item
          name="name"
          label="Название"
          rules={[{ required: true, message: 'Введите название' }]}
        >
          <Input placeholder="Визитки" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Описание"
        >
          <Input.TextArea rows={3} placeholder="Описание продукта/услуги" />
        </Form.Item>

        <Form.Item
          name="base_price"
          label="Базовая цена (₸)"
          rules={[
            { required: true, message: 'Введите цену' },
            { type: 'number', min: 0, message: 'Цена должна быть больше 0' }
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="1000"
            min={0}
            precision={2}
          />
        </Form.Item>

        <Form.Item
          name="unit"
          label="Единица измерения"
          rules={[{ required: true, message: 'Введите единицу' }]}
        >
          <Input placeholder="шт, м², лист" />
        </Form.Item>

        <Form.Item
          name="is_active"
          label="Активен"
          valuePropName="checked"
        >
          <Switch checkedChildren="Да" unCheckedChildren="Нет" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductForm;
