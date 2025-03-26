import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Table, Rate, Button, Modal, Form, Input, message } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';

const Reviews: React.FC = () => {
	const { reviews, setReviews, appointments, staff } = useModel('bookingSystem');
	const [replyVisible, setReplyVisible] = useState(false);
	const [selectedReview, setSelectedReview] = useState<any>(null);
	const [form] = Form.useForm();

	const handleReply = (record: any) => {
		setSelectedReview(record);
		form.setFieldsValue({ staffResponse: record.staffResponse });
		setReplyVisible(true);
	};

	const submitReply = (values: any) => {
		setReviews(
			reviews.map((review) =>
				review.id === selectedReview.id ? { ...review, staffResponse: values.staffResponse } : review,
			),
		);
		message.success('Phản hồi đánh giá thành công!');
		setReplyVisible(false);
		setSelectedReview(null);
		form.resetFields();
	};

	const columns = [
		{
			title: 'Khách hàng',
			dataIndex: 'appointmentId',
			key: 'customer',
			render: (appointmentId: string) => {
				const appointment = appointments.find((a) => a.id === appointmentId);
				return appointment?.customerName || 'N/A';
			},
		},
		{
			title: 'Nhân viên',
			dataIndex: 'appointmentId',
			key: 'staff',
			render: (appointmentId: string) => {
				const appointment = appointments.find((a) => a.id === appointmentId);
				const staffMember = staff.find((s) => s.id === appointment?.staffId);
				return staffMember?.name || 'N/A';
			},
		},
		{
			title: 'Đánh giá',
			dataIndex: 'rating',
			key: 'rating',
			render: (rating: number) => <Rate disabled defaultValue={rating} />,
		},
		{
			title: 'Nhận xét',
			dataIndex: 'comment',
			key: 'comment',
		},
		{
			title: 'Phản hồi',
			dataIndex: 'staffResponse',
			key: 'staffResponse',
			render: (response: string, record: any) => (
				<>
					{response || (
						<Button type='link' onClick={() => handleReply(record)}>
							Thêm phản hồi
						</Button>
					)}
				</>
			),
		},
		{
			title: 'Thời gian',
			dataIndex: 'createdAt',
			key: 'createdAt',
			render: (date: string) => moment(date).format('DD/MM/YYYY HH:mm'),
			sorter: (a: any, b: any) => moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf(),
		},
	];

	return (
		<PageContainer>
			<Card>
				<Table columns={columns} dataSource={reviews} rowKey='id' pagination={{ pageSize: 10 }} />

				<Modal
					title='Phản hồi đánh giá'
					visible={replyVisible}
					onOk={() => form.submit()}
					onCancel={() => {
						setReplyVisible(false);
						setSelectedReview(null);
						form.resetFields();
					}}
				>
					<Form form={form} onFinish={submitReply}>
						<Form.Item
							name='staffResponse'
							label='Nội dung phản hồi'
							rules={[{ required: true, message: 'Vui lòng nhập nội dung phản hồi!' }]}
						>
							<Input.TextArea rows={4} />
						</Form.Item>
					</Form>
				</Modal>
			</Card>
		</PageContainer>
	);
};

export default Reviews;
