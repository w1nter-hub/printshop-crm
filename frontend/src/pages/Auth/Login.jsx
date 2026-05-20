import { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import './Login.css';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = await authService.login(values.email, values.password);
      message.success('Вход выполнен успешно!');
      const home =
        data.user?.role === 'client' ? '/portal' : '/dashboard';
      navigate(home);
    } catch (error) {
      message.error('Ошибка входа: ' + (error.response?.data?.detail || 'Неверный email или пароль'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card" title="Вход в PrintShop CRM">
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Введите email!' },
              { type: 'email', message: 'Введите корректный email!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Email" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Введите пароль!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Пароль"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              Войти
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: 16, color: '#666', fontSize: 13 }}>
            Клиентам доступ выдаёт менеджер при создании карточки клиента.
            <br />
            Сотрудникам: <Link to="/register">регистрация</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
