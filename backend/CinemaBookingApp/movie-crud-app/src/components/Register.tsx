import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Space, Select, DatePicker, Row, Col, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined, EnvironmentOutlined, UserAddOutlined } from '@ant-design/icons';
import type { RegisterRequestDTO } from '../types/auth.types';
import { authService } from '../services/authService';
import dayjs from 'dayjs';

const { Title, Text, Link } = Typography;
const { Option } = Select;

interface RegisterProps {
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    setLoading(true);
    setError('');

    try {
      const registerData: RegisterRequestDTO = {
        ...values,
        dateOfBirth: values.dateOfBirth.toISOString(),
      };

      await authService.register(registerData);
      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      setTimeout(() => {
        onRegisterSuccess();
      }, 1500);
    } catch (err) {
      setError('Đăng ký thất bại. Email có thể đã được sử dụng.');
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  const disabledDate = (current: dayjs.Dayjs) => {
    const minAge = dayjs().subtract(13, 'year');
    return current && current.isAfter(minAge);
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
          maxWidth: 800,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <UserAddOutlined style={{ fontSize: 48, color: '#FF5757', marginBottom: 16 }} />
            <Title level={2} style={{ margin: 0 }}>Đăng ký</Title>
            <Text type="secondary">Tạo tài khoản mới để trải nghiệm dịch vụ của chúng tôi</Text>
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
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="name"
                  label="Họ và tên"
                  rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="phoneNumber"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                    { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số!' }
                  ]}
                >
                  <Input prefix={<PhoneOutlined />} placeholder="0123456789" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="example@email.com" />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="dateOfBirth"
                  label="Ngày sinh"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder="Chọn ngày sinh"
                    disabledDate={disabledDate}
                    format="DD/MM/YYYY"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="gender"
                  label="Giới tính"
                  rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                >
                  <Select placeholder="Chọn giới tính">
                    <Option value="Nam">Nam</Option>
                    <Option value="Nữ">Nữ</Option>
                    <Option value="Khác">Khác</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="city"
                  label="Thành phố"
                  rules={[{ required: true, message: 'Vui lòng nhập thành phố!' }]}
                >
                  <Input prefix={<EnvironmentOutlined />} placeholder="Hà Nội" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="address"
                  label="Địa chỉ"
                  rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                >
                  <Input prefix={<HomeOutlined />} placeholder="123 Đường ABC" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="confirmPassword"
                  label="Xác nhận mật khẩu"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Mật khẩu không khớp!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                block
                style={{ height: 48 }}
              >
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <Text>Đã có tài khoản? </Text>
              <Link onClick={onSwitchToLogin}>Đăng nhập ngay</Link>
            </div>
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default Register;
