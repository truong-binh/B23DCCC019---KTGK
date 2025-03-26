import type { Question } from './questionService';

export interface ExamStructure {
	difficulty: string;
	knowledgeBlock: string;
	count: number;
}

export interface Exam {
	id: string;
	name: string;
	subjectId: string;
	questions: string[];
	structure: ExamStructure[];
	createdAt: string;
}

const examService = {
	getAll: (): Exam[] => {
		return JSON.parse(localStorage.getItem('exams') || '[]');
	},

	add: (exam: Exam) => {
		const exams = examService.getAll();
		exams.push(exam);
		localStorage.setItem('exams', JSON.stringify(exams));
	},

	delete: (id: string) => {
		const exams = examService.getAll();
		const newExams = exams.filter((e) => e.id !== id);
		localStorage.setItem('exams', JSON.stringify(newExams));
	},

	generateExam: (subjectId: string, structure: ExamStructure[], availableQuestions: Question[]): string[] => {
		if (!availableQuestions || !Array.isArray(availableQuestions)) {
			throw new Error('Không có câu hỏi nào cho môn học này');
		}

		const subjectQuestions = availableQuestions.filter((q) => q.subjectId === subjectId);
		const selectedQuestions: string[] = [];

		for (const req of structure) {
			const matchingQuestions = subjectQuestions.filter(
				(q) =>
					q.difficulty === req.difficulty &&
					q.knowledgeBlock === req.knowledgeBlock &&
					!selectedQuestions.includes(q.id),
			);

			if (matchingQuestions.length < req.count) {
				throw new Error(
					`Không đủ câu hỏi cho mức độ "${req.difficulty}" và khối kiến thức "${req.knowledgeBlock}". ` +
						`Yêu cầu ${req.count} câu, hiện có ${matchingQuestions.length} câu.`,
				);
			}

			const shuffled = [...matchingQuestions].sort(() => 0.5 - Math.random());
			const selected = shuffled.slice(0, req.count);
			selectedQuestions.push(...selected.map((q) => q.id));
		}

		return selectedQuestions;
	},
};

export default examService;
