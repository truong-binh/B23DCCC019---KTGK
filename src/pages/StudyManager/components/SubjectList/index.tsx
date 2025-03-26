import { Subject } from '@/types/study';
import { addSubject, deleteSubject, getSubjects, updateSubject } from '@/services/studyManager';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Space, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import './style.less';

const SubjectList: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [visible, setVisible] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [form] = Form.useForm();

  // Load subjects khi component mount
  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = () => {
    const data = getSubjects();
    setSubjects(data);
  };

  // Xử lý thêm/sửa môn học
  const handleSubmit = async (values: { name: string }) => {
    try {
      if (editingSubject) {
        // Cập nhật môn học
        await updateSubject(editingSubject.id, values.name);
        message.success('Cập nhật môn học thành công!');
      } else {
        // Thêm môn học mới
        await addSubject(values.name);
        message.success('Thêm môn học thành công!');
      }
      setVisible(false);
      form.resetFields();
      setEditingSubject(null);
      loadSubjects();
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    }
  };

  // Xử lý xóa môn học
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa môn học này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteSubject(id);
          message.success('Xóa môn học thành công!');
          loadSubjects();
        } catch (error) {
          message.error('Có lỗi xảy ra!');
        }
      },
    });
  };

  // Mở modal để sửa
  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    form.setFieldsValue({ name: subject.name });
    setVisible(true);
  };

  // Columns cho Table
  const columns = [
    {
      title: 'Tên môn học',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Subject) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="subject-list">
      <div className="subject-list-header">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingSubject(null);
            form.resetFields();
            setVisible(true);
          }}
        >
          Thêm môn học
        </Button>
      </div>

      <Table
        dataSource={subjects}
        columns={columns}
        rowKey="id"
        pagination={false}
      />

      <Modal
        title={editingSubject ? 'Sửa môn học' : 'Thêm môn học'}
        visible={visible}
        onCancel={() => {
          setVisible(false);
          setEditingSubject(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText={editingSubject ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
      >
        <Form 
          form={form} 
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên môn học"
            rules={[{ required: true, message: 'Vui lòng nhập tên môn học!' }]}
          >
            <Input placeholder="Nhập tên môn học" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SubjectList;