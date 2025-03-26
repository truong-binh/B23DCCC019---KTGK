import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Table, Button, Modal, Form, Input, Select, DatePicker, TimePicker, message, Rate, Tag } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const Appointments: React.FC = () => {
	const { appointments, setAppointments, services, staff, reviews, setReviews } = useModel('bookingSystem');
	const [visible, setVisible] = useState(false);
	const [form] = Form.useForm();

	const checkAvailability = (values: any) => {
		const date = values.date.format('YYYY-MM-DD');
		const time = values.time.format('HH:mm');
		const selectedStaff = staff.find((s) => s.id === values.staffId);

		if (!selectedStaff) {
			message.error('Không tìm thấy thông tin nhân viên!');
			return false;
		}

		// 1. Kiểm tra ngày làm việc của nhân viên
		const dayOfWeek = values.date.day(); // 0 = Chủ nhật, 1-6 = Thứ 2-7
		const workingHour = selectedStaff.workingHours.find((wh) => wh.dayOfWeek === dayOfWeek);

		if (!workingHour) {
			message.error('Nhân viên không làm việc vào ngày này!');
			return false;
		}

		// 2. Kiểm tra giờ làm việc
		const appointmentTime = moment(time, 'HH:mm');
		const startTime = moment(workingHour.startTime, 'HH:mm');
		const endTime = moment(workingHour.endTime, 'HH:mm');

		if (appointmentTime.isBefore(startTime) || appointmentTime.isAfter(endTime)) {
			message.error('Thời gian đặt lịch nằm ngoài giờ làm việc của nhân viên!');
			return false;
		}

		// 3. Kiểm tra số lượng khách trong ngày
		const appointmentsInDay = appointments.filter(
			(app) => app.staffId === values.staffId && app.date === date && ['pending', 'confirmed'].includes(app.status),
		);

		if (appointmentsInDay.length >= selectedStaff.maxCustomersPerDay) {
			message.error('Nhân viên đã đạt số lượng khách tối đa trong ngày!');
			return false;
		}

		// 4. Kiểm tra trùng lịch
		const selectedService = services.find((s) => s.id === values.serviceId);
		if (!selectedService) {
			message.error('Không tìm thấy thông tin dịch vụ!');
			return false;
		}

		const appointmentEndTime = moment(time, 'HH:mm').add(selectedService.duration, 'minutes');

		const hasConflict = appointmentsInDay.some((app) => {
			const existingAppointmentTime = moment(app.time, 'HH:mm');
			const existingService = services.find((s) => s.id === app.serviceId);
			if (!existingService) return false;

			const existingAppointmentEndTime = moment(app.time, 'HH:mm').add(existingService.duration, 'minutes');

			return (
				appointmentTime.isBetween(existingAppointmentTime, existingAppointmentEndTime, undefined, '[)') ||
				appointmentEndTime.isBetween(existingAppointmentTime, existingAppointmentEndTime, undefined, '(]') ||
				existingAppointmentTime.isBetween(appointmentTime, appointmentEndTime, undefined, '[)') ||
				existingAppointmentEndTime.isBetween(appointmentTime, appointmentEndTime, undefined, '(]')
			);
		});

		if (hasConflict) {
			message.error('Thời gian này đã có lịch hẹn khác!');
			return false;
		}

		return true;
	};

	const handleSubmit = async (values: any) => {
		if (!checkAvailability(values)) {
			return;
		}

		const newAppointment = {
			id: uuidv4(),
			...values,
			date: values.date.format('YYYY-MM-DD'),
			time: values.time.format('HH:mm'),
			status: 'pending',
			createdAt: new Date().toISOString(),
		};

		setAppointments([...appointments, newAppointment]);
		message.success('Đặt lịch thành công!');
		setVisible(false);
		form.resetFields();
	};

	const handleComplete = (record: any) => {
		setAppointments(appointments.map((app) => (app.id === record.id ? { ...app, status: 'completed' } : app)));
		message.success('Đã hoàn thành lịch hẹn!');
	};

	const handleReview = (record: any) => {
		Modal.confirm({
			title: 'Đánh giá dịch vụ',
			content: (
				<Form form={form}>
					<Form.Item name='rating' label='Đánh giá'>
						<Rate />
					</Form.Item>
					<Form.Item name='comment' label='Nhận xét'>
						<Input.TextArea rows={4} />
					</Form.Item>
				</Form>
			),
			onOk: async () => {
				const values = await form.validateFields();
				const newReview = {
					id: uuidv4(),
					appointmentId: record.id,
					rating: values.rating,
					comment: values.comment,
					createdAt: new Date().toISOString(),
				};
				setReviews([...reviews, newReview]);
				message.success('Đánh giá thành công!');
				form.resetFields();
			},
		});
	};

	const handleCancel = (record: any) => {
		Modal.confirm({
			title: 'Xác nhận hủy lịch hẹn',
			icon: <ExclamationCircleOutlined />,
			content: 'Bạn có chắc chắn muốn hủy lịch hẹn này không?',
			okText: 'Đồng ý',
			cancelText: 'Hủy',
			onOk: () => {
				setAppointments(appointments.map((app) => (app.id === record.id ? { ...app, status: 'cancelled' } : app)));
				message.success('Đã hủy lịch hẹn!');
			},
		});
	};

	const columns = [
		{
			title: 'Khách hàng',
			dataIndex: 'customerName',
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'customerPhone',
		},
		{
			title: 'Dịch vụ',
			dataIndex: 'serviceId',
			render: (serviceId: string) => services.find((s) => s.id === serviceId)?.name,
		},
		{
			title: 'Nhân viên',
			dataIndex: 'staffId',
			render: (staffId: string) => staff.find((s) => s.id === staffId)?.name,
		},
		{
			title: 'Ngày',
			dataIndex: 'date',
		},
		{
			title: 'Giờ',
			dataIndex: 'time',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			render: (status: string) => {
				const statusMap = {
					pending: 'Chờ duyệt',
					confirmed: 'Đã xác nhận',
					completed: 'Hoàn thành',
					cancelled: 'Đã hủy',
				};
				return <Tag color={getStatusColor(status)}>{statusMap[status as keyof typeof statusMap]}</Tag>;
			},
			filters: [
				{ text: 'Chờ duyệt', value: 'pending' },
				{ text: 'Đã xác nhận', value: 'confirmed' },
				{ text: 'Hoàn thành', value: 'completed' },
				{ text: 'Đã hủy', value: 'cancelled' },
			],
			onFilter: (value: string, record) => record.status === value,
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (_, record) => {
				const actions = [];

				switch (record.status) {
					case 'pending':
						actions.push(
							<Button
								key='confirm'
								type='link'
								onClick={() => {
									setAppointments(
										appointments.map((app) => (app.id === record.id ? { ...app, status: 'confirmed' } : app)),
									);
									message.success('Đã xác nhận lịch hẹn!');
								}}
							>
								Xác nhận
							</Button>,
							<Button key='cancel' type='link' danger onClick={() => handleCancel(record)}>
								Hủy
							</Button>,
						);
						break;
					case 'confirmed':
						actions.push(
							<Button key='complete' type='link' onClick={() => handleComplete(record)}>
								Hoàn thành
							</Button>,
							<Button key='cancel' type='link' danger onClick={() => handleCancel(record)}>
								Hủy
							</Button>,
						);
						break;
					case 'completed':
						if (!reviews.find((r) => r.appointmentId === record.id)) {
							actions.push(
								<Button key='review' type='link' onClick={() => handleReview(record)}>
									Đánh giá
								</Button>,
							);
						}
						break;
					case 'cancelled':
						actions.push(<Tag color='red'>Đã hủy</Tag>);
						break;
				}

				return actions;
			},
		},
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'pending':
				return 'orange';
			case 'confirmed':
				return 'blue';
			case 'completed':
				return 'green';
			case 'cancelled':
				return 'red';
			default:
				return 'default';
		}
	};

	return (
		<PageContainer>
			<Card>
				<Button type='primary' onClick={() => setVisible(true)}>
					Đặt lịch mới
				</Button>
				<Table columns={columns} dataSource={appointments} rowKey='id' pagination={{ pageSize: 10 }} />
			</Card>

			<Modal title='Đặt lịch hẹn' visible={visible} onCancel={() => setVisible(false)} onOk={() => form.submit()}>
				<Form form={form} onFinish={handleSubmit}>
					<Form.Item name='customerName' label='Tên khách hàng' rules={[{ required: true }]}>
						<Input />
					</Form.Item>

					<Form.Item name='customerPhone' label='Số điện thoại' rules={[{ required: true }]}>
						<Input />
					</Form.Item>

					<Form.Item name='serviceId' label='Dịch vụ' rules={[{ required: true }]}>
						<Select>
							{services.map((service) => (
								<Select.Option key={service.id} value={service.id}>
									{service.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item name='staffId' label='Nhân viên' rules={[{ required: true }]}>
						<Select>
							{staff.map((s) => (
								<Select.Option key={s.id} value={s.id}>
									{s.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item name='date' label='Ngày' rules={[{ required: true }]}>
						<DatePicker />
					</Form.Item>

					<Form.Item name='time' label='Giờ' rules={[{ required: true }]}>
						<TimePicker format='HH:mm' />
					</Form.Item>
				</Form>
			</Modal>
		</PageContainer>
	);
};

export default Appointments;
