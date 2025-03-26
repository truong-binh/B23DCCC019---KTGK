import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Table, Button, Modal, Form, Input, InputNumber, message, Popconfirm } from 'antd';
import { useModel } from 'umi';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';

const Services: React.FC = () => {
	const { services, setServices } = useModel('bookingSystem');
	const [visible, setVisible] = useState(false);
	const [editingService, setEditingService] = useState<any>(null);
	const [form] = Form.useForm();

	const handleSubmit = (values: any) => {
		if (editingService) {
			// Cập nhật dịch vụ
			setServices(services.map((service) => (service.id === editingService.id ? { ...service, ...values } : service)));
			message.success('Cập nhật dịch vụ thành công!');
		} else {
			// Thêm dịch vụ mới
			const newService = {
				id: uuidv4(),
				...values,
			};
			setServices([...services, newService]);
			message.success('Thêm dịch vụ thành công!');
		}
		setVisible(false);
		setEditingService(null);
		form.resetFields();
	};

	const handleEdit = (record: any) => {
		setEditingService(record);
		form.setFieldsValue(record);
		setVisible(true);
	};

	const handleDelete = (id: string) => {
		setServices(services.filter((service) => service.id !== id));
		message.success('Xóa dịch vụ thành công!');
	};

	const columns = [
		{
			title: 'Tên dịch vụ',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Giá (VNĐ)',
			dataIndex: 'price',
			key: 'price',
			render: (price: number) => price.toLocaleString('vi-VN'),
		},
		{
			title: 'Thời gian thực hiện (phút)',
			dataIndex: 'duration',
			key: 'duration',
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: any) => (
				<>
					<Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(record)}>
						Sửa
					</Button>
					<Popconfirm title='Bạn có chắc chắn muốn xóa?' onConfirm={() => handleDelete(record.id)}>
						<Button type='link' danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<PageContainer>
			<Card>
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => {
						setEditingService(null);
						form.resetFields();
						setVisible(true);
					}}
					style={{ marginBottom: 16 }}
				>
					Thêm dịch vụ mới
				</Button>
				<Table columns={columns} dataSource={services} rowKey='id' />

				<Modal
					title={editingService ? 'Sửa dịch vụ' : 'Thêm dịch vụ mới'}
					visible={visible}
					onOk={() => form.submit()}
					onCancel={() => {
						setVisible(false);
						setEditingService(null);
						form.resetFields();
					}}
				>
					<Form form={form} layout='vertical' onFinish={handleSubmit}>
						<Form.Item
							name='name'
							label='Tên dịch vụ'
							rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
						>
							<Input />
						</Form.Item>
						<Form.Item name='price' label='Giá (VNĐ)' rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}>
							<InputNumber
								style={{ width: '100%' }}
								formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
								min={0}
							/>
						</Form.Item>
						<Form.Item
							name='duration'
							label='Thời gian thực hiện (phút)'
							rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
						>
							<InputNumber style={{ width: '100%' }} min={1} />
						</Form.Item>
					</Form>
				</Modal>
			</Card>
		</PageContainer>
	);
};

export default Services;
