import { StudySession, Subject } from '@/types/study';
import { addSession, deleteSession, getSessions, getSubjects, updateSession } from '@/services/studyManager';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, Space, Table, DatePicker, InputNumber, message } from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment';
import './style.less';

const { TextArea } = Input;

const StudySessions: React.FC = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [visible, setVisible] = useState(false);
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const sessionsData = getSessions();
    const subjectsData = getSubjects();
    setSessions(sessionsData);
    setSubjects(subjectsData);
  };

  const handleSubmit = async (values: any) => {
    try {
      const sessionData = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
      };

      if (editingSession) {
        await updateSession(editingSession.id, sessionData);
        message.success('Cập nhật tiến độ học tập thành công!');
      } else {
        await addSession(sessionData);
        message.success('Thêm tiến độ học tập thành công!');
      }
      setVisible(false);
      form.resetFields();
      setEditingSession(null);
      loadData();
      
      // Trigger một custom event để thông báo thay đổi
      const event = new CustomEvent('sessionsUpdated');
      window.dispatchEvent(event);
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    }
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa tiến độ học tập này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteSession(id);
          message.success('Xóa tiến độ học tập thành công!');
          loadData();
        } catch (error) {
          message.error('Có lỗi xảy ra!');
        }
      },
    });
  };

  const handleEdit = (session: StudySession) => {
    setEditingSession(session);
    form.setFieldsValue({
      ...session,
      date: moment(session.date),
    });
    setVisible(true);
  };

  const columns = [
    {
      title: 'Môn học',
      dataIndex: 'subjectId',
      key: 'subjectId',
      render: (subjectId: string) => {
        const subject = subjects.find(s => s.id === subjectId);
        return subject?.name || 'Không xác định';
      },
    },
    {
      title: 'Ngày học',
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => moment(text).format('DD/MM/YYYY'),
    },
    {
      title: 'Thời lượng (phút)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Nội dung học',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      ellipsis: true,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: StudySession) => (
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
    <div className="study-sessions">
      <div className="study-sessions-header">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingSession(null);
            form.resetFields();
            setVisible(true);
          }}
        >
          Thêm tiến độ học tập
        </Button>
      </div>

      <Table
        dataSource={sessions}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingSession ? 'Sửa tiến độ học tập' : 'Thêm tiến độ học tập'}
        visible={visible}
        onCancel={() => {
          setVisible(false);
          setEditingSession(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText={editingSession ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
        width={600}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="subjectId"
            label="Môn học"
            rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
          >
            <Select placeholder="Chọn môn học">
              {subjects.map(subject => (
                <Select.Option key={subject.id} value={subject.id}>
                  {subject.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="Ngày học"
            rules={[{ required: true, message: 'Vui lòng chọn ngày học!' }]}
          >
            <DatePicker 
              style={{ width: '100%' }} 
              format="DD/MM/YYYY"
              placeholder="Chọn ngày học"
            />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Thời lượng (phút)"
            rules={[{ required: true, message: 'Vui lòng nhập thời lượng học!' }]}
          >
            <InputNumber
              min={1}
              style={{ width: '100%' }}
              placeholder="Nhập thời lượng học"
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung học"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung học!' }]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập nội dung đã học"
            />
          </Form.Item>

          <Form.Item
            name="note"
            label="Ghi chú"
          >
            <TextArea
              rows={2}
              placeholder="Nhập ghi chú (nếu có)"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StudySessions;