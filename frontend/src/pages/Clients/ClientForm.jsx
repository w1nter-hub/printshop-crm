import { useEffect } from 'react';
import { Modal, Form, Input, message, Switch, Alert, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import clientService from '../../services/clientService';
import { formatApiError } from '../../utils/formatApiError';

const generatePortalPassword = () => {
  const part = Math.random().toString(36).slice(2, 8);
  return `Ps${part}1`;
};

const showPortalCredentials = ({ email, password, fullName }) => {
  const siteUrl = window.location.origin;

  Modal.success({
    title: 'Клиент создан — доступ в личный кабинет',
    width: 520,
    content: (
      <div style={{ marginTop: 12 }}>
        <p>
          Передайте клиенту <strong>{fullName}</strong> данные для входа (устно, в мессенджере или на бумаге):
        </p>
        <p>
          <strong>Сайт:</strong> {siteUrl}
          <br />
          <strong>Email:</strong> {email}
          <br />
          <strong>Пароль:</strong> {password}
        </p>
        <p style={{ color: '#666', fontSize: 13, marginBottom: 0 }}>
          Пароль задаётся вами при создании клиента. Сохраните его сейчас — позже посмотреть в системе нельзя.
        </p>
      </div>
    ),
    okText: 'Понятно',
    onOk: () => {
      const text = `PrintShop CRM\nСайт: ${siteUrl}\nEmail: ${email}\nПароль: ${password}`;
      navigator.clipboard?.writeText(text).then(() => {
        message.success('Данные для входа скопированы в буфер обмена');
      });
    },
  });
};

const ClientForm = ({ visible, onCancel, onSuccess, client }) => {
  const [form] = Form.useForm();
  const isEdit = !!client;
  const createPortal = Form.useWatch('create_portal_account', form);

  useEffect(() => {
    if (visible) {
      if (client) {
        form.setFieldsValue({
          ...client,
          create_portal_account: false,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ create_portal_account: true });
      }
    }
  }, [visible, client, form]);

  const handleGeneratePassword = () => {
    const pwd = generatePortalPassword();
    form.setFieldsValue({
      portal_password: pwd,
      confirm_portal_password: pwd,
    });
    message.info('Пароль сгенерирован — передайте его клиенту после сохранения');
  };

  const handleSubmit = async (values) => {
    const {
      create_portal_account,
      portal_password,
      confirm_portal_password,
      ...rest
    } = values;

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
        if (create_portal_account) {
          showPortalCredentials({
            email: rest.email,
            password: portal_password,
            fullName: rest.full_name,
          });
        } else {
          message.success('Клиент создан (без доступа в личный кабинет)');
        }
      }
      form.resetFields();
      onSuccess();
    } catch (error) {
      message.error('Ошибка: ' + formatApiError(error));
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
      width={640}
      styles={{ body: { maxHeight: '70vh', overflowY: 'auto' } }}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
            { min: 10, message: 'Минимум 10 символов' },
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
              description="Включите доступ, задайте пароль и передайте его клиенту. Клиент войдёт на сайт и увидит статус своих заказов."
            />
            <Form.Item
              name="create_portal_account"
              label="Выдать доступ в личный кабинет"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            {createPortal && (
              <>
                <Form.Item
                  name="portal_password"
                  label="Пароль для входа клиента"
                  rules={[
                    { required: true, message: 'Введите пароль' },
                    { min: 6, message: 'Минимум 6 символов' },
                  ]}
                  extra="Этот пароль вы передаёте клиенту. После создания покажем его ещё раз в окне."
                >
                  <Input.Password placeholder="Придумайте или сгенерируйте пароль" />
                </Form.Item>
                <Form.Item>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={handleGeneratePassword}
                    type="dashed"
                  >
                    Сгенерировать пароль
                  </Button>
                </Form.Item>
                <Form.Item
                  name="confirm_portal_password"
                  label="Подтвердите пароль"
                  dependencies={['portal_password']}
                  rules={[
                    { required: true, message: 'Подтвердите пароль' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('portal_password') === value) {
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
            )}
          </>
        )}

        {isEdit && client?.has_portal_account && (
          <Alert
            type="success"
            showIcon
            style={{ marginBottom: 16 }}
            message="У клиента уже есть доступ в личный кабинет"
            description="Вход по email клиента и паролю, который вы выдавали при создании."
          />
        )}

        <Form.Item name="company" label="Компания">
          <Input placeholder="ТОО Компания" />
        </Form.Item>

        <Form.Item name="address" label="Адрес">
          <Input.TextArea rows={2} placeholder="Адрес клиента" />
        </Form.Item>

        <Form.Item name="notes" label="Заметки">
          <Input.TextArea rows={3} placeholder="Дополнительная информация о клиенте" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ClientForm;
