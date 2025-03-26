import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, InputNumber, Space, Tag, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import subjectService from '../services/subjectService';
import type { Subject } from '../services/subjectService';

const SubjectsPage: React.FC = () => {
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
	const [form] = Form.useForm();

	// Load dữ liệu
	const loadSubjects = () => {
		const data = subjectService.getAll();
		setSubjects(data);
	};

	useEffect(() => {
		loadSubjects();
	}, []);

	// Xử lý thêm/sửa môn học
	const handleSubmit = (values: any) => {
		const knowledgeBlocks = values.knowledgeBlocks
			.split(',')
			.map((block: string) => block.trim())
			.filter((block: string) => block);

		const subject: Subject = {
			id: editingSubject?.id || Date.now().toString(),
			...values,
			knowledgeBlocks,
		};

		try {
			if (editingSubject) {
				subjectService.update(subject);
				message.success('Cập nhật môn học thành công!');
			} else {
				subjectService.add(subject);
				message.success('Thêm môn học thành công!');
			}

			setIsModalVisible(false);
			form.resetFields();
			setEditingSubject(null);
			loadSubjects();
		} catch (error) {
			message.error('Có lỗi xảy ra khi lưu môn học!');
		}
	};

	// Xử lý xóa môn học
	const handleDelete = (id: string) => {
		try {
			subjectService.delete(id);
			message.success('Xóa môn học thành công!');
			loadSubjects();
		} catch (error) {
			message.error('Có lỗi xảy ra khi xóa môn học!');
		}
	};

	// Xử lý mở modal chỉnh sửa
	const handleEdit = (record: Subject) => {
		setEditingSubject(record);
		form.setFieldsValue({
			...record,
			knowledgeBlocks: record.knowledgeBlocks.join(', '),
		});
		setIsModalVisible(true);
	};

	const columns = [
		{
			title: 'Mã môn',
			dataIndex: 'code',
			key: 'code',
		},
		{
			title: 'Tên môn',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Số tín chỉ',
			dataIndex: 'credits',
			key: 'credits',
		},
		{
			title: 'Khối kiến thức',
			dataIndex: 'knowledgeBlocks',
			key: 'knowledgeBlocks',
			render: (blocks: string[]) => (
				<>
					{blocks.map((block) => (
						<Tag color='blue' key={block}>
							{block}
						</Tag>
					))}
				</>
			),
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: Subject) => (
				<Space>
					<Button type='primary' icon={<EditOutlined />} onClick={() => handleEdit(record)}>
						Sửa
					</Button>
					<Popconfirm
						title='Bạn có chắc chắn muốn xóa môn học này?'
						onConfirm={() => handleDelete(record.id)}
						okText='Có'
						cancelText='Không'
					>
						<Button type='primary' danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Card title='Quản lý môn học'>
			<Button
				type='primary'
				icon={<PlusOutlined />}
				onClick={() => {
					setIsModalVisible(true);
					setEditingSubject(null);
					form.resetFields();
				}}
				style={{ marginBottom: 16 }}
			>
				Thêm môn học
			</Button>

			<Table columns={columns} dataSource={subjects} rowKey='id' />

			<Modal
				title={editingSubject ? 'Sửa môn học' : 'Thêm môn học mới'}
				visible={isModalVisible}
				onCancel={() => {
					setIsModalVisible(false);
					setEditingSubject(null);
					form.resetFields();
				}}
				onOk={() => form.submit()}
			>
				<Form form={form} layout='vertical' onFinish={handleSubmit}>
					<Form.Item name='code' label='Mã môn học' rules={[{ required: true, message: 'Vui lòng nhập mã môn học!' }]}>
						<Input placeholder='Nhập mã môn học' />
					</Form.Item>

					<Form.Item
						name='name'
						label='Tên môn học'
						rules={[{ required: true, message: 'Vui lòng nhập tên môn học!' }]}
					>
						<Input placeholder='Nhập tên môn học' />
					</Form.Item>

					<Form.Item
						name='credits'
						label='Số tín chỉ'
						rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ!' }]}
					>
						<InputNumber min={1} max={10} style={{ width: '100%' }} />
					</Form.Item>

					<Form.Item
						name='knowledgeBlocks'
						label='Khối kiến thức'
						rules={[{ required: true, message: 'Vui lòng nhập khối kiến thức!' }]}
						help='Nhập các khối kiến thức, phân cách bằng dấu phẩy'
					>
						<Input.TextArea placeholder='VD: Đại cương, Cơ sở ngành, Chuyên ngành' />
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default SubjectsPage;
