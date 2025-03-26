import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {
	Card,
	Table,
	Button,
	Modal,
	Form,
	Input,
	InputNumber,
	Select,
	TimePicker,
	message,
	Popconfirm,
	Tag,
	Row,
	Col,
} from 'antd';
import { useModel } from 'umi';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

const { Option } = Select;

const Staff: React.FC = () => {
	const { staff, setStaff, services } = useModel('bookingSystem');
	const [visible, setVisible] = useState(false);
	const [editingStaff, setEditingStaff] = useState<any>(null);
	const [form] = Form.useForm();

	const daysOfWeek = [
		{ value: 0, label: 'Chủ nhật' },
		{ value: 1, label: 'Thứ 2' },
		{ value: 2, label: 'Thứ 3' },
		{ value: 3, label: 'Thứ 4' },
		{ value: 4, label: 'Thứ 5' },
		{ value: 5, label: 'Thứ 6' },
		{ value: 6, label: 'Thứ 7' },
	];

	const handleSubmit = (values: any) => {
		const workingHours = values.workingHours.map((wh: any) => ({
			dayOfWeek: wh.dayOfWeek,
			startTime: wh.time?.[0]?.format('HH:mm') || '00:00',
			endTime: wh.time?.[1]?.format('HH:mm') || '00:00',
		}));

		const staffData = {
			...values,
			workingHours,
		};

		if (editingStaff) {
			setStaff(staff.map((s) => (s.id === editingStaff.id ? { ...s, ...staffData } : s)));
			message.success('Cập nhật nhân viên thành công!');
		} else {
			const newStaff = {
				id: uuidv4(),
				...staffData,
			};
			setStaff([...staff, newStaff]);
			message.success('Thêm nhân viên thành công!');
		}
		setVisible(false);
		setEditingStaff(null);
		form.resetFields();
	};

	const handleEdit = (record: any) => {
		const formData = {
			...record,
			workingHours: record.workingHours.map((wh: any) => ({
				dayOfWeek: wh.dayOfWeek,
				time: [moment(wh.startTime, 'HH:mm'), moment(wh.endTime, 'HH:mm')],
			})),
		};
		setEditingStaff(record);
		form.setFieldsValue(formData);
		setVisible(true);
	};

	const handleDelete = (id: string) => {
		setStaff(staff.filter((s) => s.id !== id));
		message.success('Xóa nhân viên thành công!');
	};

	const columns = [
		{
			title: 'Tên nhân viên',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Số khách tối đa/ngày',
			dataIndex: 'maxCustomersPerDay',
			key: 'maxCustomersPerDay',
		},
		{
			title: 'Dịch vụ đảm nhận',
			dataIndex: 'services',
			key: 'services',
			render: (serviceIds: string[]) => (
				<>
					{serviceIds.map((serviceId) => {
						const service = services.find((s) => s.id === serviceId);
						return service ? <Tag key={serviceId}>{service.name}</Tag> : null;
					})}
				</>
			),
		},
		{
			title: 'Lịch làm việc',
			dataIndex: 'workingHours',
			key: 'workingHours',
			render: (workingHours: any[]) => (
				<>
					{workingHours.map((wh) => (
						<div key={wh.dayOfWeek}>
							{daysOfWeek.find((d) => d.value === wh.dayOfWeek)?.label}: {wh.startTime} - {wh.endTime}
						</div>
					))}
				</>
			),
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
						setEditingStaff(null);
						form.resetFields();
						setVisible(true);
					}}
					style={{ marginBottom: 16 }}
				>
					Thêm nhân viên mới
				</Button>
				<Table columns={columns} dataSource={staff} rowKey='id' />

				<Modal
					title={editingStaff ? 'Sửa thông tin nhân viên' : 'Thêm nhân viên mới'}
					visible={visible}
					onOk={() => form.submit()}
					onCancel={() => {
						setVisible(false);
						setEditingStaff(null);
						form.resetFields();
					}}
					width={800}
				>
					<Form form={form} layout='vertical' onFinish={handleSubmit}>
						<Form.Item
							name='name'
							label='Tên nhân viên'
							rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên!' }]}
						>
							<Input />
						</Form.Item>

						<Form.Item
							name='maxCustomersPerDay'
							label='Số khách tối đa/ngày'
							rules={[{ required: true, message: 'Vui lòng nhập số khách tối đa!' }]}
						>
							<InputNumber style={{ width: '100%' }} min={1} />
						</Form.Item>

						<Form.Item
							name='services'
							label='Dịch vụ đảm nhận'
							rules={[{ required: true, message: 'Vui lòng chọn dịch vụ!' }]}
						>
							<Select mode='multiple'>
								{services.map((service) => (
									<Option key={service.id} value={service.id}>
										{service.name}
									</Option>
								))}
							</Select>
						</Form.Item>

						<Form.List name='workingHours' initialValue={[{}]}>
							{(fields, { add, remove }) => (
								<>
									{fields.map((field, index) => (
										<Card
											key={field.key}
											size='small'
											title={`Ca làm việc ${index + 1}`}
											extra={
												fields.length > 1 && (
													<Button type='link' danger onClick={() => remove(field.name)}>
														Xóa ca
													</Button>
												)
											}
											style={{ marginBottom: 16 }}
										>
											<Row gutter={16}>
												<Col span={8}>
													<Form.Item
														{...field}
														label='Ngày làm việc'
														name={[field.name, 'dayOfWeek']}
														rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
													>
														<Select placeholder='Chọn ngày'>
															{daysOfWeek.map((day) => (
																<Option key={day.value} value={day.value}>
																	{day.label}
																</Option>
															))}
														</Select>
													</Form.Item>
												</Col>
												<Col span={16}>
													<Form.Item
														{...field}
														label='Thời gian làm việc'
														name={[field.name, 'time']}
														rules={[{ required: true, message: 'Vui lòng chọn giờ làm việc!' }]}
													>
														<TimePicker.RangePicker
															format='HH:mm'
															style={{ width: '100%' }}
															placeholder={['Giờ bắt đầu', 'Giờ kết thúc']}
														/>
													</Form.Item>
												</Col>
											</Row>
										</Card>
									))}
									<Form.Item>
										<Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
											Thêm ca làm việc
										</Button>
									</Form.Item>
								</>
							)}
						</Form.List>
					</Form>
				</Modal>
			</Card>
		</PageContainer>
	);
};

export default Staff;
