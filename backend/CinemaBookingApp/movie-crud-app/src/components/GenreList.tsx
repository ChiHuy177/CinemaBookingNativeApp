import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Typography, message, Popconfirm, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TagsOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { GenreDTO, CreateGenreDTO, UpdateGenreDTO } from '../types/genre.types';
import { genreService } from '../services/genreService';

const { Title } = Typography;

const GenreList: React.FC = () => {
  const [genres, setGenres] = useState<GenreDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGenre, setEditingGenre] = useState<GenreDTO | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    try {
      setLoading(true);
      const data = await genreService.getAllGenres();
      setGenres(data);
    } catch (error) {
      message.error('Không thể tải danh sách thể loại');
      console.error('Error loading genres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingGenre(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (genre: GenreDTO) => {
    setEditingGenre(genre);
    form.setFieldsValue({ name: genre.name });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await genreService.deleteGenre(id);
      message.success('Xóa thể loại thành công!');
      loadGenres();
    } catch (error) {
      message.error('Không thể xóa thể loại');
      console.error('Error deleting genre:', error);
    }
  };

  const handleSubmit = async (values: { name: string }) => {
    try {
      if (editingGenre) {
        const updateData: UpdateGenreDTO = { name: values.name };
        await genreService.updateGenre(editingGenre.genreId, updateData);
        message.success('Cập nhật thể loại thành công!');
      } else {
        const createData: CreateGenreDTO = { name: values.name };
        await genreService.createGenre(createData);
        message.success('Tạo thể loại mới thành công!');
      }
      setModalVisible(false);
      form.resetFields();
      loadGenres();
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại.');
      console.error('Error submitting form:', error);
    }
  };

  const columns: ColumnsType<GenreDTO> = [
    {
      title: 'ID',
      dataIndex: 'genreId',
      key: 'genreId',
      width: 80,
    },
    {
      title: 'Tên thể loại',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <TagsOutlined style={{ color: '#FF5757' }} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa thể loại"
            description="Bạn có chắc chắn muốn xóa thể loại này?"
            onConfirm={() => handleDelete(record.genreId)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>
            <TagsOutlined style={{ marginRight: 12 }} />
            Quản lý Thể loại
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            size="large"
          >
            Thêm thể loại mới
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={genres}
          rowKey="genreId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} thể loại`,
          }}
        />

        <Modal
          title={editingGenre ? 'Chỉnh sửa thể loại' : 'Thêm thể loại mới'}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
          }}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="name"
              label="Tên thể loại"
              rules={[{ required: true, message: 'Vui lòng nhập tên thể loại!' }]}
            >
              <Input placeholder="Ví dụ: Hành động, Hài hước..." />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={() => {
                  setModalVisible(false);
                  form.resetFields();
                }}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingGenre ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </Card>
  );
};

export default GenreList;
