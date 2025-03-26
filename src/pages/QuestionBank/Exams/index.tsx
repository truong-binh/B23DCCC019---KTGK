import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, InputNumber, Space, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import subjectService from '../services/subjectService';
import questionService from '../services/questionService';
import examService from '../services/examService';
import type { Subject } from '../services/subjectService';
import type { Question } from '../services/questionService';
import type { Exam, ExamStructure } from '../services/examService';

const { Option } = Select;

const difficultyOptions = [
	{ label: 'Dễ', value: 'easy' },
	{ label: 'Trung bình', value: 'medium' },
	{ label: 'Khó', value: 'hard' },
	{ label: 'Rất khó', value: 'very_hard' },
];

const ExamsPage: React.FC = () => {
	const [exams, setExams] = useState<any[]>([]);
	const [subjects, setSubjects] = useState<any[]>([]);
	const [questions, setQuestions] = useState<any[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isPreviewVisible, setIsPreviewVisible] = useState(false);
	const [selectedExam, setSelectedExam] = useState<any>(null);
	const [selectedSubject, setSelectedSubject] = useState<string>('');
	const [examStructure, setExamStructure] = useState<any[]>([]);
	const [form] = Form.useForm();

	// Load dữ liệu
	const loadData = () => {
		setExams(examService.getAll());
		setSubjects(subjectService.getAll());
		setQuestions(questionService.getAll());
	};

	useEffect(() => {
		loadData();
	}, []);

	// Xử lý khi chọn môn học
	const handleSubjectChange = (value: string) => {
		setSelectedSubject(value);
		setExamStructure([]);
	};

	// Thêm yêu cầu cấu trúc đề
	const addStructureItem = () => {
		setExamStructure([...examStructure, { difficulty: '', knowledgeBlock: '', count: 1 }]);
	};

	// Xóa yêu cầu cấu trúc đề
	const removeStructureItem = (index: number) => {
		const newStructure = [...examStructure];
		newStructure.splice(index, 1);
		setExamStructure(newStructure);
	};

	// Tạo đề thi
	const handleCreateExam = (values: any) => {
		try {
			if (!selectedSubject) {
				message.error('Vui lòng chọn môn học!');
				return;
			}

			if (examStructure.length === 0) {
				message.error('Vui lòng thêm ít nhất một phần cho đề thi!');
				return;
			}

			const structure = examStructure.map((item, index) => ({
				difficulty: values[`difficulty_${index}`],
				knowledgeBlock: values[`knowledgeBlock_${index}`],
				count: values[`count_${index}`],
			}));

			// Truyền danh sách câu hỏi hiện có vào hàm generateExam
			const selectedQuestions = examService.generateExam(selectedSubject, structure, questions);

			const exam: Exam = {
				id: Date.now().toString(),
				name: values.name,
				subjectId: selectedSubject,
				createdAt: new Date().toISOString(),
				structure,
				questions: selectedQuestions,
			};

			examService.add(exam);
			message.success('Tạo đề thi thành công!');
			setIsModalVisible(false);
			form.resetFields();
			setExamStructure([]);
			loadData();
		} catch (error: any) {
			message.error(error.message || 'Có lỗi xảy ra khi tạo đề thi!');
		}
	};

	// Xem chi tiết đề thi
	const handlePreview = (exam: any) => {
		setSelectedExam(exam);
		setIsPreviewVisible(true);
	};

	// Xóa đề thi
	const handleDelete = (id: string) => {
		examService.delete(id);
		message.success('Xóa đề thi thành công!');
		loadData();
	};

	const columns = [
		{
			title: 'Tên đề thi',
			dataIndex: 'name',
			key: 'name',
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
			title: 'Số câu hỏi',
			dataIndex: 'questions',
			key: 'questionCount',
			render: (questions: string[] | undefined) => {
				if (!questions) return 0;
				return questions.length;
			},
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			key: 'createdAt',
			render: (date: string) => new Date(date).toLocaleDateString(),
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: any) => (
				<Space>
					<Button type='primary' icon={<EyeOutlined />} onClick={() => handlePreview(record)}>
						Xem
					</Button>
					<Popconfirm
						title='Bạn có chắc chắn muốn xóa đề thi này?'
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
		<Card title='Quản lý đề thi'>
			<Button
				type='primary'
				icon={<PlusOutlined />}
				onClick={() => setIsModalVisible(true)}
				style={{ marginBottom: 16 }}
			>
				Tạo đề thi mới
			</Button>

			<Table columns={columns} dataSource={exams} rowKey='id' />

			{/* Modal tạo đề thi */}
			<Modal
				title='Tạo đề thi mới'
				visible={isModalVisible}
				onCancel={() => {
					setIsModalVisible(false);
					setExamStructure([]);
					form.resetFields();
				}}
				onOk={() => form.submit()}
				width={800}
			>
				<Form form={form} layout='vertical' onFinish={handleCreateExam}>
					<Form.Item name='name' label='Tên đề thi' rules={[{ required: true, message: 'Vui lòng nhập tên đề thi!' }]}>
						<Input placeholder='Nhập tên đề thi' />
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

					{examStructure.map((item, index) => (
						<Card
							key={index}
							size='small'
							title={`Phần ${index + 1}`}
							extra={
								<Button type='link' danger onClick={() => removeStructureItem(index)}>
									Xóa
								</Button>
							}
							style={{ marginBottom: 16 }}
						>
							<Form.Item
								name={`difficulty_${index}`}
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
								name={`knowledgeBlock_${index}`}
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

							<Form.Item
								name={`count_${index}`}
								label='Số lượng câu hỏi'
								rules={[{ required: true, message: 'Vui lòng nhập số lượng câu hỏi!' }]}
							>
								<InputNumber min={1} style={{ width: '100%' }} />
							</Form.Item>
						</Card>
					))}

					<Button type='dashed' onClick={addStructureItem} block>
						+ Thêm phần
					</Button>
				</Form>
			</Modal>

			{/* Modal xem đề thi */}
			<Modal
				title={`Chi tiết đề thi: ${selectedExam?.name}`}
				visible={isPreviewVisible}
				onCancel={() => setIsPreviewVisible(false)}
				footer={null}
				width={800}
			>
				{selectedExam && (
					<>
						<p>
							<strong>Môn học:</strong> {subjects.find((s) => s.id === selectedExam.subjectId)?.name}
						</p>
						<p>
							<strong>Cấu trúc đề thi:</strong>
						</p>
						{selectedExam.structure.map((item: any, index: number) => (
							<div key={index} style={{ marginLeft: 20, marginBottom: 10 }}>
								<p>
									Phần {index + 1}: {item.count} câu {difficultyOptions.find((o) => o.value === item.difficulty)?.label}
									, Khối kiến thức: {item.knowledgeBlock}
								</p>
							</div>
						))}
						<p>
							<strong>Danh sách câu hỏi:</strong>
						</p>
						{selectedExam.questions.map((questionId: string, index: number) => {
							const question = questions.find((q) => q.id === questionId);
							return (
								<Card key={questionId} size='small' style={{ marginBottom: 10 }}>
									<p>
										<strong>Câu {index + 1}:</strong> {question?.content}
									</p>
									<p>
										<Tag color='blue'>{difficultyOptions.find((o) => o.value === question?.difficulty)?.label}</Tag>
										<Tag color='green'>{question?.knowledgeBlock}</Tag>
									</p>
								</Card>
							);
						})}
					</>
				)}
			</Modal>
		</Card>
	);
};

export default ExamsPage;
