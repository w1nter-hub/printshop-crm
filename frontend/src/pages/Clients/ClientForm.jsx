import { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import clientService from '../../services/clientService';

const ClientForm = ({ visible, onCancel, onSuccess, client }) => {
  const [form] = Form.useForm();
  const isEdit = !!client;

  useEffect(() => {
    if (visible) {
      if (client) {
        form.setFieldsValue(client);
      } else {
        form.resetFields();
      }
    }
  }, [visible, client, form]);

  const handleSubmit = async (values) => {
    try {
      if (isEdit) {
        await clientService.update(client.id, values);
        message.success('Клиент обновлен');
      } else {
        await clientService.create(values);
        message.success('Клиент создан');
      }
      form.resetFields();
      onSuccess();
    } catch (error) {
      message.error('Ошибка: ' + (error.response?.data?.detail || 'Неизвестная ошибка'));
    }
  };

  return (
    <Modal
      title={isEdit ? 'Редактировать клиента' : 'Добавить клиента'}
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
      >
        <Form.Item
          name="full_name"
          label="ФИО"
          rules={[{ required: true, message: 'Введите ФИО' }]}
        >
          <Input placeholder="Иванов Иван Иванович" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Телефон"
          rules={[
            { required: true, message: 'Введите телефон' },
            { min: 10, message: 'Минимум 10 символов' }
          ]}
        >
          <Input placeholder="+7 777 123 45 67" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ type: 'email', message: 'Введите корректный email' }]}
        >
          <Input placeholder="example@mail.com" />
        </Form.Item>

        <Form.Item
          name="company"
          label="Компания"
        >
          <Input placeholder="ТОО Компания" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Адрес"
        >
          <Input.TextArea rows={2} placeholder="Адрес клиента" />
        </Form.Item>

        <Form.Item
          name="notes"
          label="Заметки"
        >
          <Input.TextArea rows={3} placeholder="Дополнительная информация о клиенте" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ClientForm;
