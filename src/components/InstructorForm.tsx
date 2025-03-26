import React, { useEffect } from 'react';
import { Form, Input, Modal } from 'antd';
import type { Instructor } from '@/models/courseModel';

interface InstructorFormProps {
  visible: boolean;
  instructor?: Partial<Instructor>;
  onCancel: () => void;
  onSubmit: (values: Partial<Instructor>) => void;
}

const InstructorForm: React.FC<InstructorFormProps> = ({
  visible,
  instructor,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && instructor) {
      form.setFieldsValue(instructor);
    } else {
      form.resetFields();
    }
  }, [visible, instructor, form]);

  return (
    <Modal
      visible={visible}
      title={instructor ? 'Sửa giảng viên' : 'Thêm giảng viên mới'}
      onCancel={onCancel}
      onOk={() => form.submit()}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onSubmit(instructor ? { ...values, id: instructor.id } : values);
        }}
      >
        <Form.Item
          name="name"
          label="Tên giảng viên"
          rules={[{ required: true, message: 'Vui lòng nhập tên giảng viên' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' }
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InstructorForm;