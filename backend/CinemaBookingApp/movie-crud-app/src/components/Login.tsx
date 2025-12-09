import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined, VideoCameraOutlined } from '@ant-design/icons';
import type { LoginRequestDTO } from '../types/auth.types';
import { authService } from '../services/authService';

const { Title, Text, Link } = Typography;

interface LoginProps {
  onLoginSuccess: () => void;
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form] = Form.useForm();

  const handleSubmit = async (values: LoginRequestDTO) => {
    setLoading(true);
    setError('');

    try {
      await authService.login(values);
      onLoginSuccess();
    } catch (err) {
      setError('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1C1C2E 0%, #2A2A3E 100%)',
      padding: '20px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: 450,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <VideoCameraOutlined style={{ fontSize: 48, color: '#FF5757', marginBottom: 16 }} />
            <Title level={2} style={{ margin: 0 }}>Đăng nhập</Title>
            <Text type="secondary">Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.</Text>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              onClose={() => setError('')}
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
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
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                block
                style={{ height: 48 }}
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <Text>Chưa có tài khoản? </Text>
              <Link onClick={onSwitchToRegister}>Đăng ký ngay</Link>
            </div>
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default Login;
