import { useEffect } from 'react';
import { Modal, Form, Input, message, Switch, Alert } from 'antd';
import clientService from '../../services/clientService';

const ClientForm = ({ visible, onCancel, onSuccess, client }) => {
  const [form] = Form.useForm();
  const isEdit = !!client;

  useEffect(() => {
    if (visible) {
      if (client) {
        form.setFieldsValue({
          ...client,
          create_portal_account: false,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ create_portal_account: false });
      }
    }
  }, [visible, client, form]);

  const handleSubmit = async (values) => {
    const { create_portal_account, portal_password, confirm_portal_password, ...rest } = values;

    if (!isEdit && create_portal_account) {
      if (!rest.email) {
        message.error('Укажите email для личного кабинета клиента');
        return;
      }
      if (!portal_password || portal_password.length < 6) {
        message.error('Пароль для личного кабинета — минимум 6 символов');
        return;
      }
      if (portal_password !== confirm_portal_password) {
        message.error('Пароли не совпадают');
        return;
      }
    }

    const payload = isEdit
      ? rest
      : {
          ...rest,
          create_portal_account: !!create_portal_account,
          portal_password: create_portal_account ? portal_password : undefined,
        };

    try {
      if (isEdit) {
        await clientService.update(client.id, payload);
        message.success('Клиент обновлен');
      } else {
        await clientService.create(payload);
        message.success(
          create_portal_account
            ? 'Клиент создан. Доступ в личный кабинет выдан.'
            : 'Клиент создан'
        );
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

        {!isEdit && (
          <>
            <Alert
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
              message="Личный кабинет клиента"
              description="Клиент сможет войти на сайт и смотреть статус своих заказов (новый, в работе, готов и т.д.)."
            />
            <Form.Item
              name="create_portal_account"
              label="Выдать доступ в личный кабинет"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item noStyle shouldUpdate={(prev, cur) => prev.create_portal_account !== cur.create_portal_account}>
              {({ getFieldValue }) =>
                getFieldValue('create_portal_account') ? (
                  <>
                    <Form.Item
                      name="portal_password"
                      label="Пароль для входа"
                      rules={[{ required: true, message: 'Введите пароль' }, { min: 6, message: 'Минимум 6 символов' }]}
                    >
                      <Input.Password placeholder="Пароль для клиента" />
                    </Form.Item>
                    <Form.Item
                      name="confirm_portal_password"
                      label="Подтвердите пароль"
                      dependencies={['portal_password']}
                      rules={[
                        { required: true, message: 'Подтвердите пароль' },
                        ({ getFieldValue: gf }) => ({
                          validator(_, value) {
                            if (!value || gf('portal_password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Пароли не совпадают'));
                          },
                        }),
                      ]}
                    >
                      <Input.Password placeholder="Повторите пароль" />
                    </Form.Item>
                  </>
                ) : null
              }
            </Form.Item>
          </>
        )}

        {isEdit && client?.has_portal_account && (
          <Alert type="success" showIcon message="У клиента уже есть доступ в личный кабинет" />
        )}

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
