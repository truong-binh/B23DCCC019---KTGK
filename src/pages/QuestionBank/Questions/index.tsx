import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import questionService from '../services/questionService';
import subjectService from '../services/subjectService';
import type { Question } from '../services/questionService';
import type { Subject } from '../services/subjectService';

const { Option } = Select;
const { TextArea } = Input;

const difficultyOptions = [
	{ label: 'Dễ', value: 'easy' },
	{ label: 'Trung bình', value: 'medium' },
	{ label: 'Khó', value: 'hard' },
	{ label: 'Rất khó', value: 'very_hard' },
];

const QuestionsPage: React.FC = () => {
	const [questions, setQuestions] = useState<Question[]>([]);
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
	const [selectedSubject, setSelectedSubject] = useState<string>('');
	const [form] = Form.useForm();

	// Thêm state cho bộ lọc
	const [filters, setFilters] = useState({
		searchText: '',
		subjectId: '',
		difficulty: '',
		knowledgeBlock: '',
	});

	// Load dữ liệu
	const loadData = () => {
		try {
			const questionsData = questionService.getAll();
			const subjectsData = subjectService.getAll();
			setQuestions(questionsData);
			setSubjects(subjectsData);
		} catch (error) {
			message.error('Có lỗi khi tải dữ liệu');
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	// Xử lý khi chọn môn học
	const handleSubjectChange = (value: string) => {
		setSelectedSubject(value);
		form.setFieldsValue({
			knowledgeBlock: undefined,
		});
	};

	// Sửa lại hàm handleSubmit để không tự sinh mã câu hỏi
	const handleSubmit = (values: any) => {
		try {
			const question: Question = {
				id: editingQuestion?.id || Date.now().toString(),
				...values, // Sử dụng mã câu hỏi từ form thay vì tự sinh
			};

			if (editingQuestion) {
				questionService.update(question);
				message.success('Cập nhật câu hỏi thành công!');
			} else {
				questionService.add(question);
				message.success('Thêm câu hỏi thành công!');
			}

			setIsModalVisible(false);
			form.resetFields();
			setEditingQuestion(null);
			loadData();
		} catch (error) {
			message.error('Có lỗi xảy ra khi lưu câu hỏi!');
		}
	};

	// Xử lý xóa câu hỏi
	const handleDelete = (id: string) => {
		try {
			questionService.delete(id);
			message.success('Xóa câu hỏi thành công!');
			loadData();
		} catch (error) {
			message.error('Có lỗi xảy ra khi xóa câu hỏi!');
		}
	};

	// Xử lý mở modal chỉnh sửa
	const handleEdit = (record: Question) => {
		setEditingQuestion(record);
		setSelectedSubject(record.subjectId);
		form.setFieldsValue(record);
		setIsModalVisible(true);
	};

	// Thêm hàm lọc câu hỏi
	const getFilteredQuestions = () => {
		return questions.filter((question) => {
			const matchSearch =
				!filters.searchText ||
				question.content.toLowerCase().includes(filters.searchText.toLowerCase()) ||
				question.code.toLowerCase().includes(filters.searchText.toLowerCase());

			const matchSubject = !filters.subjectId || question.subjectId === filters.subjectId;
			const matchDifficulty = !filters.difficulty || question.difficulty === filters.difficulty;
			const matchKnowledgeBlock = !filters.knowledgeBlock || question.knowledgeBlock === filters.knowledgeBlock;

			return matchSearch && matchSubject && matchDifficulty && matchKnowledgeBlock;
		});
	};

	const columns = [
		{
			title: 'Mã câu hỏi',
			dataIndex: 'code',
			key: 'code',
		},
		{
			title: 'Môn học',
			dataIndex: 'subjectId',
			key: 'subjectId',
			render: (subjectId: string) => {
				const subject = subjects.find((s) => s.id === subjectId);
				return subject?.name || '';
			},
		},
		{
			title: 'Nội dung',
			dataIndex: 'content',
			key: 'content',
			ellipsis: true,
		},
		{
			title: 'Mức độ',
			dataIndex: 'difficulty',
			key: 'difficulty',
			render: (difficulty: string) => {
				const option = difficultyOptions.find((o) => o.value === difficulty);
				return option?.label || difficulty;
			},
		},
		{
			title: 'Khối kiến thức',
			dataIndex: 'knowledgeBlock',
			key: 'knowledgeBlock',
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: Question) => (
				<Space>
					<Button type='primary' icon={<EditOutlined />} onClick={() => handleEdit(record)}>
						Sửa
					</Button>
					<Popconfirm
						title='Bạn có chắc chắn muốn xóa câu hỏi này?'
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
		<Card title='Quản lý câu hỏi'>
			{/* Thêm phần bộ lọc */}
			<Card style={{ marginBottom: 16 }}>
				<Space direction='vertical' style={{ width: '100%' }}>
					<Row gutter={16}>
						<Col span={6}>
							<Input
								placeholder='Tìm kiếm theo mã hoặc nội dung'
								value={filters.searchText}
								onChange={(e) => setFilters({ ...filters, searchText: e.target.value })}
								allowClear
							/>
						</Col>
						<Col span={6}>
							<Select
								placeholder='Chọn môn học'
								value={filters.subjectId}
								onChange={(value) => {
									setFilters({ ...filters, subjectId: value, knowledgeBlock: '' });
								}}
								style={{ width: '100%' }}
								allowClear
							>
								{subjects.map((subject) => (
									<Option key={subject.id} value={subject.id}>
										{subject.name}
									</Option>
								))}
							</Select>
						</Col>
						<Col span={6}>
							<Select
								placeholder='Chọn mức độ khó'
								value={filters.difficulty}
								onChange={(value) => setFilters({ ...filters, difficulty: value })}
								style={{ width: '100%' }}
								allowClear
							>
								{difficultyOptions.map((option) => (
									<Option key={option.value} value={option.value}>
										{option.label}
									</Option>
								))}
							</Select>
						</Col>
						<Col span={6}>
							<Select
								placeholder='Chọn khối kiến thức'
								value={filters.knowledgeBlock}
								onChange={(value) => setFilters({ ...filters, knowledgeBlock: value })}
								style={{ width: '100%' }}
								disabled={!filters.subjectId}
								allowClear
							>
								{filters.subjectId &&
									subjects
										.find((s) => s.id === filters.subjectId)
										?.knowledgeBlocks.map((block) => (
											<Option key={block} value={block}>
												{block}
											</Option>
										))}
							</Select>
						</Col>
					</Row>
				</Space>
			</Card>

			<Button
				type='primary'
				icon={<PlusOutlined />}
				onClick={() => {
					setIsModalVisible(true);
					setEditingQuestion(null);
					form.resetFields();
				}}
				style={{ marginBottom: 16 }}
			>
				Thêm câu hỏi
			</Button>

			<Table columns={columns} dataSource={getFilteredQuestions()} rowKey='id' />

			<Modal
				title={editingQuestion ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}
				visible={isModalVisible}
				onCancel={() => {
					setIsModalVisible(false);
					setEditingQuestion(null);
					form.resetFields();
				}}
				onOk={() => form.submit()}
				width={800}
			>
				<Form form={form} layout='vertical' onFinish={handleSubmit}>
					<Form.Item name='code' label='Mã câu hỏi' rules={[{ required: true, message: 'Vui lòng nhập mã câu hỏi!' }]}>
						<Input placeholder='Nhập mã câu hỏi' />
					</Form.Item>

					<Form.Item name='subjectId' label='Môn học' rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}>
						<Select placeholder='Chọn môn học' onChange={handleSubjectChange}>
							{subjects.map((subject) => (
								<Option key={subject.id} value={subject.id}>
									{subject.name}
								</Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item
						name='content'
						label='Nội dung câu hỏi'
						rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi!' }]}
					>
						<TextArea rows={4} placeholder='Nhập nội dung câu hỏi' />
					</Form.Item>

					<Form.Item
						name='difficulty'
						label='Mức độ khó'
						rules={[{ required: true, message: 'Vui lòng chọn mức độ khó!' }]}
					>
						<Select placeholder='Chọn mức độ khó'>
							{difficultyOptions.map((option) => (
								<Option key={option.value} value={option.value}>
									{option.label}
								</Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item
						name='knowledgeBlock'
						label='Khối kiến thức'
						rules={[{ required: true, message: 'Vui lòng chọn khối kiến thức!' }]}
					>
						<Select placeholder='Chọn khối kiến thức'>
							{selectedSubject &&
								subjects
									.find((s) => s.id === selectedSubject)
									?.knowledgeBlocks.map((block: string) => (
										<Option key={block} value={block}>
											{block}
										</Option>
									))}
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default QuestionsPage;
