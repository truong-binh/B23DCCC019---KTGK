import { MonthlyGoal, Subject } from '@/types/study';
import { addGoal, deleteGoal, getGoals, getSubjects, updateGoal, calculateProgress, getSessions } from '@/services/studyManager';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Select, Table, InputNumber, Progress, Space, DatePicker, message } from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment';
import './style.less';

const MonthlyGoals: React.FC = () => {
  const [goals, setGoals] = useState<MonthlyGoal[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [visible, setVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState<MonthlyGoal | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
    
    const interval = setInterval(() => {
      setRefreshKey(oldKey => oldKey + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const loadData = () => {
    const goalsData = getGoals();
    const subjectsData = getSubjects();
    setGoals(goalsData);
    setSubjects(subjectsData);
  };

  const handleSubmit = async (values: any) => {
    try {
      const goalData = {
        ...values,
        month: moment(values.month).format('YYYY-MM'),
      };

      if (editingGoal) {
        await updateGoal(editingGoal.id, goalData);
        message.success('Cập nhật mục tiêu thành công!');
      } else {
        await addGoal(goalData);
        message.success('Thêm mục tiêu thành công!');
      }
      setVisible(false);
      form.resetFields();
      setEditingGoal(null);
      loadData();
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    }
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa mục tiêu này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteGoal(id);
          message.success('Xóa mục tiêu thành công!');
          loadData();
        } catch (error) {
          message.error('Có lỗi xảy ra!');
        }
      },
    });
  };

  const handleEdit = (goal: MonthlyGoal) => {
    setEditingGoal(goal);
    form.setFieldsValue({
      ...goal,
      month: moment(goal.month),
    });
    setVisible(true);
  };

  const columns = [
    {
      title: 'Tháng',
      dataIndex: 'month',
      key: 'month',
      render: (text: string) => moment(text).format('MM/YYYY'),
    },
    {
      title: 'Môn học',
      dataIndex: 'subjectId',
      key: 'subjectId',
      render: (subjectId: string) => {
        if (!subjectId) return 'Tổng thời gian học';
        const subject = subjects.find(s => s.id === subjectId);
        return subject?.name || 'Không xác định';
      },
    },
    {
      title: 'Mục tiêu (giờ)',
      dataIndex: 'targetHours',
      key: 'targetHours',
    },
    {
      title: 'Tiến độ',
      key: 'progress',
      render: (_, record: MonthlyGoal) => {
        const progress = calculateProgress(record.subjectId, record.month);
        
        const sessions = getSessions();
        const monthSessions = sessions.filter((session) => {
          const sessionMonth = moment(session.date).format('YYYY-MM');
          if (record.subjectId) {
            return sessionMonth === record.month && session.subjectId === record.subjectId;
          }
          return sessionMonth === record.month;
        });
        
        const hoursCompleted = monthSessions.reduce((sum, session) => {
          return sum + (session.duration / 60);
        }, 0);

        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Progress
              percent={Math.round(progress)}
              status={progress >= 100 ? 'success' : 'active'}
              format={percent => `${percent}%`}
            />
            <span style={{ fontSize: '12px', color: '#666' }}>
              Đã học: {hoursCompleted.toFixed(1)}/{record.targetHours} giờ
            </span>
          </Space>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: MonthlyGoal) => (
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
    <div className="monthly-goals">
      <div className="monthly-goals-header">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingGoal(null);
            form.resetFields();
            setVisible(true);
          }}
        >
          Thêm mục tiêu tháng
        </Button>
      </div>

      <Table
        dataSource={goals}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingGoal ? 'Sửa mục tiêu' : 'Thêm mục tiêu'}
        visible={visible}
        onCancel={() => {
          setVisible(false);
          setEditingGoal(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText={editingGoal ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="month"
            label="Tháng"
            rules={[{ required: true, message: 'Vui lòng chọn tháng!' }]}
          >
            <DatePicker
              picker="month"
              style={{ width: '100%' }}
              format="MM/YYYY"
              placeholder="Chọn tháng"
            />
          </Form.Item>

          <Form.Item
            name="subjectId"
            label="Môn học"
          >
            <Select placeholder="Chọn môn học (để trống nếu là mục tiêu tổng)">
              {subjects.map(subject => (
                <Select.Option key={subject.id} value={subject.id}>
                  {subject.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="targetHours"
            label="Mục tiêu (giờ)"
            rules={[{ required: true, message: 'Vui lòng nhập số giờ mục tiêu!' }]}
          >
            <InputNumber
              min={1}
              style={{ width: '100%' }}
              placeholder="Nhập số giờ mục tiêu"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MonthlyGoals;