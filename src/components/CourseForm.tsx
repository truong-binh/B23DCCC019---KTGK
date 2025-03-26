import React, { useEffect } from 'react';
import { Form, Input, Select, Modal } from 'antd';
import type { Course, Instructor } from '@/models/courseModel';

interface CourseFormProps {
  visible: boolean;
  course?: Partial<Course>;
  instructors: Instructor[];
  onCancel: () => void;
  onSubmit: (values: Partial<Course>) => void;
}

const CourseForm: React.FC<CourseFormProps> = ({
  visible,
  course,
  instructors,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && course) {
      form.setFieldsValue(course);
    } else {
      form.resetFields();
    }
  }, [visible, course, form]);

  return (
    <Modal
      visible={visible}
      title={course ? 'Sửa khóa học' : 'Thêm khóa học mới'}
      onCancel={onCancel}
      onOk={() => form.submit()}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onSubmit(course ? { ...values, id: course.id } : values);
        }}
      >
        <Form.Item
          name="name"
          label="Tên khóa học"
          rules={[
            { required: true, message: 'Vui lòng nhập tên khóa học' },
            { max: 100, message: 'Tên khóa học tối đa 100 ký tự' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="instructor"
          label="Giảng viên"
          rules={[{ required: true, message: 'Vui lòng chọn giảng viên' }]}
        >
          <Select>
            {instructors.map(i => (
              <Select.Option key={i.id} value={i.name}>
                {i.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        >
          <Select>
            <Select.Option value="active">Đang mở</Select.Option>
            <Select.Option value="completed">Đã kết thúc</Select.Option>
            <Select.Option value="paused">Tạm dừng</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CourseForm;